import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

/**
 * Collect minimal onboarding information for new users.
 * Saves via backend if available, else via Supabase profiles.
 */
// PUBLIC_INTERFACE
export default function Onboarding() {
  const { completeOnboarding, role } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    department: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await completeOnboarding(form);
      // Redirect based on role
      if (role === 'admin') navigate('/admin', { replace: true });
      else if (role === 'hr') navigate('/hr', { replace: true });
      else navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720, marginTop: '4vh' }}>
      <div className="card">
        <h2 style={{ margin: 0 }}>Welcome! Let’s get you set up.</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Please complete your profile to continue.</p>
        {error && <div className="status error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div>
              <label htmlFor="full_name">Full name</label>
              <input id="full_name" name="full_name" className="input" value={form.full_name} onChange={onChange} required />
            </div>
            <div>
              <label htmlFor="department">Department</label>
              <input id="department" name="department" className="input" value={form.department} onChange={onChange} />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Complete onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
