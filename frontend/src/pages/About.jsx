import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    icon: 'bi-envelope-plus',
    title: '1. Crée tes enveloppes',
    text: "Va dans « Enveloppes » et clique sur « Nouvelle enveloppe ». Donne-lui un nom (ex: Épicerie, Loisirs) et choisis un type : Budget de dépenses ou Épargne.",
  },
  {
    icon: 'bi-sliders',
    title: '2. Choisis Budget ou Épargne',
    text: "Une enveloppe Budget suit combien tu as dépensé par rapport à une limite (ex: 210$ / 300$ d'épicerie). Une enveloppe Épargne suit ta progression vers un objectif (ex: 650$ / 1000$ pour des vacances).",
  },
  {
    icon: 'bi-piggy-bank',
    title: '3. Utilise ton réservoir non alloué',
    text: "Chaque compte a un réservoir « Non alloué » créé automatiquement — c'est ton argent qui n'a pas encore de destination précise. Ajuste son montant depuis le bouton crayon sur sa carte.",
  },
  {
    icon: 'bi-arrow-left-right',
    title: '4. Réalloue entre tes enveloppes',
    text: "Va dans « Réallocation », choisis une enveloppe source et une destination, entre un montant, et confirme. Utile pour équilibrer ton budget en cours de mois.",
  },
  {
    icon: 'bi-pencil-square',
    title: '5. Modifie une enveloppe existante',
    text: "Clique sur l'icône crayon dans le coin d'une carte pour ajuster son nom, son montant, sa limite ou son objectif à tout moment.",
  },
  {
    icon: 'bi-clock-history',
    title: '6. Consulte ton historique',
    text: "La page « Historique » liste toutes tes réallocations passées, avec la date, les enveloppes concernées et le montant — visible uniquement par toi.",
  },
];

const faq = [
  {
    q: "Pourquoi ma barre de progression est-elle rouge ?",
    a: "Pour une enveloppe Budget, le rouge signifie que tu as atteint ou dépassé ta limite. Pour une enveloppe Épargne, ça n'arrive jamais — le vert indique plutôt que ton objectif est atteint.",
  },
  {
    q: "Puis-je avoir plusieurs enveloppes du même type ?",
    a: "Oui, autant que tu veux. Le seul réservoir unique est celui « Non alloué », créé automatiquement une seule fois par compte.",
  },
  {
    q: "Mes données sont-elles visibles par d'autres utilisateurs ?",
    a: "Non. Tes enveloppes, réallocations et historique sont strictement privés à ton compte.",
  },
];

export default function About() {
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

        <div className="text-center mb-5 fade-in">
          <h2 className="fw-bold">Comment utiliser Mourrah Envelope</h2>
          <p className="text-muted">Un petit guide pour bien démarrer avec la méthode des enveloppes</p>
        </div>

        <div className="row g-4 mb-5">
          {steps.map((s, i) => (
            <div className="col-md-6" key={s.title}>
              <div
                className="card h-100 border-0 shadow-sm card-hover p-4 fade-in"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="d-flex gap-3 align-items-start">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{ width: '44px', height: '44px', backgroundColor: '#0b3d24' }}
                  >
                    <i className={`bi ${s.icon} text-white`}></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">{s.title}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.92rem' }}>{s.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 shadow-sm p-4 p-md-5 fade-in">
          <h5 className="fw-bold mb-4">
            <i className="bi bi-question-circle text-primary me-2"></i>Questions fréquentes
          </h5>
          {faq.map((f, i) => (
            <div key={f.q} className={i < faq.length - 1 ? 'mb-4 pb-4 border-bottom' : ''}>
              <h6 className="fw-bold">{f.q}</h6>
              <p className="text-muted mb-0" style={{ fontSize: '0.92rem' }}>{f.a}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-muted mt-4" style={{ fontSize: '0.85rem' }}>
          Envie d'en savoir plus sur le projet ?{' '}
          <Link to="/portfolio" className="fw-bold" style={{ color: '#0b3d24' }}>
            Découvre l'histoire derrière Mourrah Envelope
          </Link>
        </p>
      </div>
    </div>
  );
}