import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';

/**
 * Analytics summary for HR/Admin roles.
 * Renders cards for keys returned by GET /analytics/summary:
 *  - users, lessons, quizzes, assignments, quiz_submissions
 * Handles 401/403 by showing a role/access message.
 */
// PUBLIC_INTERFACE
export default function Analytics() {
  const { api } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setError('');
      setAccessDenied(false);
      setLoading(true);
      try {
        const data = await api.get('/analytics/summary');
        setSummary(data || {});
      } catch (e) {
        if (e?.status === 401 || e?.status === 403) {
          setAccessDenied(true);
        } else {
          setError(e?.message || 'Failed to load analytics');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [api]);

  const Card = ({ title, value, accent }) => (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent || 'inherit' }}>{value ?? '-'}</div>
    </div>
  );

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Analytics</h2>

      {accessDenied && (
        <div className="status warning" style={{ display: 'block', marginBottom: '1rem' }}>
          You do not have access to analytics. This section is available to Admin and HR roles.
        </div>
      )}
      {error && <div className="status error" style={{ display: 'block', marginBottom: '1rem' }}>{error}</div>}

      <div className="form-row">
        {loading ? (
          <div className="card">Loading...</div>
        ) : (
          <>
            <Card title="Users" value={summary?.users} />
            <Card title="Lessons" value={summary?.lessons} />
            <Card title="Quizzes" value={summary?.quizzes} />
            <Card title="Assignments" value={summary?.assignments} />
            <Card title="Quiz submissions" value={summary?.quiz_submissions} accent="var(--primary)" />
          </>
        )}
      </div>
    </div>
  );
}
