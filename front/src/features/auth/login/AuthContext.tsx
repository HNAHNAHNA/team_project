import { createContext, useContext, useState } from 'react';
import { getCurrentUser } from './authService';
import userdummy from "../../../data/userdummy.json";
import type { AuthContextType, User } from '../../../types/AuthContextType';

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }) => {


    const [user, setUser] = useState<User | null>(getCurrentUser());

    const login = (email: string, password: string): User | null => {
        const foundUser = userdummy.find(
            (u) => u.email === email && u.password === password
        );
        if (foundUser) {
            localStorage.setItem('user', JSON.stringify(foundUser));
            setUser(foundUser);
            return foundUser;
        }
        return null;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth는 AuthProvider 안에서만 사용해야 합니다.");
    }
    return context;
};