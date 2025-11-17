import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { KPICard, ChartPlaceholder } from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';

/**
 * Analytics summary for HR/Admin roles.
 * Renders KPI cards and chart placeholders.
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

  return (
    <div>
      {accessDenied && (
        <div className="status warning" style={{ display: 'block', marginBottom: '1rem' }}>
          You do not have access to analytics. This section is available to Admin and HR roles.
        </div>
      )}
      {error && <div className="status error" style={{ display: 'block', marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <Card>Loading...</Card>
      ) : (
        <>
          <div className="grid-tiles">
            <div className="tile-span-3 tile-span-4"><KPICard label="Users" value={summary?.users} /></div>
            <div className="tile-span-3 tile-span-4"><KPICard label="Lessons" value={summary?.lessons} /></div>
            <div className="tile-span-3 tile-span-4"><KPICard label="Quizzes" value={summary?.quizzes} /></div>
            <div className="tile-span-3 tile-span-4"><KPICard label="Assignments" value={summary?.assignments} /></div>
            <div className="tile-span-3 tile-span-4"><KPICard label="Quiz submissions" value={summary?.quiz_submissions} /></div>
          </div>

          <div className="grid-tiles" style={{ marginTop: '1rem' }}>
            <div className="tile-span-6 tile-span-12">
              <ChartPlaceholder title="Activity overview" />
            </div>
            <div className="tile-span-6 tile-span-12">
              <ChartPlaceholder title="Top lessons/quizzes" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
