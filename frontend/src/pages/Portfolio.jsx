import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  "Méthode des enveloppes budgétaires avec allocation, suivi et réallocation de fonds",
  "Deux types d'enveloppes : Budget de dépenses (avec limite) et Épargne (avec objectif)",
  "Réservoir d'argent non alloué automatique, unique par utilisateur",
  "Réallocation entre enveloppes avec confirmation avant transfert",
  "Historique complet des transactions, isolé par utilisateur",
  "Authentification sécurisée avec JWT et rôles utilisateur (ADMIN/CLIENT)",
  "Protection contre les attaques par force brute (limitation des tentatives de connexion)",
  "Mots de passe hashés avec BCrypt et validation de complexité",
  "Panneau d'administration avec gestion des utilisateurs et statistiques",
  "Suite de tests automatisés (JUnit, Mockito, MockMvc) intégrée au pipeline CI/CD",
  "Déploiement cloud complet sur Azure (backend, base de données, frontend)",
  "Pipeline CI/CD automatisé avec GitHub Actions",
];

const stack = [
  { name: "React", icon: "bi-filetype-jsx" },
  { name: "Spring Boot 3", icon: "bi-leaf" },
  { name: "Spring Security", icon: "bi-shield-lock" },
  { name: "JWT", icon: "bi-key" },
  { name: "PostgreSQL (local)", icon: "bi-database" },
  { name: "Azure SQL Database", icon: "bi-cloud-fill" },
  { name: "Azure App Service", icon: "bi-hdd-network" },
  { name: "Azure Static Web Apps", icon: "bi-window" },
  { name: "GitHub Actions (CI/CD)", icon: "bi-gear-fill" },
  { name: "JUnit & Mockito", icon: "bi-check2-square" },
  { name: "Docker", icon: "bi-box-seam" },
  { name: "Bootstrap 5", icon: "bi-bootstrap-fill" },
];

export default function Portfolio() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">

        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="btn btn-outline-secondary btn-sm mb-4"
        >
          <i className="bi bi-arrow-left me-1"></i>
          {isAuthenticated ? 'Retour au dashboard' : "Retour à l'accueil"}
        </Link>

        {/* Carte de Profil */}
        <div className="card shadow-sm p-4 mb-4 border-0 card-hover fade-in">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 avatar-glow"
              style={{
                width: '110px',
                height: '110px',
                background: 'linear-gradient(135deg, #0b3d24, #3fa66b)',
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
                  className="btn btn-dark btn-sm social-btn"
                >
                  <i className="bi bi-github me-1"></i>GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/tony-mourrah-b819551b2/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn text-white btn-sm social-btn border-0"
                  style={{
                    background: 'linear-gradient(135deg, #004182, #0a66c2)',
                  }}
                >
                  <i className="bi bi-linkedin me-1"></i>LinkedIn
                </a>
                <a
                  href="mailto:tony.mourrah.1@ens.etsmtl.ca"
                  className="btn btn-outline-secondary btn-sm social-btn"
                >
                  <i className="bi bi-envelope me-1"></i>tony.mourrah.1@ens.etsmtl.ca
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section Pourquoi ce projet */}
        <div className="card border-0 shadow-sm p-4 p-md-5 mb-4 fade-in fade-in-delay-1">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-chat-quote text-primary me-2"></i>Pourquoi ce projet
          </h5>
          <p className="mb-3">
            Je suis étudiant en génie logiciel à l'ÉTS, et j'ai un vrai intérêt pour tout ce qui touche
            au développement full-stack — de la conception d'une base de données jusqu'au déploiement
            en production. J'aime particulièrement comprendre comment toutes les pièces s'assemblent :
            la sécurité, l'architecture cloud, et l'expérience utilisateur.
          </p>
          <p className="mb-3">
            L'idée de Mourrah Envelope est née d'un vrai besoin personnel. Comme beaucoup d'étudiants,
            je cherchais une façon simple de suivre mon budget sans me casser la tête avec des tableurs
            compliqués ou des applications trop chargées. La méthode des enveloppes m'a toujours semblé
            la plus intuitive — visualiser concrètement où va chaque dollar, plutôt que de regarder un
            seul chiffre global qui ne raconte pas vraiment l'histoire complète de mes finances.
          </p>
          <p className="mb-0">
            Ce projet m'a aussi permis de mettre en pratique des concepts que je voulais maîtriser
            en profondeur : l'authentification sécurisée, l'isolation des données par utilisateur,
            les tests automatisés, et un vrai pipeline CI/CD de bout en bout. C'est autant un outil
            que j'utilise moi-même qu'une démonstration de ce que je suis capable de construire.
          </p>
        </div>

        {/* À propos du projet & Stack technique */}
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card shadow-sm p-4 h-100 border-0 card-hover fade-in fade-in-delay-2">
              <h5 className="mb-3">
                <i className="bi bi-info-circle me-2 text-primary"></i>À propos du projet
              </h5>
              <p>
                <strong>Mourrah Envelope</strong> est une application de gestion budgétaire
                personnelle basée sur la méthode des enveloppes. Le projet couvre un cycle
                de développement full-stack complet : authentification sécurisée, gestion
                d'enveloppes avec objectifs et limites, réallocation de fonds, panneau
                d'administration, suite de tests automatisés, et déploiement cloud
                entièrement automatisé sur Azure via un pipeline CI/CD.
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

          <div className="col-lg-5">
            <div className="card shadow-sm p-4 border-0 card-hover fade-in fade-in-delay-2">
              <h5 className="mb-3">
                <i className="bi bi-stack me-2 text-primary"></i>Stack technique
              </h5>
              <div className="row g-2">
                {stack.map((s) => (
                  <div className="col-6" key={s.name}>
                    <div className="tech-badge">
                      <i className={`bi ${s.icon}`}></i>
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