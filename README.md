# ✈️ FlightPulse AI

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js&style=flat-square" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&style=flat-square" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&style=flat-square" />
  <img src="https://img.shields.io/badge/Express-4-404d59?logo=express&style=flat-square" />
  <img src="https://img.shields.io/badge/Prisma-5-2d3748?logo=prisma&style=flat-square" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&style=flat-square" />
</p>

<p align="center">
  <strong>L'IA qui prédit les prix des billets d'avion et vous dit exactement quand acheter pour économiser jusqu'à 40%.</strong>
</p>

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🔍 **Recherche de vols** | Comparez des centaines de vols en temps réel |
| 📈 **Prédiction IA des prix** | Anticipez les baisses de prix avec notre algorithme |
| 🔔 **Alertes de prix** | Recevez une notification dès qu'un prix baisse |
| ⭐ **Favoris** | Sauvegardez vos trajets préférés |
| 🕐 **Historique** | Retrouvez toutes vos recherches passées |
| 👤 **Profil utilisateur** | Gérez vos informations personnelles |
| 🎨 **Interface moderne** | Design glassmorphism avec animations fluides |
| 📱 **Responsive** | Optimisé mobile, tablette et desktop |

---

## 🛠️ Stack Technique

<table>
  <tr>
    <td valign="top" width="50%">

**Frontend**
- [Next.js 15](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Recharts](https://recharts.org/)

  </td>
  <td valign="top" width="50%">

**Backend**
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- JWT Authentication

  </td>
  </tr>
</table>

---

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) >= 18
- [Docker](https://www.docker.com/)
- npm

### 1. Cloner le projet

```bash
git clone https://github.com/P-Atin/flightPulse-AI.git
cd flightpulse-ai
```

### 2. Lancer PostgreSQL et Redis

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Configurer et lancer le Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 4. Configurer et lancer le Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Accéder à l'application

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Health check | http://localhost:3001/api/health |

---

## 🔑 Variables d'Environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
PORT=3001
FRONTEND_URL=http://localhost:3000

DATABASE_URL="postgresql://flightpulse:flightpulse123@localhost:5432/flightpulse"
REDIS_URL=redis://localhost:6379

JWT_SECRET=votre-secret-jwt

AVIATIONSTACK_API_KEY=votre-cle-api
```

---

## 📁 Structure du Projet

```
flightpulse-ai/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── login/
│       │   ├── register/
│       │   ├── dashboard/
│       │   ├── profile/
│       │   └── flight/
│       ├── components/
│       ├── lib/
│       └── stores/
├── backend/
│   └── src/
│       ├── routes/
│       └── server.ts
└── docker-compose.dev.yml
```

---

## 📡 API Routes

### Authentification

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/login` | Connexion |

### Vols & Prédictions

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/flights/search` | Recherche de vols |
| `POST` | `/api/predictions/predict` | Prédiction de prix |

### Alertes

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/alerts` | Liste des alertes |
| `POST` | `/api/alerts` | Créer une alerte |
| `DELETE` | `/api/alerts/:id` | Supprimer une alerte |

### Favoris

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/favorites` | Liste des favoris |
| `POST` | `/api/favorites` | Ajouter un favori |
| `DELETE` | `/api/favorites/:id` | Supprimer un favori |

---

## 📝 Licence

Distribué sous licence [MIT](LICENSE).
