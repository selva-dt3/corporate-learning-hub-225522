import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

/**
 * Admin dashboard: shows analytics summary counts and quick navigation.
 */
// PUBLIC_INTERFACE
export default function DashboardAdmin() {
  const { profile, api } = useAuth();
  const [summary, setSummary] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setError('');
      try {
        const data = await api.get('/analytics/summary');
        setSummary(data || {});
      } catch (e) {
        setError(e?.message || 'Failed to load summary');
      }
    };
    load();
  }, [api]);

  const Stat = ({ label, value }) => (
    <div className="card">
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800 }}>{value ?? '-'}</div>
    </div>
  );

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Admin Dashboard</h2>
      <p className="card">Welcome back, {profile?.full_name || 'Admin'}.</p>

      {error && <div className="status error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="form-row" style={{ marginBottom: '1rem' }}>
        <Stat label="Users" value={summary?.users} />
        <Stat label="Lessons" value={summary?.lessons} />
        <Stat label="Quizzes" value={summary?.quizzes} />
        <Stat label="Assignments" value={summary?.assignments} />
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Quick links</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link className="btn" to="/lessons">Manage Lessons</Link>
          <Link className="btn" to="/quizzes" style={{ background: 'var(--secondary)' }}>Manage Quizzes</Link>
          <Link className="btn" to="/analytics">View Analytics</Link>
        </div>
      </div>
    </div>
  );
}
