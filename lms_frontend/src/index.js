import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SupabaseProvider } from './auth/SupabaseProvider';
import Router from './router';

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
