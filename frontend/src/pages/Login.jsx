import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const tickRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      setSeconds(0);
      tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(tickRef.current);
    }
    return () => clearInterval(tickRef.current);
  }, [loading]);

  const getLoadingMessage = () => {
    if (seconds < 3) return 'Connexion...';
    if (seconds < 20) return 'Réveil du serveur en cours...';
    return 'Toujours en train de démarrer, encore un instant...';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === 'string' ? data : 'Identifiants incorrects. Réessaie.');
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 social-btn" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>{getLoadingMessage()}</>
            ) : (
              'Se connecter'
            )}
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