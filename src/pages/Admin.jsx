import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, clearToken } from '../auth.js';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function StarsCell({ n }) {
  return <span className="stars-cell">{'★'.repeat(n)}<span style={{ color: '#cbd5e0' }}>{'★'.repeat(5 - n)}</span></span>;
}

export default function Admin() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/feedback');
      setItems(data);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        navigate('/login', { replace: true });
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm('Delete this feedback entry?')) return;
    try {
      await apiFetch(`/api/feedback/${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const onLogout = () => {
    clearToken();
    navigate('/login', { replace: true });
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(i =>
      i.name?.toLowerCase().includes(q) ||
      i.email?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q) ||
      i.message?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const avgRating = items.length
    ? (items.reduce((s, i) => s + i.rating, 0) / items.length).toFixed(1)
    : '—';

  return (
    <div className="page">
      <div className="card wide">
        <div className="admin-header">
          <h1>Feedback Dashboard</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="secondary" onClick={load}>Refresh</button>
            <button className="danger" onClick={onLogout}>Logout</button>
          </div>
        </div>

        <div className="stats">
          <div className="stat"><div className="num">{items.length}</div><div className="lbl">Total</div></div>
          <div className="stat"><div className="num">{avgRating}</div><div className="lbl">Avg Rating</div></div>
          <div className="stat"><div className="num">{items.filter(i => i.rating >= 4).length}</div><div className="lbl">Positive (4★+)</div></div>
          <div className="stat"><div className="num">{items.filter(i => i.rating <= 2).length}</div><div className="lbl">Negative (≤2★)</div></div>
        </div>

        <input
          type="text"
          placeholder="Search by name, email, category, or message..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="empty">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            {items.length === 0 ? 'No feedback yet. Share the QR code to start collecting responses.' : 'No matches for your search.'}
          </div>
        ) : (
          <table className="feedback-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Name</th>
                <th>Email</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Message</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i._id}>
                  <td>{formatDate(i.createdAt)}</td>
                  <td>{i.name}</td>
                  <td>{i.email}</td>
                  <td>{i.category}</td>
                  <td><StarsCell n={i.rating} /></td>
                  <td className="msg">{i.message}</td>
                  <td><button className="del-btn" onClick={() => onDelete(i._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
