# TODO - MERN Task Management App

## Step 1: Project Setup and Backend Configuration (Approved)

- [x] Create server scaffolding folders: config, models, routes, controllers, middleware, utils
- [x] Install backend dependencies for auth/security/validation
- [x] Add MongoDB User and Task Mongoose models (with indexes)
- [x] Add JWT auth middleware (scaffolding) and request typing
- [x] Create auth routes + controllers (scaffolding for signup/login endpoints)
- [x] Create tasks routes + controllers (scaffolding for CRUD endpoints)
- [x] Update `server/src/server.ts` to mount `/api/auth` and `/api/tasks` and add error handler
- [x] Ensure `server/env.example` includes JWT-related keys
- [x] Create `server/.env` template instructions (no secrets)
- [x] Implement actual auth logic (signup/login), token issuing, and protected task endpoints
- [x] Implement task creation and listing per user
- [x] Implement update/delete

## Step 2: Deployment + final testing

- [ ] Set Vercel environment variables:
- [ ]   **Client** (`gomycode-final-project-client`): `VITE_API_URL=https://gomycode-final-project-server.vercel.app`
- [ ]   **Server** (`gomycode-final-project-server`): `CORS_ORIGIN=http://localhost:5173,https://gomycode-final-project-client.vercel.app`
- [ ] Trigger redeploy on both projects
- [ ] Test login/signup on `https://gomycode-final-project-client.vercel.app/`
- [ ] Verify network calls hit the server without CORS errors
