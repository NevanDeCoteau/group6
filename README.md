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

## Deploying on Render

`render.yaml` at the repo root defines both services as a [Render Blueprint](https://render.com/docs/blueprint-spec):

- `g6-backend` — Python web service, built from `backend/`
- `g6-frontend` — static site, built from `frontend/`

In the Render dashboard: **New > Blueprint**, point it at this repo, and Render provisions both services from `render.yaml`. Secrets marked `sync: false` (DB credentials, CORS origins, API URL) must be set manually per environment in the dashboard — they are never committed to git.

See [`backend/README.md`](backend/README.md) for DB environment details (devint/test/production).
