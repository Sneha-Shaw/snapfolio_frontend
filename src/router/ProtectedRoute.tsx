import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PageSpinner } from '@/components/ui';
import type { Role } from '@/types/models';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageSpinner />;
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;

  return <Outlet />;
}

/** `redirectTo`: where a signed-in visitor goes instead (checkout sends new accounts to setup). */
export function GuestOnlyRoute({ redirectTo = '/admin' }: { redirectTo?: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageSpinner />;
  if (user) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
}

/** Nested inside ProtectedRoute: sends accounts without one of `roles` back to the dashboard. */
export function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) return <Navigate to="/admin" replace />;
  return <Outlet />;
}
