import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
}
