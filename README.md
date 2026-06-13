# WOD Manager

Plataforma full-stack (MERN + TypeScript) para gestión de rendimiento y competencias de CrossFit.

## Enlaces del proyecto

- 🎨 **Figma**: https://www.figma.com/design/fekYsBPlcoqFnHoWcgcD1K/WOD-Manager?node-id=1-2&t=U3YUP0vOPkg7gcgT-1
- 📁 **Drive (documentación)**: https://docs.google.com/document/d/177Qwe-kwPq2hX3xQ_58E0TKMYjpcSY7M2CXEO4jfRsI/edit

## Stack

- **Frontend**: React 19 + Vite + TypeScript, React Router, Redux Toolkit, TanStack Query, Tailwind CSS, react-hook-form + Zod.
- **Backend**: Node.js + Express 5 + TypeScript, Mongoose, JWT, bcryptjs, Zod, helmet, cors, express-rate-limit.
- **Base de datos**: MongoDB Atlas.

## Estructura

```
wod-manager/
├── client/      # SPA React + TypeScript
├── server/      # API REST Express + TypeScript (modular: modules/<dominio> + models centrales)
└── docs/        # Documentación y diagramas
```

## Puesta en marcha

```bash
# Instalar dependencias
cd client && npm install
cd ../server && npm install

# Variables de entorno (copiar y completar)
#   server/.env  ← basado en server/.env.example
#   client/.env  ← VITE_API_URL=http://localhost:4000/api/v1

# Desarrollo
cd server && npm run dev     # API  → http://localhost:4000
cd client && npm run dev     # SPA  → http://localhost:5173
```

## Scripts del backend

| Script | Acción |
|--------|--------|
| `npm run dev` | Servidor en watch (tsx) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el build |
| `npm run typecheck` | Verifica tipos sin emitir |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |
| `npm test` / `test:coverage` | Vitest |
