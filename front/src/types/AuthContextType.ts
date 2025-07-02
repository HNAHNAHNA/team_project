export interface User {
  userId: number;            // ✅ 서버 응답에 맞게 수정
  userName: string;
  email: string;
  phoneNumber: string;
  role: 'ADMIN' | 'USER' | 'HOST';
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isUser: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  validateAccessToken: () => Promise<string | null>;
  authLoading: boolean;
}