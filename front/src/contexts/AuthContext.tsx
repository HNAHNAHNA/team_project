import { createContext, useContext, useState, ReactNode } from 'react';
import type { AuthContextType, User } from '../types/AuthContextType';

export const API_BASE = 'http://localhost:8091/api/v1/auth';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });

  const login = async (email: string, password: string): Promise<User | null> => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return null;
    }
    const data: TokenResponse & { user: User } = await res.json();
    // 백엔드에서 user 정보도 같이 내려준다고 가정
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    console.log('로그인 응답 데이터', data)
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('accessToken');

    if (user?.email && token) {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email }),
      });
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
  };

  // 토근 유효성 검사 (없으면 refresh) 
  const validateAccessToken = async (): Promise<string | null> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // DEBUG: accessToken 없음 → 로그인 안된 상태
      console.log("DEBUG: accessToken 없음. 로그아웃 처리");
      logout();
      return null;
    }

    function parseJwt(token: string): any {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error("DEBUG: JWT 파싱 실패", e); // DEBUG
        return {};
      }
    }

    const decoded = parseJwt(token);
    const now = Date.now() / 1000;

    if (!decoded.exp || decoded.exp < now) {
      // DEBUG: accessToken 만료됨 → refresh 시도
      console.log("DEBUG: accessToken 만료. refreshToken으로 재발급 시도");

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // DEBUG: refreshToken 없음 → 완전 만료
        console.log("DEBUG: refreshToken 없음. 로그아웃 처리");
        logout();
        return null;
      }

      try {
        const res = await fetch("http://localhost:8000/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refreshToken }),
        });

        if (res.ok) {
          const data = await res.json();
          // DEBUG: 토큰 재발급 성공
          console.log("DEBUG: 토큰 재발급 성공", data);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          setAccessToken(data.accessToken);
          return data.accessToken;
        } else {
          // DEBUG: refreshToken 유효하지 않음 → 로그아웃
          console.log("DEBUG: refreshToken 유효하지 않음. 로그아웃 처리");
          logout();
          return null;
        }
      } catch (err) {
        console.error("DEBUG: 토큰 재발급 실패", err);
        logout();
        return null;
      }
    }

    // DEBUG: accessToken 유효함
    console.log("DEBUG: accessToken 유효함");
    return token;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!accessToken,
      isAdmin: user?.role === 'ADMIN',
      isUser: user?.role === 'USER',
      login,
      logout,
      validateAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
