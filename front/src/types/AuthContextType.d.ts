export interface User {
    id: number;
    name: string;
    email: string;
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
}
