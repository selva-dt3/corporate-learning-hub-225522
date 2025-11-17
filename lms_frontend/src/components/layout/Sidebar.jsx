import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation (no-auth mode).
 */
export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    ['nav-item', isActive ? 'active' : ''].filter(Boolean).join(' ');
  return (
    <aside className="sidebar" aria-label="Primary">
      <div style={{ padding: '0 1rem', marginBottom: '0.75rem' }}>
        <div style={{ fontWeight: 800, color: 'var(--primary)' }}>Learning Hub</div>
      </div>

      <nav>
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/employee" className={linkClass}>Employee</NavLink>
        <NavLink to="/hr" className={linkClass}>HR</NavLink>
        <NavLink to="/admin" className={linkClass}>Admin</NavLink>
        <div style={{ padding: '0.6rem 1rem', color: 'var(--text-secondary)', fontSize: 12, marginTop: '0.5rem' }}>
          Content
        </div>
        <NavLink to="/lessons" className={linkClass}>Lessons</NavLink>
        <NavLink to="/quizzes" className={linkClass}>Quizzes</NavLink>
        <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
        <span className="nav-item" aria-disabled="true" title="Assignments UI coming soon" style={{ opacity: 0.6 }}>Assignments</span>
      </nav>
    </aside>
  );
}
