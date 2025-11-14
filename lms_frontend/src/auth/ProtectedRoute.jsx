import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from './SupabaseProvider';

/**
 * Protects nested routes by requiring authentication and optional roles.
 *
 * Props:
 * - roles?: string[] restrict access to these roles (e.g., ['admin'])
 */
// PUBLIC_INTERFACE
export default function ProtectedRoute({ roles }) {
  const { session, role, loading, onboardingComplete } = useAuthContext();

  if (loading) {
    return (
      <div className="container">
        <div className="card">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && (!role || !roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  // If user isn't onboarded, redirect to onboarding (except when already there)
  const isOnboardingRoute = window.location.pathname.startsWith('/onboarding');
  if (!onboardingComplete && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
