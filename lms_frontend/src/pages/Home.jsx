import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Topbar from '../components/layout/Topbar';
import Sidebar from '../components/layout/Sidebar';

/**
 * PUBLIC_INTERFACE
 * Home
 * Polished landing page with role cards (Admin, HR, Employee).
 */
export default function Home() {
  const RoleCard = ({ role, description, to, accent = 'var(--primary)', links = [] }) => (
    <Card className="tile-span-4" role="region" ariaLabel={`${role} card`}
      header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>{role}</strong>
        <Badge variant="info">{role === 'Admin' ? 'Full access' : role === 'HR' ? 'People ops' : 'Learner'}</Badge>
      </div>}
      footer={<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button as={Link} to={to} variant="primary">Open {role}</Button>
        {links.map((l) => (
          <Button key={l.to} as={Link} to={l.to} variant={l.variant || 'secondary'}>{l.label}</Button>
        ))}
      </div>}
    >
      <p style={{ marginTop: 0, color: 'var(--text-secondary)' }}>{description}</p>
      <div style={{
        height: 96,
        borderRadius: 10,
        border: '1px dashed var(--border-color)',
        background: `linear-gradient(135deg, ${accent}14, #F59E0B14)`,
      }} aria-hidden="true" />
    </Card>
  );

  return (
    <>
      <Topbar />
      <div className="layout">
        <Sidebar role={null} />
        <main className="main container">
          <div className="hero" style={{ marginBottom: '1rem' }}>
            <h1 style={{ margin: 0 }}>Corporate Learning Hub</h1>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>
              Explore dashboards by role. This demo runs in no-auth mode.
            </p>
          </div>
          <div className="grid-tiles">
            <RoleCard
              role="Employee"
              to="/employee"
              description="Track your assignments, lessons, and quiz progress."
              accent="var(--primary)"
              links={[{ to: '/lessons', label: 'Lessons', variant: 'secondary' }, { to: '/quizzes', label: 'Quizzes', variant: 'ghost' }]}
            />
            <RoleCard
              role="HR"
              to="/hr"
              description="Manage team learning, review analytics, and coordinate training."
              accent="var(--secondary)"
              links={[{ to: '/analytics', label: 'Analytics', variant: 'primary' }]}
            />
            <RoleCard
              role="Admin"
              to="/admin"
              description="Oversee platform content, users, and global analytics."
              accent="#0EA5E9"
              links={[{ to: '/lessons', label: 'Manage Lessons', variant: 'secondary' }, { to: '/quizzes', label: 'Manage Quizzes', variant: 'ghost' }]}
            />
          </div>
        </main>
      </div>
    </>
  );
}
