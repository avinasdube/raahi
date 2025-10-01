# Raahi – Full Stack Travel Assistant

Raahi blends a modern React experience with an Express/MongoDB backend to help travellers explore India. Out of the box you get curated hotel discovery, marketplace listings, budgeting tools, safety references, and an AI-powered trip planner that can call Google Gemini or other LLMs.

This README covers the monorepo layout, local setup, configuration, AI integration, deployment pointers, and day‑to‑day commands.

## Tech Stack

- **Client**: React 19, Vite 7, React Router, Tailwind CSS 4, Axios, WebLLM (client-side assistant)
- **Server**: Node.js + Express 5, Mongoose 8 (MongoDB), JWT auth, cookie sessions, hardened CORS
- **AI services**: Pluggable LLM bridge (`server/src/services/aiProvider.js`) with Google Gemini, OpenAI, or deterministic fallbacks
- **Tooling**: npm workspaces, ESLint, nodemon, modern ES modules

## Repository Layout

```text
client/            # Vite React SPA
  src/             # Pages, components, hooks, API clients
  public/          # Static assets (add _redirects here for SPAs)
  vite.config.js

server/            # Express API
  src/index.js     # App entry (Express 5)
  src/controllers/ # REST controllers
  src/models/      # Mongoose models
  src/services/    # AI provider + helpers
  src/scripts/     # Seed/CSV utilities

package.json       # npm workspaces + shared scripts
```

## Getting Started

1. **Install dependencies** (workspace-aware):

   ```bash
   npm install
   ```

2. **Configure environment variables**:
   - Copy `server/.env.example` → `server/.env` and set Mongo URI, JWT secret, optional LLM settings, etc.
   - (Optional) Copy `client/.env.example` → `client/.env` to override `VITE_API_BASE_URL` or feature flags.

3. **Run the apps** (two terminals recommended):
   - Client: `npm run dev` (alias for `npm run dev:client`)
   - Server: `npm run dev:server`

   Default ports are 5173 (client) and 8800 (API). CORS is pre-configured to accept localhost origins and any domains listed in `CORS_ORIGIN`.

## Useful Scripts

| Location | Script | Purpose |
| --- | --- | --- |
| root | `npm run dev` | Start the Vite client (front-end only). |
| root | `npm run dev:server` | Start the Express API via the server workspace. |
| root | `npm run build-client` | Production build of the React app (outputs `client/dist`). |
| root | `npm run seed` | Seed MongoDB with demo data (`server/src/seed.js`). |
| root | `npm run export:csv` | Export sample data to CSV (`server/src/scripts/exportToCSV.js`). |
| client | `npm run lint` | Run ESLint on the React app. |
| server | `npm run start` | Nodemon-powered API server (watch mode). |

All workspace scripts can be executed through the root by prefixing with `npm run <script> --workspace <name>`.

## Configuration & Environment Variables

**Server (`server/.env`)**

| Variable | Description |
| --- | --- |
| `PORT` | API port (default 8800). |
| `CORS_ORIGIN` | Comma-separated whitelist of frontend origins. Localhost/127.0.0.1 are always allowed. |
| `MONGODB_URI` | MongoDB connection string. |
| `JWT_SECRET`, `TOKEN_EXPIRES_IN`, `TOKEN_MAX_AGE_DAYS` | Auth token configuration. |
| `NODE_ENV` | `development` or `production`. |
| `LLM_PROVIDER` | `off`, `google`, `openai`, etc. Controls the AI provider. |
| `LLM_API_KEY` / `OPENAI_API_KEY` | API key used by the selected provider. |
| `LLM_MODEL` | Model identifier (e.g. `gemini-1.5-flash`, `gpt-4o-mini`). |

**Client (`client/.env`)**

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Overrides the API base. Defaults are defined in `client/src/utils/index.js`. |
| `VITE_ENABLE_AI_ASSISTANT` | Optional flag for the WebLLM sidebar. |

## AI Trip Planner & Gemini Usage

The API endpoint `POST /api/ai/plan` delegates to `callLLMWithPlanPrompt` in `server/src/services/aiProvider.js`. The service:

- Accepts a `provider`, `apiKey`, and `model` from environment variables.
- When `LLM_PROVIDER=google`, it invokes Google Gemini through the official REST endpoint `models.generateContent`, sending the prompt and optional system message. The helper automatically sets sensible defaults like temperature and collects the text parts from the response.
- If the provider is `off`, missing, or fails, the controller falls back to a deterministic heuristic planner so the feature still returns useful itineraries.

On the client, the AI assistant widget can also run locally via WebLLM for quick Q&A without hitting external APIs.

## REST API Snapshot

- `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/logout`, `GET /api/auth/me`, `PUT /api/auth/update`
- `GET /api/hotels`, `GET /api/hotels/:id`
- `GET /api/pois`, `GET /api/pois/:city`
- `GET /api/weather`, `GET /api/crowd`, `GET /api/currency`
- `POST /api/ai/plan` (uses the AI provider described above)

Responses commonly include JWT cookies (`HttpOnly`, `SameSite` managed dynamically). CORS is enforced via middleware that honours the whitelist and gracefully denies unknown origins.

## Data Utilities

- `npm run seed` populates MongoDB with sample hotels, POIs, weather, crowd, and currency documents.
- `npm run export:csv` generates CSV exports in `server/src/exports/` for analytics or spreadsheet use.

## Deployment Guide (Generalised)

### Client (Static Hosting)

1. Build: `npm run build-client` → assets in `client/dist`.
2. Deploy `client/dist` to any static host (Render, Netlify, Vercel, S3, etc.).
3. For client-side routing, add a `_redirects` file under `client/public` with `/* /index.html 200` so deep links resolve correctly.
4. Set environment variables (e.g. `VITE_API_BASE_URL`) in your hosting provider, then trigger a rebuild.

### Server (Node Hosting)

1. Provision a Node 18+ runtime with access to MongoDB.
2. Copy `server` folder or deploy via repo + workspace install: `npm install --workspace server`.
3. Run `npm run start --workspace server` (production) or wrap with a process manager (PM2, systemd).
4. Ensure `CORS_ORIGIN` lists your static-site domain and that the service uses HTTPS for secure cookies.

## Troubleshooting

- **CORS blocked**: Verify the frontend origin is included in `CORS_ORIGIN`. Localhost and 127.0.0.1 are auto-permitted.
- **Auth cookie missing**: Use the same protocol/domain as configured. Production must be HTTPS for `SameSite=None`.
- **AI planner returns fallback data**: Confirm `LLM_PROVIDER`, `LLM_API_KEY`, and `LLM_MODEL` are set. Check provider dashboards for quota errors.
- **`dist` missing during deploy**: Always run `npm run build-client` and deploy the resulting `client/dist` folder, not the raw source.

## Contributing

- Branch from `dev` and keep PRs focused.
- Run `npm run dev` and `npm run dev:server` locally before opening a pull request.
- Use meaningful commit messages and update documentation/tests when behaviour changes.

---

Enjoy exploring Raahi and feel free to open issues or feature suggestions!
