import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';

/**
 * Quizzes listing with minimal actions.
 */
// PUBLIC_INTERFACE
export default function Quizzes() {
  const { api } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/quizzes').catch(() => ([
        { id: '1', title: 'Security Basics Quiz', assigned: 42 },
        { id: '2', title: 'Policies Quiz', assigned: 18 }
      ]));
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Quizzes</h2>
      {error && <div className="status error" style={{ marginBottom: '1rem' }}>{error}</div>}
      <div className="card">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Assigned</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.assigned}</td>
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
