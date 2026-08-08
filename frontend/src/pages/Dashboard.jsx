import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [comptes, setComptes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/comptes')
      .then((res) => setComptes(res.data))
      .catch(() => setError("Impossible de charger les comptes."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-3 fade-in">Tes comptes</h4>

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

        {!loading && comptes.length === 0 && !error && (
          <div className="text-center py-5 text-muted fade-in">
            <i className="bi bi-wallet2" style={{ fontSize: '2.5rem' }}></i>
            <p className="mt-2">Aucun compte pour l'instant.</p>
          </div>
        )}

        <div className="row g-3">
          {comptes.map((compte, i) => (
            <div className="col-md-4" key={compte.id}>
              <div
                className="card shadow-sm border-0 card-hover fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="text-muted mb-0">{compte.titulaire}</h6>
                    <i className="bi bi-credit-card-2-back text-primary"></i>
                  </div>
                  <h3 className="text-primary fw-bold">{compte.solde.toFixed(2)} $</h3>
                  <small className="text-muted">Compte #{compte.id}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}