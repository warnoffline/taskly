import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({ isAuthenticated, redirectTo = '/auth' }: ProtectedRouteProps) => {
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
