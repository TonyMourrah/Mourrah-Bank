import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: 'linear-gradient(135deg, #0a2540, #0d3a5c)' }}>
      <div className="text-center text-white px-3">
        <h1 className="display-4 fw-bold mb-3">Mourrah Bank</h1>
        <p className="lead mb-4 text-white-50">
          Une application bancaire complète — comptes, virements et historique, sécurisés de bout en bout.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
          <Link to="/login" className="btn btn-light btn-lg px-4">Se connecter</Link>
          <Link to="/register" className="btn btn-outline-light btn-lg px-4">Créer un compte</Link>
        </div>
        <Link to="/about" className="text-white-50 text-decoration-underline">
          À propos de ce projet
        </Link>
      </div>
    </div>
  );
}