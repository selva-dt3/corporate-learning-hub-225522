import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';

/**
 * Lessons listing with create and delete (admin/hr).
 * Shows title, created_at, and optional content_url.
 * Gracefully handles RLS errors for non-authorized roles.
 */
// PUBLIC_INTERFACE
export default function Lessons() {
  const { api, role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    content_url: '',
  });
  const isManager = role === 'admin' || role === 'hr';

  const fetchLessons = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/lessons');
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e?.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLessons(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createLesson = async (e) => {
    e?.preventDefault?.();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setCreating(true);
    setError('');
    try {
      // Backend expects LessonCreate: { title, content_url? }
      const payload = { title: form.title.trim() };
      if (form.content_url.trim()) payload.content_url = form.content_url.trim();
      // description is optional and may be ignored by backend; include if backend supports it
      if (form.description.trim()) payload.description = form.description.trim();

      const newLesson = await api.post('/lessons', payload);
      setItems(prev => [newLesson, ...prev]);
      setForm({ title: '', description: '', content_url: '' });
    } catch (e) {
      if (e?.status === 401 || e?.status === 403) {
        setError('You are not authorized to create lessons.');
      } else {
        setError(e?.message || 'Failed to create lesson');
      }
    } finally {
      setCreating(false);
    }
  };

  const deleteLesson = async (id) => {
    setError('');
    try {
      await api.del(`/lessons/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      if (e?.status === 401 || e?.status === 403) {
        setError('You are not authorized to delete lessons.');
      } else {
        setError(e?.message || 'Failed to delete lesson');
      }
    }
  };

  const fmtDate = (d) => {
    if (!d) return '-';
    try {
      const dt = new Date(d);
      return dt.toLocaleString();
    } catch {
      return String(d);
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Lessons</h2>

      {isManager ? (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <form onSubmit={createLesson}>
            <div className="form-row" style={{ marginBottom: '0.75rem' }}>
              <div>
                <label htmlFor="title">Title</label>
                <input id="title" name="title" className="input" required value={form.title} onChange={onChange} placeholder="Lesson title" />
              </div>
              <div>
                <label htmlFor="content_url">Content URL (optional)</label>
                <input id="content_url" name="content_url" className="input" value={form.content_url} onChange={onChange} placeholder="https://…" />
              </div>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="description">Description (optional)</label>
              <input id="description" name="description" className="input" value={form.description} onChange={onChange} placeholder="Short description" />
            </div>
            <div className="form-actions">
              <button className="btn" type="submit" disabled={creating}>
                {creating ? 'Creating…' : 'Create Lesson'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="status warning">You can view lessons assigned to you. Creation and deletion are limited to Admin/HR.</div>
        </div>
      )}

      {error && <div className="status error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="card">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Created</th><th>Content</th><th style={{ width: 120 }}></th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{fmtDate(item.created_at)}</td>
                  <td>
                    {item.content_url ? (
                      <a className="link" href={item.content_url} target="_blank" rel="noreferrer">Open</a>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {isManager ? (
                      <button className="btn" style={{ background: 'var(--error)' }} onClick={() => deleteLesson(item.id)}>
                        Delete
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>No actions</span>
                    )}
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr><td colSpan={4} style={{ color: 'var(--text-secondary)' }}>No lessons yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
