import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Sidebar navigation with role-specific sections.
 *
 * Props:
 * - role: 'admin' | 'hr' | 'employee'
 */
// PUBLIC_INTERFACE
export default function Sidebar({ role }) {
  const isManager = role === 'admin' || role === 'hr';

  return (
    <aside className="sidebar">
      <div style={{ padding: '0 1rem', marginBottom: '0.75rem' }}>
        <div style={{ fontWeight: 800, color: 'var(--primary)' }}>Learning Hub</div>
      </div>

      <nav>
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
        <NavLink to="/lessons" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Lessons</NavLink>
        <NavLink to="/quizzes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Quizzes</NavLink>
        {/* Placeholder route (not implemented in this milestone) */}
        <span className="nav-item" aria-disabled="true" title="Assignments page coming soon" style={{ opacity: 0.6 }}>Assignments</span>

        {isManager && (
          <>
            <div style={{ padding: '0.6rem 1rem', color: 'var(--text-secondary)', fontSize: 12, marginTop: '0.5rem' }}>
              HR
            </div>
            <NavLink to="/hr" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>HR Dashboard</NavLink>
            <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Analytics</NavLink>
          </>
        )}

        {role === 'admin' && (
          <>
            <div style={{ padding: '0.6rem 1rem', color: 'var(--text-secondary)', fontSize: 12, marginTop: '0.5rem' }}>
              Admin
            </div>
            <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Admin Dashboard</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
