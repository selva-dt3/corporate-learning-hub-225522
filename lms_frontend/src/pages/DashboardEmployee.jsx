import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

/**
 * Employee dashboard: shows personal assignment count and quick links.
 */
// PUBLIC_INTERFACE
export default function DashboardEmployee() {
  const { profile, session, api } = useAuth();
  const [assignmentsCount, setAssignmentsCount] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const uid = session?.user?.id;
      if (!uid) return;
      setError('');
      try {
        const list = await api.get(`/assignments/by-user/${uid}`);
        const count = Array.isArray(list) ? list.length : (list?.items?.length || 0);
        setAssignmentsCount(count);
      } catch (e) {
        // For employees this should be allowed; still handle gracefully
        setError(e?.message || 'Failed to load assignments');
      }
    };
    load();
  }, [api, session]);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Your Learning</h2>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <p>Welcome, {profile?.full_name || 'Employee'}!</p>
        {error && <div className="status error" style={{ marginBottom: '0.5rem' }}>{error}</div>}
        <div className="form-row">
          <div className="card">
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Your assignments</div>
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
