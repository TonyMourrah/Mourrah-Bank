import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      await api.post('/auth/register', { username, password });
      setSuccess('Compte créé avec succès ! Redirection vers la connexion...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object' && data !== null) {
        setError(Object.values(data).join(' '));
      } else {
        setError(data || "Erreur lors de la création du compte.");
      }
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: 'linear-gradient(135deg, #0a2540 0%, #0d3a5c 100%)' }}
    >
      <div className="card shadow-lg p-4 border-0 card-hover fade-in" style={{ width: '400px' }}>
        <h3 className="mb-1 text-primary fw-bold">Mourrah Bank</h3>
        <p className="text-muted mb-4">Crée ton compte</p>

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
            <div className="form-text">Minimum 12 caractères.</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Confirme le mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 social-btn">
            Créer le compte
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          <small>Déjà un compte ? <Link to="/login">Connecte-toi</Link></small>
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