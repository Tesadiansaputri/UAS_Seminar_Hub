import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react/jsx-runtime";

interface Props {
  children: JSX.Element;
  role?: string;
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {

    if (user?.role === "SUPER_ADMIN") {
      return <Navigate to="/super-admin/dashboard" replace />;
    }

    if (user?.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;