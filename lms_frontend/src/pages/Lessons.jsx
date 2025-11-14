import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';

/**
 * Lessons listing with basic create/delete stubs via API.
 */
// PUBLIC_INTERFACE
export default function Lessons() {
  const { api } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchLessons = async () => {
    setLoading(true);
    setError('');
    try {
      // Stub endpoint; replace once backend is ready
      const data = await api.get('/lessons').catch(() => ([
        { id: '1', title: 'Security Basics', status: 'active' },
        { id: '2', title: 'Company Policies', status: 'draft' }
      ]));
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLessons(); }, []);

  const createLesson = async () => {
    setCreating(true);
    setError('');
    try {
      const newLesson = await api.post('/lessons', { title: 'New Lesson' }).catch(() => ({
        id: String(Date.now()), title: 'New Lesson', status: 'draft'
      }));
      setItems(prev => [newLesson, ...prev]);
    } catch (e) {
      setError(e.message || 'Failed to create lesson');
    } finally {
      setCreating(false);
    }
  };

  const deleteLesson = async (id) => {
    try {
      await api.del(`/lessons/${id}`).catch(() => true);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      setError(e.message || 'Failed to delete lesson');
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Lessons</h2>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="form-actions">
          <button className="btn" onClick={createLesson} disabled={creating}>
            {creating ? 'Creating...' : 'New Lesson'}
          </button>
        </div>
      </div>
      {error && <div className="status error" style={{ marginBottom: '1rem' }}>{error}</div>}
      <div className="card">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>
                    <span className={`status ${item.status === 'active' ? 'success' : 'warning'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn" style={{ background: 'var(--error)' }} onClick={() => deleteLesson(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr><td colSpan={3} style={{ color: 'var(--text-secondary)' }}>No lessons yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
