# Express + MongoDB boilerplate for Udemy-like simplified app

1. Copy files into a folder.
2. `cp .env.example .env` and fill MONGO_URI and JWT_SECRET.
3. `npm install`
4. `npm run dev`

Endpoints:
- Auth: /auth/register, /auth/login, /auth/change-password
- Users: /users
- Cursos: /cursos
- Techs: /techs
- Horarios: /cursos/:id/horarios

Notes:
- User password can't be changed via `/users/:id` — use `/auth/change-password`.
- "sin_usuario" = visitor: public endpoints (GET /cursos, GET /techs) are accessible without token.