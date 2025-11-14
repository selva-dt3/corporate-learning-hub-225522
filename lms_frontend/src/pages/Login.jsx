import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

/**
 * Login page using Supabase email/password auth.
 * Redirects by role if onboarding is complete, otherwise to onboarding.
 */
// PUBLIC_INTERFACE
export default function Login() {
  const { signIn, session, role, onboardingComplete } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (session) {
    if (!onboardingComplete) return <Navigate to="/onboarding" replace />;
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'hr') return <Navigate to="/hr" replace />;
    return <Navigate to="/" replace />;
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signIn(form.email.trim(), form.password);
      // Next auth state change will redirect
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: '10vh' }}>
      <div className="card">
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Sign in</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 0, marginBottom: '1rem' }}>
          Access your Corporate Learning Hub account
        </p>
        {error && (
          <div className="status error" style={{ display: 'block', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label htmlFor="email">Email</label>
            <input className="input" id="email" name="email" type="email" required value={form.email} onChange={onChange} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password">Password</label>
            <input className="input" id="password" name="password" type="password" required value={form.password} onChange={onChange} />
          </div>
          <button className="btn" type="submit" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
