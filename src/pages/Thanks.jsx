import { Link } from 'react-router-dom';

export default function Thanks() {
  return (
    <div className="page center">
      <div className="card" style={{ textAlign: 'center', maxWidth: 420 }}>
        <div className="thanks-check">✓</div>
        <h1>Thank You!</h1>
        <p className="subtitle" style={{ marginBottom: 6 }}>
          Your feedback has been received. We really appreciate it.
        </p>
        <Link className="link-bottom" to="/">Submit another response</Link>
      </div>
    </div>
  );
}
