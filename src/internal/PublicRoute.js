import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicRoute() {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) return null;
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
