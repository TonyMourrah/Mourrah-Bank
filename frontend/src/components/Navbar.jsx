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
    <nav className="navbar navbar-expand navbar-dark bg-primary px-4">
      <Link className="navbar-brand" to="/dashboard">Mourrah Bank</Link>
      <div className="navbar-nav me-auto">
        <Link className="nav-link text-white" to="/">Accueil</Link>
        <Link className="nav-link text-white" to="/dashboard">Comptes</Link>
        <Link className="nav-link text-white" to="/virement">Virement</Link>
        <Link className="nav-link text-white" to="/transactions">Historique</Link>
      </div>
      <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
        Déconnexion
      </button>
    </nav>
  );
}