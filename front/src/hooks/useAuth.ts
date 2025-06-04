import { useEffect, useState } from 'react';
import { getCurrentUser } from '../features/auth/login/authService';

export function useAuth() {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const isLoggedIn = !!user;

  return { user, isLoggedIn };
}