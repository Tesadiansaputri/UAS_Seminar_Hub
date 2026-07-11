import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react/jsx-runtime";
import { normalizeRole } from "../utils/role";

interface Props {
  children: JSX.Element;
  role?: string;
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user, token } = useAuth();
  const userRole = normalizeRole(user?.role);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {

    if (userRole === "SUPER_ADMIN") {
      return <Navigate to="/super-admin/dashboard" replace />;
    }

    if (userRole === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
