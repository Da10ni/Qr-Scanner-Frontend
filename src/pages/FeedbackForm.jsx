import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../auth.js';

const CATEGORIES = ['Service', 'Product', 'Staff', 'Cleanliness', 'Other'];

export default function FeedbackForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', category: '', message: '' });
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!rating) {
      setError('Please select a rating.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl('/api/feedback'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      navigate('/thanks');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>We'd Love Your Feedback</h1>
        <p className="subtitle">Your thoughts help us improve. Takes less than a minute.</p>

        <form onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" value={form.name} onChange={onChange} required placeholder="Your name" />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="you@example.com" />

          <label htmlFor="category">What is your feedback about?</label>
          <select id="category" name="category" value={form.category} onChange={onChange} required>
            <option value="">Select a category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label>How would you rate your experience?</label>
          <div className="rating">
            {[1, 2, 3, 4, 5].map(v => (
              <span
                key={v}
                className={`star ${v <= rating ? 'active' : ''}`}
                onClick={() => setRating(v)}
              >★</span>
            ))}
          </div>

          <label htmlFor="message">Your feedback</label>
          <textarea id="message" name="message" value={form.message} onChange={onChange} required placeholder="Tell us what you think..." />

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
