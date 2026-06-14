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

function TopNav() {
  const { pathname } = useLocation();
  const showAdminNav = pathname === '/login' || pathname === '/admin';

  return (
    <nav className="topnav">
      <Link to="/" className="brand">
        <span className="brand-dot" />
        Feedback
      </Link>
      {showAdminNav && (
        <div className="nav-links">
          {isAuthed() ? <Link to="/admin">Dashboard</Link> : <Link to="/login">Sign in</Link>}
        </div>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <>
      <div className="bg-orbs">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
      </div>
      <TopNav />
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
