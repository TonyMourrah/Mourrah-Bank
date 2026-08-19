import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions')
      .then((res) => setTransactions(res.data))
      .catch(() => setError("Impossible de charger l'historique."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-3 fade-in">
          <i className="bi bi-clock-history text-primary me-2"></i>Historique des transactions
        </h4>

        {error && (
          <div className="alert alert-danger fade-in">
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        )}

        {!loading && transactions.length === 0 && !error && (
          <div className="text-center py-5 text-muted fade-in">
            <i className="bi bi-inbox" style={{ fontSize: '2.5rem' }}></i>
            <p className="mt-2">Aucune transaction pour l'instant.</p>
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <div className="card border-0 shadow-sm card-hover fade-in overflow-hidden">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#0b3d24' }}>
                <tr>
                  <th className="text-white py-3">Date</th>
                  <th className="text-white py-3">De</th>
                  <th className="text-white py-3">Vers</th>
                  <th className="text-white py-3">Montant</th>
                  <th className="text-white py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.dateTransaction).toLocaleString('fr-CA')}</td>
                    <td>{t.compteSourceId}</td>
                    <td>{t.compteDestinationId}</td>
                    <td className="fw-bold text-primary">{t.montant.toFixed(2)} $</td>
                    <td>{t.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
