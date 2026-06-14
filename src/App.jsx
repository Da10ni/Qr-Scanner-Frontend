import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import FeedbackForm from './pages/FeedbackForm.jsx';
import Thanks from './pages/Thanks.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import { isAuthed } from './auth.js';

function Protected({ children }) {
  const location = useLocation();
  if (!isAuthed()) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function App() {
  return (
    <>
      <nav className="topnav">
        <Link to="/" className="brand">QR Feedback</Link>
        <div className="nav-links">
          {isAuthed()
            ? <Link to="/admin">Admin</Link>
            : <Link to="/login">Admin Login</Link>}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<FeedbackForm />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Protected><Admin /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
