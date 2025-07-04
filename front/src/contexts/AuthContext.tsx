import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, User } from '../types/AuthContextType';

export const API_BASE = '/api/v1/auth';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  );

  const [validated, setValidated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const validatingRef = useRef(false); // 중복 실행 방지

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return null;

    const data: TokenResponse & { user: User } = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("accessToken");

    if (storedUser?.email && token) {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: storedUser.email }),
      });
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAccessToken(null);
    setUser(null);
    setValidated(false);
  };

  const parseJwt = (token: string): any => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("DEBUG: JWT 파싱 실패", e);
      return {};
    }
  };

  // ✅ 토큰 유효 시 사용자 정보 최신화
  const fetchUserInfo = async (token: string): Promise<User | null> => {
    try {
      const res = await fetch("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const raw = await res.json();
        const userData: User = {
          userId: raw.userId,
          userName: raw.username,
          email: raw.email,
          phoneNumber: raw.phoneNumber,
          role: raw.role,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return userData;
      } else {
        console.warn("유저 정보 조회 실패");
        return null;
      }
    } catch (err) {
      console.error("유저 정보 조회 중 에러:", err);
      return null;
    }
  };

  const validateAccessToken = async (): Promise<string | null> => {
    if (validated || validatingRef.current) {
      return localStorage.getItem("accessToken");
    }

    validatingRef.current = true;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("DEBUG: accessToken 없음. 로그아웃 처리");
      logout();
      validatingRef.current = false;
      return null;
    }

    const decoded = parseJwt(token);
    const now = Date.now() / 1000;

    if (!decoded.exp || decoded.exp < now) {
      console.log("DEBUG: accessToken 만료. refreshToken으로 재발급 시도");

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.log("DEBUG: refreshToken 없음. 로그아웃 처리");
        logout();
        validatingRef.current = false;
        return null;
      }

      try {
        const res = await fetch("/api/fastapi/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log("DEBUG: 토큰 재발급 성공", data);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          setAccessToken(data.accessToken);
          setValidated(true);
          validatingRef.current = false;

          await fetchUserInfo(data.accessToken); // ✅ 최신 사용자 정보 반영
          return data.accessToken;
        } else {
          console.log("DEBUG: refreshToken 유효하지 않음. 로그아웃 처리");
          logout();
          validatingRef.current = false;
          return null;
        }
      } catch (err) {
        console.error("DEBUG: 토큰 재발급 실패", err);
        logout();
        validatingRef.current = false;
        return null;
      }
    }

    console.log("DEBUG: accessToken 유효함");
    setValidated(true);
    validatingRef.current = false;
    console.log("토큰 결과:", token);
    await fetchUserInfo(token); // ✅ accessToken이 유효하면 유저 정보 최신화
    return token;
  };

  useEffect(() => {
    validatingRef.current = true;
    validateAccessToken()
      .then((token) => {
        setValidated(!!token);
      })
      .catch((err) => {
        console.error("validateAccessToken 중 오류 발생:", err);
        setValidated(false);
      })
      .finally(() => {
        validatingRef.current = false;
        setAuthLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!accessToken,
        isAdmin: user?.role === "ADMIN",
        isUser: user?.role === "USER",
        login,
        logout,
        validateAccessToken,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export { AuthContext };