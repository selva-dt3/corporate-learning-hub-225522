import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { KPICard, ChartPlaceholder } from '../components/layout/DashboardLayout';

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
      <Card>
        <p style={{ margin: 0 }}>Welcome, <strong>{profile?.full_name || 'Employee'}</strong>!</p>
      </Card>

      {error && <div className="status error" style={{ margin: '0.75rem 0' }}>{error}</div>}

      <div className="grid-tiles" style={{ marginTop: '1rem' }}>
        <div className="tile-span-4 tile-span-12">
          <KPICard label="Assignments (demo)" value={assignmentsCount == null ? '—' : assignmentsCount} />
        </div>
        <div className="tile-span-8 tile-span-12">
          <ChartPlaceholder title="Your recent activity" />
        </div>
      </div>

      <Card header={<strong>Quick links</strong>} style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button as={Link} to="/lessons">View Lessons</Button>
          <Button as={Link} to="/quizzes" variant="secondary">View Quizzes</Button>
        </div>
      </Card>
    </div>
  );
}
