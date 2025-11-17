import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { KPICard, ChartPlaceholder } from '../components/layout/DashboardLayout';

/**
 * HR dashboard for assignments and team progress, with analytics snapshot.
 */
// PUBLIC_INTERFACE
export default function DashboardHR() {
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

  return (
    <div>
      <Card>
        <p style={{ margin: 0 }}>Hello <strong>{profile?.full_name || 'HR'}</strong>, monitor team learning progress.</p>
      </Card>

      {error && <div className="status error" style={{ margin: '0.75rem 0' }}>{error}</div>}

      <div className="grid-tiles" style={{ marginTop: '1rem' }}>
        <div className="tile-span-3 tile-span-4"><KPICard label="Users" value={summary?.users} /></div>
        <div className="tile-span-3 tile-span-4"><KPICard label="Lessons" value={summary?.lessons} /></div>
        <div className="tile-span-3 tile-span-4"><KPICard label="Quizzes" value={summary?.quizzes} /></div>
        <div className="tile-span-3 tile-span-4"><KPICard label="Assignments" value={summary?.assignments} /></div>
      </div>

      <div className="grid-tiles" style={{ marginTop: '1rem' }}>
        <div className="tile-span-6 tile-span-12">
          <ChartPlaceholder title="Team completion trends" />
        </div>
        <div className="tile-span-6 tile-span-12">
          <ChartPlaceholder title="Assignments by status" />
        </div>
      </div>

      <Card header={<strong>Quick links</strong>} style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button as={Link} to="/lessons">Manage Lessons</Button>
          <Button as={Link} to="/quizzes" variant="secondary">Manage Quizzes</Button>
          <Button as={Link} to="/analytics" variant="ghost">View Analytics</Button>
        </div>
      </Card>
    </div>
  );
}
