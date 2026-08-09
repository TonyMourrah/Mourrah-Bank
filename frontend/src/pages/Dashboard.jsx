import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [enveloppes, setEnveloppes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newNom, setNewNom] = useState('');
  const [newMontant, setNewMontant] = useState('');
  const [newLimite, setNewLimite] = useState('');
  const [newType, setNewType] = useState('BUDGET');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const [editing, setEditing] = useState(null);
  const [editNom, setEditNom] = useState('');
  const [editMontant, setEditMontant] = useState('');
  const [editLimite, setEditLimite] = useState('');
  const [editType, setEditType] = useState('BUDGET');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

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

  const generateId = () => {
    if (window.crypto?.randomUUID) {
      return 'E-' + window.crypto.randomUUID().slice(0, 8);
    }
    return 'E-' + Date.now().toString(36);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setCreating(true);
    try {
      await api.post('/enveloppes', {
        id: generateId(),
        nom: newNom,
        montant: parseFloat(newMontant),
        limite: newLimite ? parseFloat(newLimite) : 0,
        nonAlloue: false,
        type: newType,
      });
      setNewNom(''); setNewMontant(''); setNewLimite(''); setNewType('BUDGET');
      setShowForm(false);
      fetchEnveloppes();
    } catch (err) {
      setFormError(err.response?.data || "Erreur lors de la création de l'enveloppe.");
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (enveloppe) => {
    setEditing(enveloppe);
    setEditNom(enveloppe.nom);
    setEditMontant(enveloppe.montant);
    setEditLimite(enveloppe.limite || '');
    setEditType(enveloppe.type || 'BUDGET');
    setEditError('');
  };

  const closeEdit = () => setEditing(null);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    setEditError('');
    try {
      await api.put(`/enveloppes/${editing.id}`, {
        nom: editNom,
        montant: parseFloat(editMontant),
        limite: editLimite ? parseFloat(editLimite) : 0,
        type: editType,
      });
      closeEdit();
      fetchEnveloppes();
    } catch (err) {
      setEditError(err.response?.data || "Erreur lors de la modification.");
    } finally {
      setSavingEdit(false);
    }
  };

  const nonAlloue = enveloppes.find((e) => e.nonAlloue);
  const enveloppesCategories = enveloppes.filter((e) => !e.nonAlloue);

  const totalCategories = enveloppesCategories.reduce((sum, e) => sum + e.montant, 0);
  const totalGeneral = enveloppes.reduce((sum, e) => sum + e.montant, 0);

  const renderProgress = (enveloppe) => {
    if (!enveloppe.limite || enveloppe.limite <= 0) return null;

    if (enveloppe.type === 'EPARGNE') {
      const pct = Math.min(100, (enveloppe.montant / enveloppe.limite) * 100);
      const atteint = enveloppe.montant >= enveloppe.limite;
      return (
        <div className="mt-2">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Objectif : {enveloppe.limite.toFixed(2)} $</small>
            <small className={atteint ? 'text-success fw-bold' : 'text-muted'}>{pct.toFixed(0)}%</small>
          </div>
          <div className="progress" style={{ height: '8px' }}>
            <div className={`progress-bar ${atteint ? 'bg-success' : 'bg-primary'}`} style={{ width: `${pct}%`, transition: 'width 0.4s ease' }} />
          </div>
          {atteint && <small className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Objectif atteint !</small>}
        </div>
      );
    }

    const depense = enveloppe.limite - enveloppe.montant;
    const pctDepense = Math.max(0, Math.min(100, (depense / enveloppe.limite) * 100));
    const depasse = enveloppe.montant < 0;

    let barColor = 'bg-success';
    if (pctDepense >= 100 || depasse) barColor = 'bg-danger';
    else if (pctDepense >= 80) barColor = 'bg-warning';

    return (
      <div className="mt-2">
        <div className="d-flex justify-content-between mb-1">
          <small className="text-muted">Limite : {enveloppe.limite.toFixed(2)} $</small>
          <small className={depasse || pctDepense >= 100 ? 'text-danger fw-bold' : 'text-muted'}>
            {pctDepense.toFixed(0)}% dépensé
          </small>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div className={`progress-bar ${barColor}`} style={{ width: `${pctDepense}%`, transition: 'width 0.4s ease' }} />
        </div>
        {(depasse || pctDepense >= 100) && (
          <small className="text-danger"><i className="bi bi-exclamation-triangle-fill me-1"></i>Limite atteinte ou dépassée</small>
        )}
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">

        {!loading && enveloppes.length > 0 && (
          <div className="row g-3 mb-4 fade-in">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm card-hover p-3" style={{ backgroundColor: '#0a2540' }}>
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-wallet2 text-white" style={{ fontSize: '1.8rem' }}></i>
                  <div>
                    <small className="text-white-50">Total général</small>
                    <h4 className="text-white fw-bold mb-0">{totalGeneral.toFixed(2)} $</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm card-hover p-3">
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-envelope-paper text-primary" style={{ fontSize: '1.8rem' }}></i>
                  <div>
                    <small className="text-muted">Alloué en catégories</small>
                    <h4 className="text-primary fw-bold mb-0">{totalCategories.toFixed(2)} $</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm card-hover p-3">
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-piggy-bank text-success" style={{ fontSize: '1.8rem' }}></i>
                  <div>
                    <small className="text-muted">Non alloué</small>
                    <h4 className="text-success fw-bold mb-0">{nonAlloue ? nonAlloue.montant.toFixed(2) : '0.00'} $</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3 fade-in">
          <h4 className="mb-0">Tes enveloppes</h4>
          <button className="btn btn-primary social-btn" onClick={() => setShowForm(!showForm)}>
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
                <label className="form-label">Nom de l'enveloppe</label>
                <input className="form-control" placeholder="ex: Épicerie" value={newNom} onChange={(e) => setNewNom(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Type d'enveloppe</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input type="radio" className="form-check-input" id="typeBudget" name="type" checked={newType === 'BUDGET'} onChange={() => setNewType('BUDGET')} />
                    <label className="form-check-label" htmlFor="typeBudget"><i className="bi bi-cart me-1"></i>Budget de dépenses</label>
                  </div>
                  <div className="form-check">
                    <input type="radio" className="form-check-input" id="typeEpargne" name="type" checked={newType === 'EPARGNE'} onChange={() => setNewType('EPARGNE')} />
                    <label className="form-check-label" htmlFor="typeEpargne"><i className="bi bi-piggy-bank me-1"></i>Épargne</label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  {newType === 'BUDGET' ? 'Montant disponible à dépenser' : 'Montant déjà épargné'}
                </label>
                <input type="number" step="0.01" className="form-control" placeholder="ex: 300" value={newMontant} onChange={(e) => setNewMontant(e.target.value)} required />
                {newType === 'BUDGET' && (
                  <div className="form-text">
                    Ce montant diminue à mesure que tu réalloues (dépenses) de l'argent hors de cette enveloppe.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">
                  {newType === 'BUDGET' ? 'Limite du budget' : "Objectif d'épargne"}
                  <span className="text-muted"> (optionnel)</span>
                </label>
                <input type="number" step="0.01" className="form-control" placeholder={newType === 'BUDGET' ? 'ex: 300' : 'ex: 1000'} value={newLimite} onChange={(e) => setNewLimite(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-100 social-btn" disabled={creating}>
                {creating ? (<><span className="spinner-border spinner-border-sm me-2"></span>Création...</>) : ("Créer l'enveloppe")}
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

        {nonAlloue && (
          <div className="mb-4">
            <h6 className="text-muted mb-2 fade-in"><i className="bi bi-piggy-bank me-1"></i>Réservoir non alloué</h6>
            <div className="card shadow-sm card-hover fade-in position-relative" style={{ maxWidth: '340px', border: '2px dashed #28a745' }}>
              <button
                className="btn btn-sm btn-outline-secondary position-absolute"
                style={{ top: '10px', right: '10px' }}
                onClick={() => openEdit(nonAlloue)}
              >
                <i className="bi bi-pencil"></i>
              </button>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="text-muted mb-0">{nonAlloue.nom}</h6>
                  <i className="bi bi-piggy-bank text-success"></i>
                </div>
                <h3 className="text-success fw-bold">{nonAlloue.montant.toFixed(2)} $</h3>
                <small className="text-muted">Prêt à être alloué</small>
              </div>
            </div>
          </div>
        )}

        {!loading && enveloppesCategories.length === 0 && !error && (
          <div className="text-center py-5 text-muted fade-in">
            <i className="bi bi-envelope" style={{ fontSize: '2.5rem' }}></i>
            <p className="mt-2">Aucune catégorie pour l'instant. Crée-en une pour commencer.</p>
          </div>
        )}

        {enveloppesCategories.length > 0 && (
          <h6 className="text-muted mb-2 fade-in"><i className="bi bi-tags me-1"></i>Catégories</h6>
        )}

        <div className="row g-3">
          {enveloppesCategories.map((enveloppe, i) => (
            <div className="col-md-4" key={enveloppe.id}>
              <div className="card shadow-sm border-0 card-hover fade-in position-relative" style={{ animationDelay: `${i * 0.08}s` }}>
                <button
                  className="btn btn-sm btn-outline-secondary position-absolute"
                  style={{ top: '10px', right: '10px' }}
                  onClick={() => openEdit(enveloppe)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="text-muted mb-0">{enveloppe.nom}</h6>
                    <i className={`bi ${enveloppe.type === 'EPARGNE' ? 'bi-piggy-bank' : 'bi-envelope-fill'} text-primary`}></i>
                  </div>
                  <h3 className="text-primary fw-bold">{enveloppe.montant.toFixed(2)} $</h3>
                  <small className="text-muted">Enveloppe #{enveloppe.id}</small>
                  {renderProgress(enveloppe)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fade-in"
          style={{ backgroundColor: 'rgba(10, 37, 64, 0.6)', zIndex: 1050 }}
          onClick={closeEdit}
        >
          <div
            className="card shadow-lg border-0 p-4 fade-in"
            style={{ width: '380px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-3">Modifier {editing.nom}</h5>

            {editError && (
              <div className="alert alert-danger py-2 fade-in">
                <i className="bi bi-exclamation-circle me-2"></i>{editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit}>
              <div className="mb-3">
                <label className="form-label">Nom</label>
                <input className="form-control" value={editNom} onChange={(e) => setEditNom(e.target.value)} required />
              </div>

              {!editing.nonAlloue && (
                <div className="mb-3">
                  <label className="form-label">Type d'enveloppe</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input type="radio" className="form-check-input" id="editTypeBudget" name="editType" checked={editType === 'BUDGET'} onChange={() => setEditType('BUDGET')} />
                      <label className="form-check-label" htmlFor="editTypeBudget">Budget</label>
                    </div>
                    <div className="form-check">
                      <input type="radio" className="form-check-input" id="editTypeEpargne" name="editType" checked={editType === 'EPARGNE'} onChange={() => setEditType('EPARGNE')} />
                      <label className="form-check-label" htmlFor="editTypeEpargne">Épargne</label>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">
                  {!editing.nonAlloue && editType === 'BUDGET' ? 'Montant disponible à dépenser' : 'Montant'}
                </label>
                <input type="number" step="0.01" className="form-control" value={editMontant} onChange={(e) => setEditMontant(e.target.value)} required />
              </div>

              {!editing.nonAlloue && (
                <div className="mb-3">
                  <label className="form-label">
                    {editType === 'BUDGET' ? 'Limite du budget' : "Objectif d'épargne"}
                    <span className="text-muted"> (optionnel)</span>
                  </label>
                  <input type="number" step="0.01" className="form-control" value={editLimite} onChange={(e) => setEditLimite(e.target.value)} />
                </div>
              )}

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={closeEdit}>Annuler</button>
                <button type="submit" className="btn btn-primary w-100 social-btn" disabled={savingEdit}>
                  {savingEdit ? (<span className="spinner-border spinner-border-sm"></span>) : ('Enregistrer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}