import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-center">Loading…</div>;
  }

  // If no authenticated user, go to auth
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname + location.search }} />;
  }

  // If user exists but profile not completed, force profile setup instead of showing protected content
  if (!user.user_metadata?.profile_completed) {
    if (location.pathname !== '/setup-profile') {
      return <Navigate to="/setup-profile" replace state={{ from: location.pathname + location.search }} />;
    }
  }

  return children;
}
