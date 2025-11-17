import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Router from './router';
import { initEnv } from './config/env';

/**
 * React Router v7 future flags:
 * - v7_startTransition: use React.startTransition for navigation updates.
 * - v7_relativeSplatPath: adopt relative splat path resolution coming in v7.
 */
const router = createBrowserRouter(
  [
    {
      path: '*',
      element: <Router />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

(async () => {
  // Ensure runtime env is loaded before any component reads it
  await initEnv();

  // Post-init masked diagnostic (no secrets)
  try {
    const hasWindowEnv = typeof window !== 'undefined' && !!window._env_;
    const e = (hasWindowEnv && window._env_) || {};
    // eslint-disable-next-line no-console
    console.info('[bootstrap] env ready', {
      hasWindowEnv,
      REACT_APP_API_BASE_URL: Boolean(e.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_BASE_URL),
    });
  } catch { /* noop */ }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  const { AppProvider } = require('./auth/AppProvider');
  root.render(
    <React.StrictMode>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </React.StrictMode>
  );
})();
