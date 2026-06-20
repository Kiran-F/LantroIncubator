import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { user, profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">
            Lantro<span className="navbar-logo-accent">Spark</span>
          </span>
        </Link>

        {/* Nav Links */}
        {user && (
          <div className="navbar-links">
            <Link to="/ideas" className="navbar-link">Ideas</Link>
            {isAdmin && <Link to="/admin" className="navbar-link">Dashboard</Link>}
            {isAdmin && <Link to="/admin/insights" className="navbar-link navbar-link-ai">
              ✨ AI Insights
            </Link>}
          </div>
        )}

        {/* Right side */}
        <div className="navbar-right">
          {user ? (
            <>
              <Link to="/ideas/new" className="btn btn-primary btn-sm">
                + Submit Idea
              </Link>
              <div className="navbar-user">
                <div className="navbar-avatar">
                  {(user.displayName || user.email)?.[0]?.toUpperCase()}
                </div>
                <div className="navbar-user-info">
                  <span className="navbar-user-name">{user.displayName || user.email}</span>
                  <span className="navbar-user-role">{profile?.role || 'EMPLOYEE'}</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-auth-btns">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
