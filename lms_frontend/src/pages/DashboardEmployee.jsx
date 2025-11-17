import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

/**
 * Employee dashboard (no-auth mode): shows generic counts and quick links.
 */
// PUBLIC_INTERFACE
export default function DashboardEmployee() {
  const { profile, api } = useAuth();
  const [assignmentsCount, setAssignmentsCount] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setError('');
      try {
        // In no-auth mode we don't have a user id; best-effort generic count
        const list = await api.get(`/assignments`);
        const count = Array.isArray(list) ? list.length : (list?.items?.length || 0);
        setAssignmentsCount(count);
      } catch (e) {
        setError(e?.message || 'Failed to load assignments');
      }
    };
    load();
  }, [api]);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Your Learning</h2>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <p>Welcome, {profile?.full_name || 'Employee'}!</p>
        {error && <div className="status error" style={{ marginBottom: '0.5rem' }}>{error}</div>}
        <div className="form-row">
          <div className="card">
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Assignments (demo)</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{assignmentsCount == null ? '—' : assignmentsCount}</div>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Quick links</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link className="btn" to="/lessons">View Lessons</Link>
          <Link className="btn" to="/quizzes" style={{ background: 'var(--secondary)' }}>View Quizzes</Link>
        </div>
      </div>
    </div>
  );
}
