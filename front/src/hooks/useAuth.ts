import { useEffect, useState } from 'react';
import { getCurrentUser } from '../features/auth/login/authService';
import userdummy from "../data/userdummy.json"

export function useAuth() {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const login = (email: string, password: string) => {
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

  return { user, isLoggedIn, isAdmin, isUser, login, logout };
}
