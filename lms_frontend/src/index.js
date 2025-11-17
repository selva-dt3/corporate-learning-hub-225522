import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Router from './router';
import { initEnv } from './config/env';
import { ToastProvider } from './components/ui/Toast';

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
  await initEnv();

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
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AppProvider>
    </React.StrictMode>
  );
})();
