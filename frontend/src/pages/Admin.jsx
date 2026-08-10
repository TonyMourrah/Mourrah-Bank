import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => setError("Impossible de charger les utilisateurs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    setMessage(null);
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      setMessage({ type: 'success', text: 'Rôle mis à jour.' });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data || 'Erreur.' });
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Supprimer l'utilisateur "${username}" ?`)) return;
    setMessage(null);
    try {
      await api.delete(`/admin/users/${id}`);
      setMessage({ type: 'success', text: 'Utilisateur supprimé.' });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data || 'Erreur.' });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-3 fade-in">
          <i className="bi bi-shield-lock text-primary me-2"></i>Espace administrateur
        </h4>

        {message && (
          <div className={`alert alert-${message.type} fade-in`}>
            <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
            {message.text}
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

        {!loading && (
          <div className="card shadow-sm border-0 card-hover fade-in overflow-hidden">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#0a2540' }}>
                <tr>
                  <th className="text-white py-3">ID</th>
                  <th className="text-white py-3">Nom d'utilisateur</th>
                  <th className="text-white py-3">Rôle</th>
                  <th className="text-white py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: '130px' }}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={u.username === user?.username}
                      >
                        <option value="CLIENT">CLIENT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(u.id, u.username)}
                        disabled={u.username === user?.username}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
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