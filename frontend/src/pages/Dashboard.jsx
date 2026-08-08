import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [enveloppes, setEnveloppes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newId, setNewId] = useState('');
  const [newNom, setNewNom] = useState('');
  const [newMontant, setNewMontant] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchEnveloppes = () => {
    setLoading(true);
    api.get('/enveloppes')
      .then((res) => setEnveloppes(res.data))
      .catch(() => setError("Impossible de charger les enveloppes."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnveloppes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setCreating(true);
    try {
      await api.post('/enveloppes', {
        id: newId,
        nom: newNom,
        montant: parseFloat(newMontant),
      });
      setNewId(''); setNewNom(''); setNewMontant('');
      setShowForm(false);
      fetchEnveloppes();
    } catch (err) {
      setFormError(err.response?.data || "Erreur lors de la création de l'enveloppe.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 fade-in">
          <h4 className="mb-0">Tes enveloppes</h4>
          <button
            className="btn btn-primary social-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-1`}></i>
            {showForm ? 'Annuler' : 'Nouvelle enveloppe'}
          </button>
        </div>

        {showForm && (
          <div className="card p-4 shadow-sm border-0 card-hover fade-in mb-4" style={{ maxWidth: '480px' }}>
            <h6 className="mb-3">Créer une nouvelle enveloppe</h6>

            {formError && (
              <div className="alert alert-danger py-2 fade-in">
                <i className="bi bi-exclamation-circle me-2"></i>{formError}
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label">ID de l'enveloppe</label>
                <input
                  className="form-control"
                  placeholder="ex: E001"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nom de l'enveloppe</label>
                <input
                  className="form-control"
                  placeholder="ex: Épicerie"
                  value={newNom}
                  onChange={(e) => setNewNom(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Montant initial</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="ex: 300"
                  value={newMontant}
                  onChange={(e) => setNewMontant(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 social-btn" disabled={creating}>
                {creating ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
                ) : (
                  "Créer l'enveloppe"
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

        {!loading && enveloppes.length === 0 && !error && (
          <div className="text-center py-5 text-muted fade-in">
            <i className="bi bi-envelope" style={{ fontSize: '2.5rem' }}></i>
            <p className="mt-2">Aucune enveloppe pour l'instant. Crée-en une pour commencer.</p>
          </div>
        )}

        <div className="row g-3">
          {enveloppes.map((enveloppe, i) => (
            <div className="col-md-4" key={enveloppe.id}>
              <div
                className="card shadow-sm border-0 card-hover fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="text-muted mb-0">{enveloppe.nom}</h6>
                    <i className="bi bi-envelope-fill text-primary"></i>
                  </div>
                  <h3 className="text-primary fw-bold">{enveloppe.montant.toFixed(2)} $</h3>
                  <small className="text-muted">Enveloppe #{enveloppe.id}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}