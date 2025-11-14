import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';

/**
 * Quizzes listing with minimal create (admin/hr).
 * Employees see list and an informational note about submissions.
 */
// PUBLIC_INTERFACE
export default function Quizzes() {
  const { api, role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
  });
  const isManager = role === 'admin' || role === 'hr';

  const fetchQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/quizzes');
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e?.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fmtDate = (d) => {
    if (!d) return '-';
    try { return new Date(d).toLocaleString(); } catch { return String(d); }
  };

  const createQuiz = async (e) => {
    e?.preventDefault?.();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setCreating(true);
    setError('');
    try {
      // Minimal default spec: one multiple-choice question with correct answer index 0
      const defaultSpec = {
        version: 1,
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            prompt: 'Sample question: Which option is correct?',
            options: ['Option A (correct)', 'Option B', 'Option C'],
            answerIndex: 0
          }
        ]
      };
      const created = await api.post('/quizzes', { title: form.title.trim(), spec: defaultSpec });
      setItems(prev => [created, ...prev]);
      setForm({ title: '' });
    } catch (e) {
      if (e?.status === 401 || e?.status === 403) {
        setError('You are not authorized to create quizzes.');
      } else {
        setError(e?.message || 'Failed to create quiz');
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Quizzes</h2>

      {isManager ? (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <form onSubmit={createQuiz}>
            <div className="form-row" style={{ marginBottom: '0.75rem' }}>
              <div>
                <label htmlFor="title">Title</label>
                <input id="title" name="title" className="input" required value={form.title} onChange={onChange} placeholder="Quiz title" />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn" type="submit" disabled={creating}>
                {creating ? 'Creating…' : 'Create Quiz'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="status success">Select a quiz to start when available. Submission flow will appear on quiz detail pages.</div>
        </div>
      )}

      {error && <div className="status error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="card">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Created</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{fmtDate(item.created_at)}</td>
                </tr>
              ))}
              {!items.length && (
                <tr><td colSpan={2} style={{ color: 'var(--text-secondary)' }}>No quizzes available.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
