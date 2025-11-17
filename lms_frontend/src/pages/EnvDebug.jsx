import React from 'react';
import { getStringEnv } from '../config/env';

/**
 * PUBLIC_INTERFACE
 * EnvDebug
 */
export default function EnvDebug() {
  /** Minimal diagnostics for env.js and process.env presence (no secrets). */
  const hasWindowEnv = typeof window !== 'undefined' && !!window._env_;
  const keys = ['REACT_APP_API_BASE_URL'];
  const keysPresent = keys.reduce((acc, k) => {
    acc[k] = Boolean(getStringEnv(k, ''));
    return acc;
  }, {});

  const payload = {
    hasWindowEnv,
    keysPresent,
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Environment Diagnostics</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
{JSON.stringify(payload, null, 2)}
        </pre>
        <p style={{ color: 'var(--text-secondary)' }}>
          Values are masked and only presence booleans are shown. Update public/env.js and hard refresh to apply changes.
        </p>
      </div>
    </div>
  );
}
