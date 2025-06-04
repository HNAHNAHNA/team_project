import { useEffect, useState } from 'react';
import { getCurrentUser } from '../features/auth/login/authService';

export function useAuth() {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  return { user, isLoggedIn, isAdmin, isUser };
}