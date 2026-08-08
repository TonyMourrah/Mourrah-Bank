import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Identifiants incorrects. Réessaie.');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: 'linear-gradient(135deg, #0a2540 0%, #0d3a5c 100%)' }}
    >
      <div className="card shadow-lg p-4 border-0 card-hover fade-in" style={{ width: '380px' }}>
        <h3 className="mb-1 text-primary fw-bold">Mourrah Envelope</h3>
        <p className="text-muted mb-4">Connecte-toi à ton compte</p>

        {error && (
          <div className="alert alert-danger py-2 fade-in">
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 social-btn">
            Se connecter
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          <small>Pas encore de compte ? <Link to="/register">Inscris-toi</Link></small>
        </p>
        <p className="text-center mt-1 mb-0">
          <Link to="/" className="text-muted text-decoration-none">
            <small><i className="bi bi-arrow-left"></i> Retour à l'accueil</small>
          </Link>
        </p>
      </div>
    </div>
  );
}