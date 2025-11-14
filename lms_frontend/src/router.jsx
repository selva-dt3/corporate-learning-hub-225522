import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './auth/ProtectedRoute';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardHR from './pages/DashboardHR';
import DashboardEmployee from './pages/DashboardEmployee';
import Lessons from './pages/Lessons';
import Quizzes from './pages/Quizzes';
import Analytics from './pages/Analytics';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import { useAuth } from './auth/useAuth';
import EnvDebug from './pages/EnvDebug';

function Shell({ children }) {
  const { role } = useAuth();
  return (
    <>
      <Topbar />
      <div className="layout">
        <Sidebar role={role} />
        <main className="main container">
          {children}
        </main>
      </div>
    </>
  );
}

// PUBLIC_INTERFACE
export default function Router() {
  /** Defines application routes with role-protected sections. */
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Diagnostics route (safe; shows booleans only) */}
      <Route path="/env" element={<EnvDebug />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      {/* Employee */}
      <Route element={<ProtectedRoute roles={['employee', 'admin', 'hr']} />}>
        <Route
          path="/"
          element={
            <Shell>
              <DashboardEmployee />
            </Shell>
          }
        />
        <Route
          path="/lessons"
          element={
            <Shell>
              <Lessons />
            </Shell>
          }
        />
        <Route
          path="/quizzes"
          element={
            <Shell>
              <Quizzes />
            </Shell>
          }
        />
      </Route>

      {/* HR */}
      <Route element={<ProtectedRoute roles={['hr', 'admin']} />}>
        <Route
          path="/hr"
          element={
            <Shell>
              <DashboardHR />
            </Shell>
          }
        />
        <Route
          path="/analytics"
          element={
            <Shell>
              <Analytics />
            </Shell>
          }
        />
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route
          path="/admin"
          element={
            <Shell>
              <DashboardAdmin />
            </Shell>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
