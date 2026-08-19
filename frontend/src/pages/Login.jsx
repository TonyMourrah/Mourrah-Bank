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
      className="d-flex align-items-center justify-content-center vh-100 p-3"
      style={{ backgroundColor: '#f4f6f8' }}
    >
      <div className="w-100" style={{ maxWidth: '440px' }}>
        <Link
          to="/"
          className="text-muted text-decoration-none d-inline-flex align-items-center gap-2 mb-3 fw-medium"
        >
          <i className="bi bi-arrow-left"></i> Retour à l'accueil
        </Link>

        <div className="card shadow-sm p-4 p-md-5 border-0 rounded-4 fade-in">
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-1" style={{ color: '#0a3a2a' }}>Mourrah Envelope</h3>
            <p className="text-muted mb-0">Connecte-toi à ton compte</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 fade-in">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-medium">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button
              type="submit"
              className="btn text-white w-100 py-2 fw-medium social-btn"
              style={{ backgroundColor: '#0a3a2a', borderColor: '#0a3a2a' }}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>{getLoadingMessage()}</>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 text-muted">
            <small>
              Pas encore de compte ?{' '}
              <Link to="/register" className="fw-bold text-decoration-none" style={{ color: '#135238' }}>
                Inscris-toi
              </Link>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}