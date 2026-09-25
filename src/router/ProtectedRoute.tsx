import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PageSpinner } from '@/components/ui';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageSpinner />;
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;

  return <Outlet />;
}

export function GuestOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageSpinner />;
  if (user) return <Navigate to="/admin" replace />;

  return <Outlet />;
}
