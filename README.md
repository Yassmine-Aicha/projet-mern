# La Gazette de l'Atelier — Projet MERN (PME)
Application d'actualités d'entreprise : MongoDB Atlas, Express, React 18 + Vite, Node.js, JWT, bcrypt.

## Lancer en local
```
cd server && cp .env.example .env   # remplir MONGO_URI et JWT_SECRET
npm install && npm run dev
cd ../client && cp .env.example .env
npm install && npm run dev
```
## Déploiement
- Base : MongoDB Atlas (M0)
- API : Render (root `server/`, build `npm install`, start `npm start`, vars MONGO_URI, JWT_SECRET)
- Front : Vercel (root `client/`, var VITE_API_URL = https://<api>.onrender.com/api)

## API
POST /api/auth/register · POST /api/auth/login · GET /api/articles · POST/DELETE /api/articles (JWT)
GET /api/articles/:id/commentaires · POST/DELETE /api/commentaires (JWT)
