import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand navbar-dark px-4 shadow-sm" style={{ backgroundColor: '#0a2540' }}>
      <Link className="navbar-brand" to="/dashboard">Mourrah Bank</Link>
      <div className="navbar-nav me-auto">
        <Link className="nav-link text-white-50 nav-hover" to="/dashboard">Comptes</Link>
        <Link className="nav-link text-white-50 nav-hover" to="/virement">Virement</Link>
        <Link className="nav-link text-white-50 nav-hover" to="/transactions">Historique</Link>
        <Link className="nav-link text-white-50 nav-hover" to="/about">À propos</Link>
      </div>
      <button className="btn btn-outline-light btn-sm social-btn" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-1"></i>Déconnexion
      </button>
    </nav>
  );
}