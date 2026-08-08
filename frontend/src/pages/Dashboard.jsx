import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [comptes, setComptes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newId, setNewId] = useState('');
  const [newTitulaire, setNewTitulaire] = useState('');
  const [newSolde, setNewSolde] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchComptes = () => {
    setLoading(true);
    api.get('/comptes')
      .then((res) => setComptes(res.data))
      .catch(() => setError("Impossible de charger les comptes."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComptes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setCreating(true);
    try {
      await api.post('/comptes', {
        id: newId,
        titulaire: newTitulaire,
        solde: parseFloat(newSolde),
      });
      setNewId(''); setNewTitulaire(''); setNewSolde('');
      setShowForm(false);
      fetchComptes();
    } catch (err) {
      setFormError(err.response?.data || "Erreur lors de la création du compte.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 fade-in">
          <h4 className="mb-0">Tes comptes</h4>
          <button
            className="btn btn-primary social-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-1`}></i>
            {showForm ? 'Annuler' : 'Nouveau compte'}
          </button>
        </div>

        {showForm && (
          <div className="card p-4 shadow-sm border-0 card-hover fade-in mb-4" style={{ maxWidth: '480px' }}>
            <h6 className="mb-3">Créer un nouveau compte</h6>

            {formError && (
              <div className="alert alert-danger py-2 fade-in">
                <i className="bi bi-exclamation-circle me-2"></i>{formError}
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label">ID du compte</label>
                <input
                  className="form-control"
                  placeholder="ex: C001"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Titulaire</label>
                <input
                  className="form-control"
                  placeholder="ex: Tony"
                  value={newTitulaire}
                  onChange={(e) => setNewTitulaire(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Solde initial</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="ex: 1000"
                  value={newSolde}
                  onChange={(e) => setNewSolde(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 social-btn" disabled={creating}>
                {creating ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
                ) : (
                  'Créer le compte'
                )}
              </button>
            </form>
          </div>
        )}

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
            <p className="mt-2">Aucun compte pour l'instant. Crée-en un pour commencer.</p>
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