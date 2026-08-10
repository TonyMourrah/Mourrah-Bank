import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand navbar-dark px-4 shadow-sm" style={{ backgroundColor: '#0a2540' }}>
      <Link className="navbar-brand" to="/dashboard">Mourrah Envelope</Link>
      <div className="navbar-nav me-auto">
        <Link className="nav-link text-white-50 nav-hover" to="/dashboard">Enveloppes</Link>
        <Link className="nav-link text-white-50 nav-hover" to="/reallocation">Réallocation</Link>
        <Link className="nav-link text-white-50 nav-hover" to="/transactions">Historique</Link>
        <Link className="nav-link text-white-50 nav-hover" to="/settings">Paramètres</Link>
        {user?.role === 'ADMIN' && (
          <Link className="nav-link text-white-50 nav-hover" to="/admin">
            <i className="bi bi-shield-lock me-1"></i>Admin
          </Link>
        )}
        <Link className="nav-link text-white-50 nav-hover" to="/about">À propos</Link>
      </div>
      {user && (
        <div className="d-flex align-items-center gap-2 me-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px', backgroundColor: '#c9a24b', fontSize: '0.8rem', fontWeight: 'bold', color: '#0a2540' }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="d-none d-md-block">
            <div className="text-white small fw-bold" style={{ lineHeight: 1 }}>{user.username}</div>
            <div className="text-white-50" style={{ fontSize: '0.7rem' }}>{user.role}</div>
          </div>
        </div>
      )}
      <button className="btn btn-outline-light btn-sm social-btn" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-1"></i>Déconnexion
      </button>
    </nav>
  );
}