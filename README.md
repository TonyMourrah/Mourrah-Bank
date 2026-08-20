# Mourrah Envelope

Application de gestion budgétaire personnelle basée sur la méthode des enveloppes — alloue, suis et réalloue tes fonds avec des objectifs clairs.

**🔗 Démo en ligne :** [jolly-water-0a427420f.7.azurestaticapps.net](https://jolly-water-0a427420f.7.azurestaticapps.net/)

---

## À propos du projet

Mourrah Envelope applique la méthode des enveloppes budgétaires : au lieu de laisser son argent dans un seul compte, l'utilisateur le divise en enveloppes (Épicerie, Transport, Épargne, etc.), chacune avec un budget maximum ou un objectif d'épargne. Le projet couvre un cycle de développement full-stack complet : authentification sécurisée, gestion d'enveloppes, réallocation de fonds, panneau d'administration, suite de tests automatisés, et déploiement cloud entièrement automatisé sur Azure via un pipeline CI/CD.

## Fonctionnalités

- 🔐 Authentification sécurisée avec JWT et rôles utilisateur (ADMIN / CLIENT)
- 🛡️ Protection contre les attaques par force brute (limitation des tentatives de connexion, verrouillage temporaire)
- 🔒 Mots de passe hashés avec BCrypt, validation de complexité et blocage des mots de passe communs
- 📩 Champ courriel associé à chaque profil utilisateur
- 💰 Deux types d'enveloppes : **Budget de dépenses** (avec limite) et **Épargne** (avec objectif)
- 📊 Barres de progression visuelles pour chaque budget et objectif d'épargne
- 🏦 Réservoir d'argent non alloué, automatique et unique par utilisateur
- 🔁 Réallocation entre enveloppes avec confirmation avant transfert
- 🧾 Historique complet des transactions, isolé par utilisateur
- 🧑‍💼 Panneau d'administration : gestion des utilisateurs, rôles, et statistiques (comptes verrouillés, répartition Budget/Épargne, moyenne d'enveloppes par utilisateur)
- 🧪 Suite de tests automatisés (JUnit, Mockito, MockMvc) intégrée au pipeline CI/CD
- ☁️ Déploiement cloud complet sur Azure (backend, base de données, frontend)
- ⚙️ Pipeline CI/CD automatisé avec GitHub Actions, incluant un service PostgreSQL pour l'exécution des tests d'intégration

## Stack technique

**Backend**
- Java 21, Spring Boot 3
- Spring Security, JWT
- Spring Data JPA / Hibernate
- PostgreSQL (développement local via Docker) / Azure SQL Database (production)
- JUnit 5, Mockito, MockMvc

**Frontend**
- React (Vite)
- React Router
- Bootstrap 5, Bootstrap Icons
- Axios

**Infrastructure & DevOps**
- Docker (base de données locale)
- Azure App Service (backend)
- Azure Static Web Apps (frontend)
- Azure SQL Database
- GitHub Actions (CI/CD, tests automatisés bloquant le déploiement)

## Architecture

```
mourrahbank/
├── backend/          # API REST Spring Boot
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/     # Endpoints REST
│   │   ├── service/        # Logique métier
│   │   ├── repository/     # Accès aux données (Spring Data JPA)
│   │   ├── model/           # Entités JPA
│   │   ├── dto/              # Objets de transfert
│   │   ├── security/        # JWT, rate limiting, validation de mots de passe
│   │   └── config/           # Initialisation des données
│   └── src/test/java/       # Tests unitaires et d'intégration
├── frontend/          # Application React
│   └── src/
│       ├── pages/            # Pages de l'application
│       ├── components/       # Composants réutilisables (Navbar, etc.)
│       ├── context/           # Contexte d'authentification
│       └── api/                # Configuration Axios
└── .github/workflows/  # Pipelines CI/CD
```

## Sécurité

- Aucun secret (mots de passe, clés JWT) n'est stocké en dur dans le code — tout passe par des variables d'environnement, avec des valeurs par défaut sécuritaires uniquement pour le développement local
- Isolation stricte des données par utilisateur : chaque enveloppe et chaque transaction est rattachée à son propriétaire, aucun utilisateur ne peut voir ou modifier les données d'un autre
- Limitation des tentatives de connexion (5 tentatives, verrouillage de 15 minutes)
- Mots de passe hashés avec BCrypt, minimum 12 caractères, vérification contre une liste de mots de passe communs

## Lancer le projet en local

### Prérequis
- Java 21
- Node.js 18+
- Docker

### Backend

```bash
cd backend
docker compose up -d
./mvnw spring-boot:run
```

L'API démarre sur `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`.

### Lancer les tests

```bash
cd backend
./mvnw clean package
```

## Déploiement

Le projet est déployé automatiquement à chaque push sur `main` :
- Le **backend** est buildé, testé (avec un service PostgreSQL éphémère dans le pipeline), puis déployé sur **Azure App Service**
- Le **frontend** est buildé et déployé sur **Azure Static Web Apps**

Si un seul test échoue, le déploiement est automatiquement bloqué.

---

## Auteur

**Tony Mourrah** — Étudiant en génie logiciel, ÉTS

- [GitHub](https://github.com/TonyMourrah)
- [LinkedIn](https://www.linkedin.com/in/tony-mourrah-b819551b2/)
- tony.mourrah.1@ens.etsmtl.ca
