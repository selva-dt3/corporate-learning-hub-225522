import React from 'react';

/**
 * Topbar simplified for no-auth mode.
 */
// PUBLIC_INTERFACE
export default function Topbar() {
  return (
    <div className="App-header" style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      justifyContent: 'space-between',
      backdropFilter: 'saturate(140%) blur(2px)'
    }}>
      <div>
        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Corporate Learning Hub</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span className="status success" aria-label="Public demo badge">public</span>
        <span style={{ color: 'var(--text-secondary)' }}>No Auth</span>
      </div>
    </div>
  );
}
