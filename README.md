# Corporate Learning Hub - Frontend Workspace

This workspace contains the React frontend app under `lms_frontend/`.

## Quick Start

- cd lms_frontend
- Create `.env` and set:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY
  - REACT_APP_API_BASE_URL (default http://localhost:3011)
- npm install
- npm start

Open http://localhost:3000.

## Environment Configuration

- Build-time: `.env` (requires dev server restart)
- Runtime overrides (no rebuild): edit `lms_frontend/public/env.js`
  - Values in `public/env.js` are injected into `window.__ENV__` and mirrored to `window._env_`. They take precedence over `.env`.
  - `public/index.html` includes `<script src="%PUBLIC_URL%/env.js"></script>` before the bundle so runtime env is available.
  - Supabase client is initialized using the supabase-js v2 single-object signature; only anon key is ever used on the client.
  - After changing `public/env.js`, perform a hard refresh (Shift+Reload) to avoid cached script issues.
  - A masked console log `[env.js] loaded` appears confirming presence of keys.

Required keys (frontend):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY
- REACT_APP_API_BASE_URL

Presence and precedence:
- The app reads env in this order: `window.__ENV__` / `window._env_` → `process.env` (CRA).
- A diagnostics page at `/env` shows booleans for presence of required keys (no secrets displayed).

## Integration Matrix

- Frontend → Backend:
  - Base URL from REACT_APP_API_BASE_URL (can be set via `.env` or `public/env.js`).
  - Authorization header automatically populated: `Bearer <Supabase access token>` when signed in.
- Backend → Supabase:
  - Validates JWT using SUPABASE_JWT_SECRET.
  - Uses SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY for server operations.
- CORS:
  - Backend must include your frontend origin in CORS_ORIGINS and set FRONTEND_URL accordingly.
  - For preview/localhost, ensure exact protocol/host/port match.

## CORS Checklist

- Backend lms_backend/.env sets FRONTEND_URL to your primary frontend origin.
- Backend CORS_ORIGINS includes localhost and your preview frontend origin(s).
- Example:
  CORS_ORIGINS=http://localhost:3000,https://vscode-internal-12349-beta.beta01.cloud.kavia.ai:3000

## Recommended Runtime Values (example)

- window.__ENV__.REACT_APP_SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
- window.__ENV__.REACT_APP_SUPABASE_ANON_KEY = "<anon key>";
- window.__ENV__.REACT_APP_API_BASE_URL = "https://vscode-internal-20103-beta.beta01.cloud.kavia.ai:3001"

Notes:
- `.env` changes require restart of dev server.
- `public/env.js` changes require browser refresh (hard refresh if cached).

## End-to-End Verification Steps

1) Start backend (default http://localhost:3011) and frontend (http://localhost:3000).
2) Confirm runtime env:
   - Visit `/env` to see presence booleans (all three keys should be true).
3) Login:
   - Use Supabase email/password for a user present in Supabase Auth.
4) Onboarding:
   - Submit full_name and department; onboarding completion should route to dashboard.
5) Role-based dashboards:
   - Admin: DashboardAdmin
   - HR: DashboardHR
   - Employee: DashboardEmployee
6) Admin/HR CRUD:
   - Lessons: create/list; verifies /lessons POST/GET.
   - Quizzes: create/list; verifies /quizzes POST/GET.
   - Assignments: create via UI/API; verifies /assignments.
7) Employee quiz:
   - Open assigned quiz, submit answers; verifies /quizzes/{id}/submit.
8) Analytics:
   - HR/Admin open Analytics page; /analytics/summary returns counts.

## Troubleshooting

- CORS error (blocked by CORS policy):
  - Add your frontend origin to backend CORS_ORIGINS; restart backend.
- 401/403 Unauthorized:
  - Ensure you are logged in and the Authorization header is sent.
  - Verify backend SUPABASE_JWT_SECRET matches Supabase project's JWT secret.
- env not applied:
  - If using `.env`, restart `npm start`.
  - If using `public/env.js`, refresh browser (hard refresh to bust cache).
- Cannot embed /docs:
  - Ask backend to include your origin in DOCS_FRAME_ANCESTORS.

See lms_frontend/README.md inside the app for more details.