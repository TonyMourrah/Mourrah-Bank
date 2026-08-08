import { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Virement() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [montant, setMontant] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    setMessage(null);
    setShowConfirm(true);
  };

  const handleConfirmVirement = async () => {
    setLoading(true);
    setShowConfirm(false);
    try {
      await api.put('/comptes/virement', {
        from,
        to,
        montant: parseFloat(montant),
      });
      setMessage({ type: 'success', text: 'Virement effectué avec succès.' });
      setFrom(''); setTo(''); setMontant('');
    } catch (err) {
      const text = err.response?.data || "Erreur lors du virement.";
      setMessage({ type: 'danger', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4" style={{ maxWidth: '480px' }}>
        <h4 className="mb-3 fade-in">
          <i className="bi bi-arrow-left-right text-primary me-2"></i>Faire un virement
        </h4>

        {message && (
          <div className={`alert alert-${message.type} fade-in`}>
            <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleOpenConfirm} className="card p-4 shadow-sm border-0 card-hover fade-in">
          <div className="mb-3">
            <label className="form-label">Compte source (ID)</label>
            <input className="form-control" value={from} onChange={(e) => setFrom(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Compte destination (ID)</label>
            <input className="form-control" value={to} onChange={(e) => setTo(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Montant</label>
            <input type="number" step="0.01" className="form-control" value={montant} onChange={(e) => setMontant(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary social-btn" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Envoi...</>
            ) : (
              'Envoyer'
            )}
          </button>
        </form>
      </div>

      {/* Modale de confirmation */}
      {showConfirm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fade-in"
          style={{ backgroundColor: 'rgba(10, 37, 64, 0.6)', zIndex: 1050 }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="card shadow-lg border-0 p-4 fade-in"
            style={{ width: '360px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-3">
              <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <h5 className="text-center mb-3">Confirmer le virement ?</h5>
            <p className="text-center text-muted mb-1">
              Du compte <strong>{from}</strong> vers <strong>{to}</strong>
            </p>
            <p className="text-center mb-4">
              <span className="fs-4 fw-bold text-primary">{parseFloat(montant || 0).toFixed(2)} $</span>
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => setShowConfirm(false)}
              >
                Annuler
              </button>
              <button
                className="btn btn-primary w-100 social-btn"
                onClick={handleConfirmVirement}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}