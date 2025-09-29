# Raahi – Full Stack Monorepo (Client + Server)

Raahi is an India-first travel experience combining a modern React frontend and a Node/Express API. It offers hotel discovery, AI-assisted trip planning, a tourism marketplace, safety utilities, and more.

This README covers the entire project: architecture, setup, environment variables, scripts (including a single command to run both apps), APIs, and troubleshooting.

## Stack Overview

- Client: React 19 + Vite 7 + Tailwind CSS 4, React Router, Axios
- Server: Node.js + Express 5, Mongoose 8 (MongoDB), JWT auth, CORS
- AI: Optional LLM provider (OpenAI-compatible) or deterministic fallback; in-browser WebLLM assistant on the client
- Tooling: npm workspaces, concurrently

## Project Structure

- client/ — React app (Vite)
- server/ — Express API + MongoDB
- server/src/scripts/exportToCSV.js — Utility to export seed data to CSV

Key entry points:

- Client dev server: `client/vite.config.js` (default port 5173)
- Server app: `server/src/index.js` (default port 8800)

## Quick Start

Prerequisites:

- Node.js 18+ (LTS recommended)
- MongoDB instance (local or Atlas)

1) Install dependencies at the repo root (uses npm workspaces):

```bash
npm install
```

1. Configure environment variables:

- Copy `server/.env.example` to `server/.env` and update values (MongoDB URI, JWT secret, etc.).
- (Optional) Copy `client/.env.example` to `client/.env` if you want to override API URL.

1. Start both client and server together (single command):

```bash
npm run dev
```

- Client runs at <http://localhost:5173> (Vite)
- Server runs at <http://localhost:8800> (Express)

Tip: The server CORS defaults already allow localhost:5173 and 3000. Adjust `CORS_ORIGIN` in `server/.env` if needed.

## Scripts (root)

- dev — Run client and server concurrently
- seed — Run server seeding script (`server/src/seed.js`)
- export:csv — Export demo data to CSV (`server/src/scripts/exportToCSV.js`)
- build — Build the client for production
- preview — Preview the built client locally

You can still run workspace scripts directly:

- Client: `npm run dev --workspace client`
- Server: `npm run start --workspace server`

## Environment Variables

Server (`server/.env`):

- PORT=8800 — API port
- CORS_ORIGIN=<http://localhost:5173>,<http://127.0.0.1:5173>,<http://localhost:3000> — Allowed origins
- MONGODB_URI=... — MongoDB connection string
- JWT_SECRET=... — Secret for signing JWTs
- TOKEN_EXPIRES_IN=7d — JWT expiry
- TOKEN_MAX_AGE_DAYS=7 — Cookie max age
- LLM_PROVIDER=off — Set to off to disable external LLM calls; or set to e.g. openai
- LLM_API_KEY=... / OPENAI_API_KEY=... — API key for provider
- LLM_MODEL=gpt-4o-mini — Model name for provider (OpenAI)
  - To use Google Gemini (often free tier):
    - LLM_PROVIDER=google
    - LLM_API_KEY=your_gemini_api_key
    - LLM_MODEL=gemini-1.5-flash (default if omitted)
- NODE_ENV=development — Environment

Client (`client/.env`):

- VITE_API_BASE_URL=<http://localhost:8800/api> — API base. If not set, the client uses sensible defaults (see `client/src/utils/index.js`).

## Client App Highlights

- Elegant UI with Tailwind, responsive and accessible patterns
- Hotels catalogue with filters, sorting, and pagination on sample data
- Planner with AI itinerary suggestions
- Marketplace for stays/experiences/guides/shops (mocked data)
- Safety utilities (helplines, alerts, nearby facilities – mock)
- Budget tracking and currency conversion (mock)

Key files:

- `client/src/pages/*` — Pages such as Home, Hotels, Planner, Marketplace, Safety, Budget, Auth, etc.
- `client/src/api/api.js` — Axios-based API client using `API_BASE_URL` from `client/src/utils/index.js`
- `client/src/utils/index.js` — Central config for API base URL and endpoints

Development:

- `npm run dev` at root runs Vite and the server together.
- The client uses `withCredentials` where applicable.

## Server API Overview

Base URLs:

- Local: <http://localhost:8800/api>
- Prod: <https://raahi-server.onrender.com/api>

Auth

- POST /auth/signup — Body: { name or fullName, email, password } → { user, token } + cookie
- POST /auth/login — Body: { email, password } → { user, token } + cookie
- GET /auth/logout — Clears cookie
- GET /auth/me — Returns current user (requires auth)
- PUT /auth/update — Update name and/or password (requires auth)

Data

- GET /weather — All weather rows
- GET /crowd — Crowd data
- GET /currency — Currency rows
- GET /hotels — Hotels (optionally filter via query params like `location`)
- GET /hotels/:id — Hotel by id
- GET /pois — All POIs
- GET /pois/:city — POIs for a given city

AI

- POST /ai/plan — Generates a trip plan
  - Body: { city, startDate?, days, travelers?, interests?, budget?, constraints?, season? }
  - Uses deterministic fallback if external LLM is disabled or fails

CORS & Cookies

- CORS allows local development origins by default; customize with `CORS_ORIGIN`.
- Cookies are `SameSite=None; Secure` in production. In development, `SameSite=Lax`.

## Seeding and CSV Export

- Seed DB: `npm run seed` from the repo root (runs `server/src/seed.js`). Ensure `MONGODB_URI` is set.
- Export CSVs: `npm run export:csv` from the repo root. Outputs to `server/src/exports/*.csv`.

## Deployment Notes

- Client build: `npm run build` (output in `client/dist`)
- Serve client from a static host or CDN. Update `API_BASE_URL`/`VITE_API_BASE_URL` to point to your deployed API.
- Server: Provide `MONGODB_URI`, `JWT_SECRET`, and `CORS_ORIGIN` to match your client domain(s). Ensure HTTPS in production for cookies.

## Troubleshooting

- Server won’t start: Check `MONGODB_URI` and that MongoDB is reachable. Review logs for connection errors in `server/src/config/dbConfig.js`.
- CORS errors: Ensure the browser origin is present in `CORS_ORIGIN` and that the client requests use the correct base URL.
- Auth cookie not set in dev: Use http:// (not https) for localhost; in production, ensure HTTPS and `SameSite=None`.
- AI planner returns deterministic results: That’s expected when `LLM_PROVIDER=off` or the provider fails. Provide `LLM_PROVIDER`, `LLM_API_KEY`, and `LLM_MODEL` to enable remote LLMs.
- WebLLM model loading is slow: First load downloads and compiles the model; subsequent loads are cached by the browser. Prefer modern Chrome/Edge with WebGPU enabled.

## Contributing

- Use feature branches off `dev`.
- Keep PRs focused and include a brief description.
- Run the app locally with `npm run dev` and verify affected pages.

---

Enjoy exploring Raahi, and feel free to open issues or suggest enhancements.
