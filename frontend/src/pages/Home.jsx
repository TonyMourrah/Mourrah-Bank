import { Link } from "react-router-dom";

const steps = [
  {
    num: "01",
    icon: "bi-envelope-paper-fill",
    title: "Crée tes enveloppes",
    text: "Divise ton argent en enveloppes — Épicerie, Transport, Épargne — chacune avec son propre rôle.",
  },
  {
    num: "02",
    icon: "bi-sliders",
    title: "Fixe tes limites",
    text: "Donne un budget maximum ou un objectif d'épargne à chaque enveloppe, suivi visuellement.",
  },
  {
    num: "03",
    icon: "bi-arrow-left-right",
    title: "Réalloue au besoin",
    text: "Dépassé ton budget épicerie ? Transfère des fonds d'une autre enveloppe en quelques clics.",
  },
];

const features = [
  {
    icon: "bi-shield-lock",
    text: "Ton compte est protégé — connexion sécurisée et blocage automatique en cas de tentatives suspectes",
  },
  {
    icon: "bi-bar-chart-line",
    text: "Visualise en un coup d'œil où tu en es dans chaque budget et chaque objectif d'épargne",
  },
  {
    icon: "bi-clock-history",
    text: "Retrouve facilement tous tes mouvements passés, à toi et à toi seul",
  },
  {
    icon: "bi-lock",
    text: "Tes informations personnelles restent privées et bien protégées",
  },
];

export default function Home() {
  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#f7f8fa" }}
    >
      <nav
        className="navbar navbar-dark px-4 py-3"
        style={{ backgroundColor: "#1c1f1e" }}
      >
        <div className="container-fluid px-0 d-flex justify-content-between align-items-center">
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2 mb-0"
          >
            <i className="bi bi-envelope-fill text-accent"></i>
            Mourrah Envelope
          </Link>
          <div className="d-flex gap-2">
            <Link
              to="/about"
              className="btn btn-outline-light btn-sm social-btn"
            >
              <i className="bi bi-info-circle me-1"></i>Tutoriel
            </Link>
            <Link
              to="/portfolio"
              className="btn btn-outline-light btn-sm social-btn"
            >
              <i className="bi bi-info-circle me-1"></i>Portfolio
            </Link>

            <Link
              to="/login"
              className="btn btn-outline-light btn-sm social-btn"
            >
              <i className="bi bi-box-arrow-in-right me-1"></i>Connexion
            </Link>
            <Link to="/register" className="btn btn-light btn-sm social-btn">
              <i className="bi bi-person-plus me-1"></i>Créer un compte
            </Link>
          </div>
        </div>
      </nav>

      <div
        style={{
          background: "linear-gradient(135deg, #0a3a2a 0%, #135238 100%)",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center g-5 py-4">
            <div className="col-lg-6 text-white fade-in">
              <span
                className="badge rounded-pill px-3 py-2 mb-3 d-inline-block"
                style={{
                  backgroundColor: "rgba(201,162,75,0.15)",
                  color: "#c9a24b",
                }}
              >
                Gestion budgétaire personnelle
              </span>
              <h1 className="display-5 fw-bold mb-3">
                Chaque dollar,{" "}
                <span className="text-accent">une destination</span>
              </h1>
              <p className="lead text-white-50 mb-4">
                Mourrah Envelope applique la méthode des enveloppes budgétaires
                : alloue, suis et réalloue tes fonds avec des objectifs clairs,
                pas des devinettes.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link
                  to="/register"
                  className="btn btn-light btn-lg px-4 social-btn"
                >
                  <i className="bi bi-rocket-takeoff me-2"></i>Commencer
                  maintenant
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-lg px-4 social-btn"
                >
                  Se connecter
                </Link>
              </div>
            </div>

            <div className="col-lg-6 fade-in fade-in-delay-1">
              <div
                className="card border-0 shadow-lg p-4"
                style={{ borderRadius: "16px" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-muted mb-0">Aperçu de tes enveloppes</h6>
                  <i className="bi bi-three-dots text-muted"></i>
                </div>

                <div
                  className="mb-3 p-3 rounded-3"
                  style={{ backgroundColor: "#f7f8fa" }}
                >
                  <div className="d-flex justify-content-between mb-1">
                    <small className="fw-bold">Épicerie</small>
                    <small className="text-muted">210$ / 300$</small>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-warning"
                      style={{ width: "70%" }}
                    />
                  </div>
                </div>

                <div
                  className="mb-3 p-3 rounded-3"
                  style={{ backgroundColor: "#f7f8fa" }}
                >
                  <div className="d-flex justify-content-between mb-1">
                    <small className="fw-bold">Épargne vacances</small>
                    <small className="text-muted">650$ / 1000$</small>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>

                <div
                  className="p-3 rounded-3"
                  style={{ backgroundColor: "#f7f8fa" }}
                >
                  <div className="d-flex justify-content-between mb-1">
                    <small className="fw-bold">Transport</small>
                    <small className="text-muted">40$ / 150$</small>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-info"
                      style={{ width: "27%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5 flex-grow-1">
        <div className="text-center mb-5 fade-in">
          <h2 className="fw-bold">Comment ça fonctionne</h2>
          <p className="text-muted">
            Trois étapes simples pour reprendre le contrôle
          </p>
        </div>

        <div className="row g-4 mb-5">
          {steps.map((s, i) => (
            <div className="col-md-4" key={s.num}>
              <div
                className="text-center fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#0a3a2a",
                  }}
                >
                  <i
                    className={`bi ${s.icon} text-white`}
                    style={{ fontSize: "1.6rem" }}
                  ></i>
                </div>
                <span
                  className="text-accent fw-bold"
                  style={{ fontSize: "0.85rem" }}
                >
                  {s.num}
                </span>
                <h6 className="fw-bold mt-1">{s.title}</h6>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  {s.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 shadow-sm p-4 p-md-5 fade-in">
          <div className="row g-4">
            {features.map((f) => (
              <div
                className="col-md-6 d-flex align-items-start gap-3"
                key={f.text}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#f7f8fa",
                  }}
                >
                  <i className={`bi ${f.icon} text-success`}></i>
                </div>
                <p className="mb-0" style={{ fontSize: "0.95rem" }}>
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-4"
        style={{ backgroundColor: "#1c1f1e" }}
      >
        <p className="text-white-50 mb-0" style={{ fontSize: "0.9rem" }}>
          Mourrah Envelope — Projet développé par{" "}
          <Link
            to="/portfolio"
            className="text-accent text-decoration-none fw-bold"
          >
            Tony Mourrah
          </Link>
        </p>
      </footer>
    </div>
  );
}
