import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SupabaseProvider } from './auth/SupabaseProvider';
import Router from './router';

// Enable React Router v7 behavior flags while staying on v6 to silence warnings.
// These flags are read by react-router when present on the global window object.
// See: https://reactrouter.com/en/main/upgrading/future#future-flags
if (typeof window !== 'undefined') {
  // Opt-in to v7 semantics with no behavior change expected for this app.
  window.__reactRouterFuture = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SupabaseProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </SupabaseProvider>
  </React.StrictMode>
);
