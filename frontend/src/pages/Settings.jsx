import { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'danger', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès.' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      const data = err.response?.data;
      setMessage({ type: 'danger', text: typeof data === 'string' ? data : 'Erreur lors de la modification.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4" style={{ maxWidth: '520px' }}>
        <h4 className="mb-3 fade-in">
          <i className="bi bi-gear text-primary me-2"></i>Paramètres
        </h4>

        {user && (
          <div className="card shadow-sm border-0 card-hover fade-in mb-4 p-4">
            <h6 className="mb-3">Mon compte</h6>
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px', backgroundColor: '#c9a24b', fontSize: '1.2rem', fontWeight: 'bold', color: '#0b3d24' }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="fw-bold">{user.username}</div>
                {user.email && (
                  <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-envelope me-1"></i>{user.email}
                  </div>
                )}
                <span className="badge bg-secondary mt-1">{user.role}</span>
              </div>
            </div>
          </div>
        )}

        <div className="card shadow-sm border-0 card-hover fade-in fade-in-delay-1 p-4">
          <h6 className="mb-3">Changer le mot de passe</h6>

          {message && (
            <div className={`alert alert-${message.type} py-2 fade-in`}>
              <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Mot de passe actuel</label>
              <input type="password" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Nouveau mot de passe</label>
              <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <div className="form-text">Minimum 12 caractères.</div>
            </div>
            <div className="mb-3">
              <label className="form-label">Confirme le nouveau mot de passe</label>
              <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary social-btn" disabled={loading}>
              {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</>) : ('Mettre à jour le mot de passe')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}