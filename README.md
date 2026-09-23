# G6

Monorepo with two independently deployable services:

- [`frontend/`](frontend) — React + TypeScript + Vite
- [`backend/`](backend) — FastAPI, connecting to a Postgres DB hosted on `db-3130.cs.dal.ca`

## Local development

```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:5173

# Backend (separate terminal)
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env # fill in DB_PASSWORD
uvicorn app.main:app --reload   # http://localhost:8000
```

The frontend proxies `/api/*` to the backend (see below), so in dev, requests to `/api/health` from the browser hit `localhost:5173` and Vite forwards them to `localhost:8000`.

## Deploying on Render

`render.yaml` at the repo root defines both services as a [Render Blueprint](https://render.com/docs/blueprint-spec), or create them manually (Web Service for `backend/`, Static Site for `frontend/`) if you want to pick the Free plan explicitly.

- `g6-backend` — Python web service, built from `backend/`
- `g6-frontend` — static site, built from `frontend/`

Secrets marked `sync: false` (DB credentials) must be set manually per environment in the dashboard — they are never committed to git.

### Same-origin API proxy (important)

`*.onrender.com` subdomains are each treated as a separate "site" by browsers, so a plain cross-origin `fetch` from the frontend to the backend gets blocked by tracker/privacy blockers (Brave Shields, Firefox strict mode, uBlock, etc.) even with CORS configured correctly — no CORS header fixes that.

Instead, the frontend proxies `/api/*` to the backend so the browser only ever calls its own origin:

- **Local dev**: handled by `frontend/vite.config.ts`'s `server.proxy` config
- **Production**: add a rewrite rule on the `g6-frontend` static site (dashboard: **Redirects/Rewrites**, or already in `render.yaml`):
  - Source: `/api/*`
  - Destination: `https://<your-backend-url>.onrender.com/:splat`
  - Type: Rewrite

Update the destination in `render.yaml` (and/or the dashboard) once you know your actual backend URL. The frontend code always calls relative paths like `/api/health` — never the backend's absolute URL.

See [`backend/README.md`](backend/README.md) for DB environment details (devint/test/production).
