import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { JSX } from "react";

export default function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to="/" replace /> : children;
}