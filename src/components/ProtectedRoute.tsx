
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireDietitian?: boolean;
}

const ProtectedRoute = ({ children, requireDietitian = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-nourish-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="ml-3 text-nourish-primary">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireDietitian && user?.role !== "dietitian") {
    // Redirect to user dashboard if dietitian access is required but user is not a dietitian
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
