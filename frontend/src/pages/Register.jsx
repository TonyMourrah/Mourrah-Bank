import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { username, email, password });
      setSuccess('Compte créé avec succès ! Redirection vers la connexion...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object' && data !== null) {
        setError(Object.values(data).join(' '));
      } else {
        setError(data || "Erreur lors de la création du compte.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 p-3"
      style={{ backgroundColor: '#f4f6f8' }}
    >
      <div className="w-100" style={{ maxWidth: '460px' }}>
        <Link
          to="/"
          className="text-muted text-decoration-none d-inline-flex align-items-center gap-2 mb-3 fw-medium"
        >
          <i className="bi bi-arrow-left"></i> Retour à l'accueil
        </Link>

        <div className="card shadow-sm p-4 p-md-5 border-0 rounded-4 fade-in">
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-1" style={{ color: '#0a3a2a' }}>Mourrah Envelope</h3>
            <p className="text-muted mb-0">Crée ton compte</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 fade-in">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}
          {success && (
            <div className="alert alert-success py-2 fade-in">
              <i className="bi bi-check-circle me-2"></i>{success}
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
            <div className="mb-3">
              <label className="form-label fw-medium">Courriel</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-medium">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <div className="form-text">Minimum 12 caractères.</div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-medium">Confirme le mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Réveil du serveur, patiente...
                </>
              ) : (
                'Créer le compte'
              )}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 text-muted">
            <small>
              Déjà un compte ?{' '}
              <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#135238' }}>
                Connecte-toi
              </Link>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}