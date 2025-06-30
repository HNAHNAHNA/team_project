import type { ReactNode } from 'react';
import type { AuthContextType } from '../types/AuthContextType';
export declare const API_BASE = "/api/v1/auth";
declare const AuthContext: import("react").Context<AuthContextType | null>;
export declare const AuthProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => AuthContextType;
export { AuthContext };
