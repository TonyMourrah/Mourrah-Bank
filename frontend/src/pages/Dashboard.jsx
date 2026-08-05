import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [comptes, setComptes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/comptes')
      .then((res) => setComptes(res.data))
      .catch(() => setError("Impossible de charger les comptes."));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-3">Tes comptes</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        {comptes.length === 0 && !error && (
          <p className="text-muted">Aucun compte pour l'instant.</p>
        )}

        <div className="row g-3">
          {comptes.map((compte) => (
            <div className="col-md-4" key={compte.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted mb-1">{compte.titulaire}</h6>
                  <h4 className="text-primary">{compte.solde.toFixed(2)} $</h4>
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