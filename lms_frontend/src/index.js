import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SupabaseProvider } from './auth/SupabaseProvider';
import Router from './router';

/**
 * React Router v7 future flags:
 * - v7_startTransition: use React.startTransition for navigation updates.
 * - v7_relativeSplatPath: adopt relative splat path resolution coming in v7.
 * We pass these on the router instance to silence v7 deprecation warnings while on v6.
 * Ref: https://reactrouter.com/en/main/upgrading/future#future-flags
 */
const router = createBrowserRouter(
  [
    // Delegate route definitions to our Router component using createRoutesFromElements-like structure.
    // We keep Router as a component that renders <Routes> to avoid changing app behavior.
    // Here we mount a single catch-all element that hosts the app and its routes.
    {
      path: '*',
      element: (
        <Router />
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SupabaseProvider>
      <RouterProvider router={router} />
    </SupabaseProvider>
  </React.StrictMode>
);
