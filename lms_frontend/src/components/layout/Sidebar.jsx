import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation (no-auth mode).
 */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ padding: '0 1rem', marginBottom: '0.75rem' }}>
        <div style={{ fontWeight: 800, color: 'var(--primary)' }}>Learning Hub</div>
      </div>

      <nav>
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Home</NavLink>
        <NavLink to="/employee" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Employee</NavLink>
        <NavLink to="/hr" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>HR</NavLink>
        <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Admin</NavLink>
        <div style={{ padding: '0.6rem 1rem', color: 'var(--text-secondary)', fontSize: 12, marginTop: '0.5rem' }}>
          Content
        </div>
        <NavLink to="/lessons" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Lessons</NavLink>
        <NavLink to="/quizzes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Quizzes</NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Analytics</NavLink>
        {/* Placeholder route (Assignments UI to be added) */}
        <span className="nav-item" aria-disabled="true" title="Assignments UI coming soon" style={{ opacity: 0.6 }}>Assignments</span>
      </nav>
    </aside>
  );
}
