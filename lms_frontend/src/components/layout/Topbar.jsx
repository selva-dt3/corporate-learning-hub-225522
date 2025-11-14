import React from 'react';
import { useAuth } from '../../auth/useAuth';

/**
 * Topbar displaying role, user, and actions.
 */
// PUBLIC_INTERFACE
export default function Topbar() {
  const { role, profile, signOut } = useAuth();

  return (
    <div className="App-header" style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      justifyContent: 'space-between'
    }}>
      <div>
        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Corporate Learning Hub</span>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span className="status success">{role || 'guest'}</span>
        <span style={{ color: 'var(--text-secondary)' }}>{profile?.full_name || 'User'}</span>
        <button className="btn" onClick={signOut} style={{ background: 'var(--error)' }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
