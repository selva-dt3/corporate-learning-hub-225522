import React from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Card from '../ui/Card';

/**
 * PUBLIC_INTERFACE
 * DashboardLayout
 * Shared layout for Admin, HR, and Employee dashboards with consistent spacing and containers.
 */
export default function DashboardLayout({ title, subtitle, actions, children }) {
  return (
    <>
      <Topbar />
      <div className="layout">
        <Sidebar role={null} />
        <main className="main container">
          <div className="hero" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: 0 }}>{title}</h2>
                {subtitle ? <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>{subtitle}</p> : null}
              </div>
              {actions ? <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>{actions}</div> : null}
            </div>
          </div>
          {children}
        </main>
      </div>
    </>
  );
}

// PUBLIC_INTERFACE
export function KPICard({ label, value, accent }) {
  return (
    <Card ariaLabel={label}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent || 'inherit' }}>{value ?? '—'}</div>
    </Card>
  );
}

// PUBLIC_INTERFACE
export function ChartPlaceholder({ title = 'Chart', height = 220 }) {
  return (
    <Card header={<strong>{title}</strong>}>
      <div style={{
        height,
        borderRadius: 10,
        background: 'repeating-linear-gradient(90deg, rgba(30,58,138,.08), rgba(30,58,138,.08) 6px, transparent 6px, transparent 12px)',
        border: '1px dashed var(--border-color)'
      }} aria-label={`${title} placeholder`} />
    </Card>
  );
}
