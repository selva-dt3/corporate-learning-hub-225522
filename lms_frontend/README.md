# LMS Frontend (React)

This is the React frontend for the Corporate Learning Hub. It implements:
- Supabase authentication (email/password)
- Role-based navigation (admin, hr, employee)
- Onboarding flow
- Dashboards and views for Lessons, Quizzes, and Analytics
- API client that forwards the Supabase access token

## Getting Started

1. Install dependencies
```
npm install
```

2. Configure environment variables

Option A — Build-time via `.env` (requires restart):
Create a `.env` file at the project root (next to `package.json`) with:
```
REACT_APP_SUPABASE_URL=<Your Supabase project URL>
REACT_APP_SUPABASE_ANON_KEY=<Your Supabase anon key>
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
    REACT_APP_SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
    REACT_APP_SUPABASE_ANON_KEY: "<anon key>",
    REACT_APP_API_BASE_URL: "https://vscode-internal-20103-beta.beta01.cloud.kavia.ai:3001"
  });
  window._env_ = window.__ENV__;
  // console.log("[env.js] loaded", Object.keys(window.__ENV__||{})); // optional
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
- Authorization: every request includes `Authorization: Bearer <supabase_access_token>` if signed in.
- CORS: backend must allow your origin via CORS_ORIGINS; otherwise browser blocks requests.

Runtime env quick check:
- See `[env.js] loaded` in console when runtime script is parsed.
- Visit `/env` to see presence booleans for keys:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY
  - REACT_APP_API_BASE_URL

## Project Structure

- `src/auth/SupabaseProvider.js` — Initialize Supabase client, manage session and profile, onboarding completion.
- `src/auth/ProtectedRoute.jsx` — Authentication and role-based route guards.
- `src/api/client.js` — Fetch wrapper with bearer token; base URL from env.
- `src/config/env.js` — Environment loader; fetches `/env.js` at runtime if needed.
- `src/router.jsx` — Routes and role dashboards.
- `src/pages` — Login, Onboarding, Dashboards, Lessons, Quizzes, Analytics.
- `src/components/layout` — Sidebar and Topbar.
- `src/App.css` — Ocean Professional theme.

## Security

- No hardcoded secrets.
- Tokens only read at runtime from Supabase session.
- Only boolean presence of env vars is logged for diagnostics.

## End-to-End Verification

1) Start backend http://localhost:3011 and frontend http://localhost:3000.
2) Login using Supabase user.
3) Complete onboarding; should route to appropriate role dashboard.
4) As admin/hr: create/list Lessons and Quizzes; create Assignments.
5) As employee: open assigned quiz; submit answers.
6) Analytics (admin/hr): verify summary loads.

## Environment Variables

Required:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_API_BASE_URL`

Behavior:
- Read order: `window.__ENV__` / `window._env_` → `process.env`.
- `public/index.html` loads `env.js` before bundle.
- Bootstrap falls back to fetching `/env.js` once if needed.
- Missing keys: single console warning via `assertRequiredEnv`.
- After editing `.env`, restart dev server. After editing `public/env.js`, hard refresh.

## Troubleshooting

- CORS blocked:
  - Ensure backend CORS_ORIGINS includes your frontend origin exactly (protocol, host, port).
- 401/403:
  - Ensure session is active and Authorization header is present; verify backend SUPABASE_JWT_SECRET.
- Stale runtime env:
  - Hard refresh or clear cache for `env.js`.
- Docs embedded:
  - Request backend to include your origin in DOCS_FRAME_ANCESTORS.
