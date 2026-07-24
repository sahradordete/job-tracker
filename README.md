# Job Application Tracker

A full-stack web app for tracking job applications — company, role, status, and notes — built to replace a messy spreadsheet with something purpose-built.

## Live Demo
- App: https://job-tracker-zeta-sepia.vercel.app
- API: https://job-tracker-ew1w.onrender.com

## Features

- **Authentication** — secure registration and login with JWT access tokens and httpOnly refresh tokens, so sessions persist safely without storing tokens in localStorage
- **Full CRUD** — create, edit, delete, and list applications, scoped per user with protection against IDOR (Insecure Direct Object Reference) vulnerabilities
- **Filtering & sorting** — filter by application status (Applied, Interview, Offer, Rejected, Withdrawn) and sort by date or company
- **Dark/light theme** — toggleable, persisted across sessions
- **Silent session refresh** — expired access tokens are renewed automatically in the background via an axios interceptor, without interrupting the user

## Tech stack

**Frontend**
- React (Vite)
- React Router
- Axios

**Backend**
- Node.js / Express
- PostgreSQL
- Prisma ORM
- JWT (access + refresh token pattern)
- bcrypt for password hashing

**Infrastructure**
- Docker (local PostgreSQL)

## Architecture notes

- Passwords are hashed with bcrypt before storage; plaintext passwords are never persisted or logged
- Access tokens are short-lived and kept in memory on the client; refresh tokens are stored as httpOnly cookies, reducing exposure to XSS
- All application routes are protected by JWT middleware, and every database query scopes results to `req.userId` to prevent one user from accessing another's data by guessing an ID
- Prisma schema models a simple relational structure: `User` → `Application` (one-to-many)

## Getting started

### Prerequisites
- Node.js
- Docker

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/YOUR_USERNAME/job-tracker.git
   cd job-tracker
   ```

2. Install dependencies
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. Start PostgreSQL via Docker
   ```bash
   docker compose up -d
   ```

4. Create a `.env` file in the project root:
   ```
   DATABASE_URL="postgresql://jobtracker:devpassword@localhost:5432/jobtracker?schema=public"
   JWT_SECRET="your-secret-here"
   JWT_REFRESH_SECRET="your-other-secret-here"
   JWT_EXPIRES_IN="15m"
   ```

5. Run migrations
   ```bash
   npx prisma migrate dev
   ```

6. Start the backend
   ```bash
   npm run dev
   ```

7. In a separate terminal, start the frontend
   ```bash
   cd client
   npm run dev
   ```

8. Open `http://localhost:5173`

## Project structure

```
job-tracker/
├── client/              # React frontend
│   └── src/
│       ├── pages/       # Login, Register, Dashboard
│       ├── components/  # ApplicationForm, StatusStamp, ThemeToggle
│       ├── context/     # AuthContext, ThemeContext
│       └── api/         # axios instance with refresh interceptor
├── src/                 # Express backend
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── lib/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── docker-compose.yml
```

## Roadmap

- [ ] Deploy (Vercel + Render)
- [ ] CSV export
- [ ] Application statistics overview

## License

MIT
