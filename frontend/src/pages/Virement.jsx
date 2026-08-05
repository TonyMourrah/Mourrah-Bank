import { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Virement() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [montant, setMontant] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
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
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4" style={{ maxWidth: '480px' }}>
        <h4 className="mb-3">Faire un virement</h4>

        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
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
          <button type="submit" className="btn btn-primary">Envoyer</button>
        </form>
      </div>
    </div>
  );
}