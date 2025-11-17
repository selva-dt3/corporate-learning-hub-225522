import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardHR from './pages/DashboardHR';
import DashboardEmployee from './pages/DashboardEmployee';
import Lessons from './pages/Lessons';
import Quizzes from './pages/Quizzes';
import Analytics from './pages/Analytics';
import EnvDebug from './pages/EnvDebug';
import Home from './pages/Home';
import DashboardLayout from './components/layout/DashboardLayout';

export default function Router() {
  /** Defines application routes without authentication or role-based guards. */
  return (
    <Routes>
      <Route path="/env" element={<EnvDebug />} />
      <Route path="/" element={<Home />} />

      <Route
        path="/employee"
        element={
          <DashboardLayout title="Employee Dashboard" subtitle="Your learning overview">
            <DashboardEmployee />
          </DashboardLayout>
        }
      />
      <Route
        path="/hr"
        element={
          <DashboardLayout title="HR Dashboard" subtitle="Team progress and analytics">
            <DashboardHR />
          </DashboardLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <DashboardLayout title="Admin Dashboard" subtitle="Administration and content management">
            <DashboardAdmin />
          </DashboardLayout>
        }
      />
      <Route
        path="/lessons"
        element={
          <DashboardLayout title="Lessons" subtitle="Create and manage learning content">
            <Lessons />
          </DashboardLayout>
        }
      />
      <Route
        path="/quizzes"
        element={
          <DashboardLayout title="Quizzes" subtitle="Create and manage quizzes">
            <Quizzes />
          </DashboardLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <DashboardLayout title="Analytics" subtitle="Aggregated insights">
            <Analytics />
          </DashboardLayout>
        }
      />

      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/onboarding" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
