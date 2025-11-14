import React from 'react';
import { useAuth } from '../auth/useAuth';

/**
 * HR dashboard for assignments and team progress views.
 */
// PUBLIC_INTERFACE
export default function DashboardHR() {
  const { profile } = useAuth();
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>HR Dashboard</h2>
      <p className="card">Hello {profile?.full_name || 'HR'}, monitor team learning progress.</p>
      <div className="card">
        <h3>Team Assignments</h3>
        <p className="status warning">Assignment tools will appear here.</p>
      </div>
    </div>
  );
}
