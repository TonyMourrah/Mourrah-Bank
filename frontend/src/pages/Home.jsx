import { Link } from 'react-router-dom';

const highlights = [
  { icon: 'bi-shield-lock', text: 'Authentification sécurisée' },
  { icon: 'bi-arrow-left-right', text: 'Virements instantanés' },
  { icon: 'bi-clock-history', text: 'Historique complet' },
];

export default function Home() {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 position-relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a2540 0%, #0d3a5c 60%, #0a2540 100%)' }}
    >

      <div
        className="position-absolute rounded-circle"
        style={{
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(201,162,75,0.15) 0%, transparent 70%)',
          top: '-150px', right: '-150px',
        }}
      />
      <div
        className="position-absolute rounded-circle"
        style={{
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(13,110,253,0.15) 0%, transparent 70%)',
          bottom: '-120px', left: '-120px',
        }}
      />

      <div className="text-center text-white px-3 position-relative fade-in" style={{ maxWidth: '640px' }}>
        <div className="mb-3">
          <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'rgba(201,162,75,0.15)', color: '#c9a24b' }}>
            Projet portfolio — Système bancaire
          </span>
        </div>

        <h1 className="display-4 fw-bold mb-3">Mourrah Envelope</h1>
        <p className="lead mb-4 text-white-50">
          Une application bancaire complète — comptes, virements et historique,
          sécurisés de bout en bout et déployés sur Azure.
        </p>

        <div className="d-flex justify-content-center gap-4 mb-5 flex-wrap fade-in fade-in-delay-1">
          {highlights.map((h) => (
            <div key={h.text} className="d-flex align-items-center gap-2 text-white-50">
              <i className={`bi ${h.icon} text-accent`}></i>
              <small>{h.text}</small>
            </div>
          ))}
        </div>

        <div className="d-flex gap-3 justify-content-center flex-wrap mb-4 fade-in fade-in-delay-2">
          <Link to="/login" className="btn btn-light btn-lg px-4 social-btn">
            Se connecter
          </Link>
          <Link to="/register" className="btn btn-outline-light btn-lg px-4 social-btn">
            Créer un compte
          </Link>
        </div>

        <Link to="/about" className="text-white-50 text-decoration-none">
          <i className="bi bi-arrow-right-short"></i> À propos de ce projet
        </Link>
      </div>
    </div>
  );
}