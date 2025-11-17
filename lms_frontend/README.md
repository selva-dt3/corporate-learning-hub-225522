# LMS Frontend (React) — No-Auth Mode

This is the React frontend for the Corporate Learning Hub. In this deployment:
- No Supabase authentication is used
- All dashboards (Admin, HR, Employee) and pages (Lessons, Quizzes, Analytics) are publicly accessible
- A simple Home page provides links to each dashboard and section
- The API client does not attach Authorization headers by default

## Getting Started

1. Install dependencies
```
npm install
```

2. Configure environment variables

Option A — Build-time via `.env` (requires restart):
Create a `.env` file at the project root (next to `package.json`) with:
```
REACT_APP_API_BASE_URL=http://localhost:3011
# Example cloud backend (beta):
# REACT_APP_API_BASE_URL=https://vscode-internal-20103-beta.beta01.cloud.kavia.ai:3001
```

Option B — Runtime via `public/env.js` (no rebuild):
- `public/index.html` includes `<script src="%PUBLIC_URL%/env.js"></script>` before the bundle.
- Edit `public/env.js`:
```js
(function () {
  window.__ENV__ = Object.assign({}, window.__ENV__ || window._env_ || {}, {
    REACT_APP_API_BASE_URL: "https://vscode-internal-20103-beta.beta01.cloud.kavia.ai:3001"
  });
  window._env_ = window.__ENV__;
})();
```
Notes:
- `public/env.js` overrides `.env` at runtime.
- Change in `public/env.js` → refresh browser (hard refresh if cached).
- App will attempt a one-time fetch of `/env.js` at bootstrap if runtime env not yet present.

3. Run the app
```
npm start
```

Open http://localhost:3000 in your browser.

## Integration with Backend

- API base URL: `REACT_APP_API_BASE_URL` (from runtime env or `.env`).
- Authorization: no Authorization header is added by default in requests.
- CORS: backend must allow your origin via CORS_ORIGINS; otherwise browser blocks requests.

Runtime env quick check:
- Visit `/env` to see presence booleans for keys:
  - REACT_APP_API_BASE_URL

## Project Structure

- `src/auth/AppProvider.js` — Lightweight provider for no-auth mode, exposes a tokenless API client.
- `src/auth/useAuth.js` — Backward-compatible hook that now reads from `AppProvider`.
- `src/api/client.js` — Fetch wrapper without bearer token; base URL from env.
- `src/config/env.js` — Environment loader; fetches `/env.js` at runtime if needed.
- `src/router.jsx` — Public routes; Home page with links to dashboards.
- `src/pages` — Dashboards, Lessons, Quizzes, Analytics. Login/Onboarding paths redirect to `/`.
- `src/components/layout` — Sidebar and Topbar (auth controls removed).
- `src/App.css` — Ocean Professional theme.

## Security Notes

- No tokens are used; do not send sensitive data from the frontend.
- Only boolean presence of env vars is logged for diagnostics.

## End-to-End (No-Auth)

1) Start backend http://localhost:3011 and frontend http://localhost:3000.
2) Navigate to `/` and choose a dashboard.
3) Lessons/Quizzes: try creating/listing to validate backend behavior. In no-auth mode, the backend may respond with 401/403 if it requires auth — this is expected.
4) Analytics: loads summary if backend allows unauthenticated access; otherwise a friendly error is displayed.

## Environment Variables

Required:
- `REACT_APP_API_BASE_URL`

Behavior:
- Read order: `window.__ENV__` / `window._env_` → `process.env`.
- `public/index.html` loads `env.js` before bundle.
- Bootstrap falls back to fetching `/env.js` once if needed.

## Troubleshooting

- CORS blocked:
  - Ensure backend CORS_ORIGINS includes your frontend origin exactly (protocol, host, port).
- 401/403:
  - Backend may require authentication. In this no-auth mode the frontend does not send a token; adjust backend policies if public access is desired for demos.
- Stale runtime env:
  - Hard refresh or clear cache for `env.js`.
- Docs embedded:
  - Request backend to include your origin in DOCS_FRAME_ANCESTORS.
