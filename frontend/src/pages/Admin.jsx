import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([api.get("/admin/users"), api.get("/admin/stats")])
      .then(([usersRes, statsRes]) => {
        setUsers(usersRes.data);
        setStats(statsRes.data);
      })
      .catch(() => setError("Impossible de charger les données admin."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    setMessage(null);
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      setMessage({ type: "success", text: "Rôle mis à jour." });
      fetchAll();
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data || "Erreur." });
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Supprimer l'utilisateur "${username}" ?`)) return;
    setMessage(null);
    try {
      await api.delete(`/admin/users/${id}`);
      setMessage({ type: "success", text: "Utilisateur supprimé." });
      fetchAll();
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data || "Erreur." });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-3 fade-in">
          <i className="bi bi-shield-lock text-primary me-2"></i>Espace
          administrateur
        </h4>

        {message && (
          <div className={`alert alert-${message.type} fade-in`}>
            <i
              className={`bi ${message.type === "success" ? "bi-check-circle" : "bi-exclamation-circle"} me-2`}
            ></i>
            {message.text}
          </div>
        )}

        {error && (
          <div className="alert alert-danger fade-in">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        )}

        {!loading && stats && (
          <div className="row g-3 mb-4 fade-in">
            <div className="col-md-3 col-6">
              <div
                className="card border-0 shadow-sm card-hover p-3"
                style={{ backgroundColor: "#0b3d24" }}
              >
                <small className="text-white-50">Utilisateurs</small>
                <h4 className="text-white fw-bold mb-0">{stats.totalUsers}</h4>
                <small className="text-white-50">
                  {stats.totalAdmins} admin(s), {stats.totalClients} client(s)
                </small>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm card-hover p-3">
                <small className="text-muted">
                  Moy. enveloppes / utilisateur
                </small>
                <h4 className="text-primary fw-bold mb-0">
                  {stats.moyenneEnveloppesParUser}
                </h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm card-hover p-3">
                <small className="text-muted">Budget vs Épargne</small>
                <h4 className="text-primary fw-bold mb-0">
                  {stats.budgetCount} / {stats.epargneCount}
                </h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm card-hover p-3">
                <small className="text-muted">Comptes verrouillés</small>
                <h4
                  className={
                    stats.comptesVerrouilles > 0
                      ? "text-danger fw-bold mb-0"
                      : "text-success fw-bold mb-0"
                  }
                >
                  {stats.comptesVerrouilles}
                </h4>
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <h6 className="text-muted mb-2 fade-in">
              <i className="bi bi-people me-1"></i>Gestion des utilisateurs
            </h6>
            <div className="card shadow-sm border-0 card-hover fade-in overflow-hidden">
              <table className="table table-hover mb-0">
                <thead style={{ backgroundColor: "#0b3d24" }}>
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
                          style={{ width: "130px" }}
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u.id, e.target.value)
                          }
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
          </>
        )}
      </div>
    </div>
  );
}

