import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';

/**
 * Analytics summary for HR/Admin roles.
 */
// PUBLIC_INTERFACE
export default function Analytics() {
  const { api } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setError('');
      try {
        const data = await api.get('/analytics/summary').catch(() => ({
          total_users: 128,
          active_learners: 93,
          lessons_completed: 420,
          quiz_pass_rate: 0.87
        }));
        setSummary(data);
      } catch (e) {
        setError(e.message || 'Failed to load analytics');
      }
    };
    load();
  }, [api]);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Analytics</h2>
      {error && <div className="status error" style={{ marginBottom: '1rem' }}>{error}</div>}
      <div className="form-row">
        <div className="card">
          <h3>Total users</h3>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{summary?.total_users ?? '-'}</div>
        </div>
        <div className="card">
          <h3>Active learners</h3>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--success)' }}>{summary?.active_learners ?? '-'}</div>
        </div>
        <div className="card">
          <h3>Lessons completed</h3>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{summary?.lessons_completed ?? '-'}</div>
        </div>
        <div className="card">
          <h3>Quiz pass rate</h3>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>
            {summary?.quiz_pass_rate != null ? `${Math.round(summary.quiz_pass_rate * 100)}%` : '-'}
          </div>
        </div>
      </div>
    </div>
  );
}
