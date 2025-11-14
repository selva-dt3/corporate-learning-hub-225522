import React from 'react';
import { useAuth } from '../auth/useAuth';

/**
 * Admin dashboard showcasing quick actions and system overview.
 */
// PUBLIC_INTERFACE
export default function DashboardAdmin() {
  const { profile } = useAuth();
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Admin Dashboard</h2>
      <p className="card">Welcome back, {profile?.full_name || 'Admin'}.</p>
      <div className="form-row">
        <div className="card">
          <h3>Users</h3>
          <p className="status warning">Coming soon: user creation and role assignment.</p>
        </div>
        <div className="card">
          <h3>Content</h3>
          <p className="status warning">Coming soon: lessons and quizzes management.</p>
        </div>
      </div>
    </div>
  );
}
