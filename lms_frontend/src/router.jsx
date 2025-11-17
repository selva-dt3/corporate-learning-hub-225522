import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Topbar from './components/layout/Topbar';
import Sidebar from './components/layout/Sidebar';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardHR from './pages/DashboardHR';
import DashboardEmployee from './pages/DashboardEmployee';
import Lessons from './pages/Lessons';
import Quizzes from './pages/Quizzes';
import Analytics from './pages/Analytics';
import EnvDebug from './pages/EnvDebug';

/**
 * Minimal Shell without auth/role gating.
 */
function Shell({ children }) {
  return (
    <>
      <Topbar />
      <div className="layout">
        <Sidebar role={null} />
        <main className="main container">
          {children}
        </main>
      </div>
    </>
  );
}

/**
 * PUBLIC_INTERFACE
 * Simple home page linking to the three dashboards and primary sections.
 */
function Home() {
  return (
    <Shell>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>Welcome to Corporate Learning Hub</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          This deployment runs in no-auth mode. All dashboards and sections are publicly accessible for demo and evaluation.
        </p>
      </div>
      <div className="form-row" style={{ marginBottom: '1rem' }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Employee</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Personal learning overview</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link className="btn" to="/employee">Open Employee Dashboard</Link>
            <Link className="btn" to="/lessons" style={{ background: 'var(--secondary)' }}>Lessons</Link>
            <Link className="btn" to="/quizzes">Quizzes</Link>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>HR</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Team progress and analytics</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link className="btn" to="/hr">Open HR Dashboard</Link>
            <Link className="btn" to="/analytics">Analytics</Link>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Admin</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Administration and content management</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link className="btn" to="/admin">Open Admin Dashboard</Link>
          <Link className="btn" to="/lessons" style={{ background: 'var(--secondary)' }}>Manage Lessons</Link>
          <Link className="btn" to="/quizzes">Manage Quizzes</Link>
        </div>
      </div>
    </Shell>
  );
}

// PUBLIC_INTERFACE
export default function Router() {
  /** Defines application routes without authentication or role-based guards. */
  return (
    <Routes>
      {/* Diagnostics route (safe; shows booleans only) */}
      <Route path="/env" element={<EnvDebug />} />

      {/* Public home with links to dashboards */}
      <Route path="/" element={<Home />} />

      {/* Public dashboards and sections */}
      <Route path="/employee" element={
        <Shell><DashboardEmployee /></Shell>
      } />
      <Route path="/hr" element={
        <Shell><DashboardHR /></Shell>
      } />
      <Route path="/admin" element={
        <Shell><DashboardAdmin /></Shell>
      } />
      <Route path="/lessons" element={
        <Shell><Lessons /></Shell>
      } />
      <Route path="/quizzes" element={
        <Shell><Quizzes /></Shell>
      } />
      <Route path="/analytics" element={
        <Shell><Analytics /></Shell>
      } />

      {/* Legacy paths now redirect to home */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/onboarding" element={<Navigate to="/" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
