# ✈️ FlightPulse AI

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Express](https://img.shields.io/badge/Express-4-green?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)

**L'IA qui prédit les prix des billets d'avion et vous dit exactement quand acheter pour économiser jusqu'à 40%.**

---

## ✨ Fonctionnalités

- 🔍 **Recherche de vols** - Comparez des centaines de vols en temps réel
- 📈 **Prédiction IA des prix** - Anticipez les baisses avec notre algorithme
- 🔔 **Alertes de prix** - Recevez une notification quand le prix baisse
- ⭐ **Favoris** - Sauvegardez vos trajets préférés
- 🕐 **Historique** - Retrouvez toutes vos recherches
- 👤 **Profil utilisateur** - Gérez vos informations personnelles
- 🎨 **Interface moderne** - Design glassmorphism avec animations fluides
- 📱 **Responsive** - Fonctionne sur mobile, tablette et desktop

---

## 🛠️ Stack Technique

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Recharts

**Backend**
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT Auth

---

## 🚀 Installation

### Prérequis

- Node.js >= 18
- Docker
- npm

### 1. Cloner le projet

```bash
git clone https://github.com/P-Atin/flightPulse-AI.git
cd flightpulse-ai

### 2. Lancer PostgreSQL et Redis

docker-compose -f docker-compose.dev.yml up -d

### 3. Backend

cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

### 4. Frontend

cd frontend
npm install
npm run dev

### 5. Accéder au site

Frontend : http://localhost:3000

Backend API : http://localhost:3001

Health check : http://localhost:3001/api/health


🔑 Variables d'Environnement

Créer un fichier .env dans le dossier backend :
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://flightpulse:flightpulse123@localhost:5432/flightpulse"
REDIS_URL=redis://localhost:6379
JWT_SECRET=votre-secret-jwt
AVIATIONSTACK_API_KEY=votre-cle-api

📁 Structure du Projet

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

📡 API Routes

Méthode	Route	Description
POST	/api/auth/register	Inscription
POST	/api/auth/login	Connexion
POST	/api/flights/search	Recherche de vols
POST	/api/predictions/predict	Prédiction de prix
GET	/api/alerts	Liste des alertes
POST	/api/alerts	Créer une alerte
DELETE	/api/alerts/:id	Supprimer une alerte
GET	/api/favorites	Liste des favoris
POST	/api/favorites	Ajouter un favori
DELETE	/api/favorites/:id	Supprimer un favori

📝 License
MIT
