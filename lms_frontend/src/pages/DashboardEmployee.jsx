import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

/**
 * Employee dashboard for assigned lessons/quizzes.
 */
// PUBLIC_INTERFACE
export default function DashboardEmployee() {
  const { profile } = useAuth();
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Your Learning</h2>
      <div className="card">
        <p>Welcome, {profile?.full_name || 'Employee'}!</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link className="btn" to="/lessons">View Lessons</Link>
          <Link className="btn" to="/quizzes" style={{ background: 'var(--secondary)' }}>View Quizzes</Link>
        </div>
      </div>
    </div>
  );
}
