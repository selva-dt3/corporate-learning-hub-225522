# Corporate Learning Hub - Frontend Workspace

This workspace contains the React frontend app under `lms_frontend/`.

## Quick Start (No-Auth Frontend)

- cd lms_frontend
- Create `.env` and set:
  - REACT_APP_API_BASE_URL (default http://localhost:3011)
- npm install
- npm start

Open http://localhost:3000.

## Environment Configuration

- Build-time: `.env` (requires dev server restart)
- Runtime overrides (no rebuild): edit `lms_frontend/public/env.js`
  - Values in `public/env.js` are injected into `window.__ENV__` and mirrored to `window._env_`. They take precedence over `.env`.
  - `public/index.html` includes `<script src="%PUBLIC_URL%/env.js"></script>` before the bundle so runtime env is available.
  - After changing `public/env.js`, perform a hard refresh (Shift+Reload) to avoid cached script issues.
  - A masked console log `[env.js] loaded` may appear confirming presence of keys.

Required key (frontend):
- REACT_APP_API_BASE_URL

Presence and precedence:
- The app reads env in this order: `window.__ENV__` / `window._env_` → `process.env` (CRA).
- A diagnostics page at `/env` shows booleans for presence of required keys (no secrets displayed).

## Integration Matrix

- Frontend → Backend:
  - Base URL from REACT_APP_API_BASE_URL (can be set via `.env` or `public/env.js`).
  - No Authorization header is attached by default in this no-auth mode.
- CORS:
  - Backend must include your frontend origin in CORS_ORIGINS and set FRONTEND_URL accordingly.
  - For preview/localhost, ensure exact protocol/host/port match.

## CORS Checklist

- Backend lms_backend/.env sets FRONTEND_URL to your primary frontend origin.
- Backend CORS_ORIGINS includes localhost and your preview frontend origin(s).
- Example:
  CORS_ORIGINS=http://localhost:3000,https://vscode-internal-12349-beta.beta01.cloud.kavia.ai:3000

## Recommended Runtime Values (example)

- window.__ENV__.REACT_APP_API_BASE_URL = "https://vscode-internal-20103-beta.beta01.cloud.kavia.ai:3001"

Notes:
- `.env` changes require restart of dev server.
- `public/env.js` changes require browser refresh (hard refresh to bust cache).

## End-to-End Verification Steps

1) Start backend (default http://localhost:3011) and frontend (http://localhost:3000).
2) Confirm runtime env:
   - Visit `/env` to see presence booleans (API base should be true).
3) Visit `/` and navigate to Admin, HR, Employee dashboards, Lessons, Quizzes, Analytics.
4) If the backend requires auth, some actions may return 401/403 (expected in no-auth mode).

## Troubleshooting

- CORS error (blocked by CORS policy):
  - Add your frontend origin to backend CORS_ORIGINS; restart backend.
- 401/403 Unauthorized:
  - The frontend does not send tokens in no-auth mode. Adjust backend policy or enable auth in the frontend if required.
- env not applied:
  - If using `.env`, restart `npm start`.
  - If using `public/env.js`, refresh browser (hard refresh to bust cache).

See lms_frontend/README.md inside the app for more details.
