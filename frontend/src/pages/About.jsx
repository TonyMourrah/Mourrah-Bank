import { Link } from 'react-router-dom';

const features = [
  "Authentification sécurisée avec JWT et rôles utilisateur",
  "Gestion de comptes bancaires multiples",
  "Virements entre comptes avec validation de solde",
  "Historique complet des transactions",
  "Inscription avec validation de mot de passe (12+ caractères, blocage des mots de passe communs)",
  "Mots de passe hashés avec BCrypt",
  "Déploiement cloud complet sur Azure (backend + base de données + frontend)",
  "Pipeline CI/CD automatisé avec GitHub Actions",
];

const stack = [
  { name: "React", icon: "bi-filetype-jsx" },
  { name: "Spring Boot", icon: "bi-leaf" },
  { name: "Spring Security", icon: "bi-shield-lock" },
  { name: "JWT", icon: "bi-key" },
  { name: "PostgreSQL (local)", icon: "bi-database" },
  { name: "Azure SQL Database", icon: "bi-cloud-fill" },
  { name: "Azure App Service", icon: "bi-hdd-network" },
  { name: "Azure Static Web Apps", icon: "bi-window" },
  { name: "GitHub Actions (CI/CD)", icon: "bi-gear-fill" },
  { name: "Docker", icon: "bi-box-seam" },
  { name: "Bootstrap 5", icon: "bi-bootstrap-fill" },
];

export default function About() {
  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">

        <Link to="/" className="btn btn-outline-secondary btn-sm mb-4">
          <i className="bi bi-arrow-left me-1"></i> Retour à l'accueil
        </Link>

        {/* En-tête profil */}
        <div className="card shadow-sm p-4 mb-4 border-0">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: '110px',
                height: '110px',
                background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
              }}
            >
              <i className="bi bi-person-fill text-white" style={{ fontSize: '3.2rem' }}></i>
            </div>
            <div>
              <h2 className="mb-0 fw-bold">Tony Mourrah</h2>
              <p className="text-muted mb-2">Étudiant en génie logiciel — ÉTS</p>
              <div className="d-flex gap-2 flex-wrap">
                <a
                  href="https://github.com/TonyMourrah"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark btn-sm"
                >
                  <i className="bi bi-github me-1"></i>GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/tony-mourrah-b819551b2/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  <i className="bi bi-linkedin me-1"></i>LinkedIn
                </a>
                <a
                  href="mailto:tony.mourrah.1@ens.etsmtl.ca"
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="bi bi-envelope me-1"></i>tony.mourrah.1@ens.etsmtl.ca
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* À propos du projet */}
          <div className="col-lg-7">
            <div className="card shadow-sm p-4 h-100 border-0">
              <h5 className="mb-3">
                <i className="bi bi-info-circle me-2 text-primary"></i>À propos du projet
              </h5>
              <p>
                <strong>Mourrah Bank</strong> est une application bancaire complète développée
                pour démontrer un cycle de développement full-stack réel : authentification
                sécurisée, gestion de comptes, virements entre comptes, historique de
                transactions, API REST sécurisée en Spring Boot, interface React réactive,
                et déploiement cloud automatisé sur Azure via un pipeline CI/CD.
              </p>
              <h6 className="mt-3 mb-2 fw-bold">Fonctionnalités</h6>
              <ul className="list-unstyled mb-0">
                {features.map((f) => (
                  <li key={f} className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stack technique */}
          <div className="col-lg-5">
            <div className="card shadow-sm p-4 border-0">
              <h5 className="mb-3">
                <i className="bi bi-stack me-2 text-primary"></i>Stack technique
              </h5>
              <div className="row g-2">
                {stack.map((s) => (
                  <div className="col-6" key={s.name}>
                    <div
                      className="d-flex align-items-center gap-2 h-100 px-3 py-2"
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        color: '#495057',
                      }}
                    >
                      <i className={`bi ${s.icon} text-primary`}></i>
                      {s.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}