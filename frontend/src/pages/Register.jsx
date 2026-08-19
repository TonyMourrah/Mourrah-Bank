import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { username, email, password });
      navigate('/login');
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
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: 'linear-gradient(135deg, #0b3d24 0%, #145c38 100%)' }}
    >
      <div className="card shadow-lg p-4 border-0 card-hover fade-in" style={{ width: '400px' }}>
        <h3 className="mb-1 text-primary fw-bold">Mourrah Envelope</h3>
        <p className="text-muted mb-4">Crée ton compte</p>

        {error && (
          <div className="alert alert-danger py-2 fade-in">
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom d'utilisateur</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Courriel</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
            <div className="form-text">Minimum 12 caractères.</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Confirme le mot de passe</label>
            <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 social-btn" disabled={loading}>
            {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Création...</>) : ("Créer le compte")}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          <small>Déjà un compte ? <Link to="/login">Connecte-toi</Link></small>
        </p>
      </div>
    </div>
  );
}