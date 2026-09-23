# Backend (FastAPI)

## Local development

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate # macOS/Linux

pip install -r requirements.txt
cp .env.example .env        # fill in DB_PASSWORD
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Health check: `GET /health`.

## Environments

The Dal-hosted Postgres server (`db-3130.cs.dal.ca`) has three databases matching deploy stages:

| Environment | DB Name              | DB User                   |
|-------------|-----------------------|----------------------------|
| devint      | CSCI3130_6_DEVINT     | CSCI3130_6_DEVINT_USER     |
| test        | CSCI3130_6_TEST       | CSCI3130_6_TEST_USER       |
| production  | CSCI3130_6_PRODUCTION | CSCI3130_6_PRODUCTION_USER |

Set `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `ENVIRONMENT` accordingly for each deploy target. `.env` is git-ignored — never commit real credentials.

## Deploying on Render

This service deploys from the repo root using `render.yaml` (rootDir: `backend`). Set these env vars in the Render dashboard (not committed to git):

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `CORS_ORIGINS` — the deployed frontend URL(s), comma-separated

Note: `db-3130.cs.dal.ca` may only accept connections from on-campus/VPN IPs. Confirm Render's servers can reach it before relying on this in production.
