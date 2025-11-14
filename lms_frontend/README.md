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
# Confirmed cloud backend (beta env):
# REACT_APP_API_BASE_URL=https://vscode-internal-31347-beta.beta01.cloud.kavia.ai:3001
```

Option B — Runtime via `public/env.js` (no rebuild):
- `public/index.html` includes `<script src="%PUBLIC_URL%/env.js"></script>` before the bundle so `window._env_` is available.
- Edit `public/env.js` to set:
```js
window._env_ = Object.assign({}, window._env_ || {}, {
  REACT_APP_SUPABASE_URL: "https://zladwgqmjudpsnhaunct.supabase.co",
  REACT_APP_SUPABASE_ANON_KEY: "<anon key>",
  REACT_APP_API_BASE_URL: "https://vscode-internal-31347-beta.beta01.cloud.kavia.ai:3001"
});
```
Notes:
- Values in `public/env.js` (window._env_) take precedence over `.env`.
- Changing `public/env.js` requires only a browser refresh (no rebuild).

3. Run the app
```
npm start
```

If you update `.env`, restart the dev server or your preview instance so changes take effect.  
If you update `public/env.js`, just refresh the browser.

Open http://localhost:3000 in your browser.

## Integration with Backend

- API base URL is read from `REACT_APP_API_BASE_URL` (or `window._env_.REACT_APP_API_BASE_URL`).
- Each request includes `Authorization: Bearer <supabase_access_token>` when the user is signed in.
- Ensure backend CORS allows your frontend origin (e.g., http://localhost:3000).

## Project Structure

- `src/auth/SupabaseProvider.js` — Initializes a single Supabase client, provides auth/session/role, profile fetching, and onboarding completion.
- `src/auth/ProtectedRoute.jsx` — Enforces authentication and optional roles; redirects to onboarding if incomplete.
- `src/api/client.js` — Fetch wrapper with `Authorization: Bearer <token>`, base URL from env.
- `src/config/env.js` — Centralized environment reader that checks `window._env_`, `import.meta.env`, and `process.env`.
- `src/router.jsx` — App routes using `react-router-dom`, with nested shell layout (Sidebar + Topbar).
- React Router v7 future flags enabled to silence deprecation warnings:
  - Set in `src/index.js` via `window.__reactRouterFuture = { v7_startTransition: true, v7_relativeSplatPath: true }`.
  - Reference: https://reactrouter.com/en/main/upgrading/future#future-flags
- `src/pages` — Login, Onboarding, and role-specific dashboards; Lessons, Quizzes, Analytics pages.
- `src/components/layout` — Sidebar and Topbar shared layout components.
- `src/App.css` — Theme and layout styles using Ocean Professional color palette.

## Security

- No secrets are hardcoded.
- Tokens are read at runtime from Supabase session.
- All API calls include the bearer token when available.

## Quick E2E sanity (manual)

1) Start backend at http://localhost:3011 (see backend README) and frontend at http://localhost:3000  
2) Login using a Supabase user that has a profile row in public.profiles  
3) Complete onboarding form  
4) Verify redirect to role dashboard (admin/hr/employee)  
5) Navigate to Lessons (list/create), Quizzes (list), and Analytics (for hr/admin only)

## Environment Variables

Required:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_API_BASE_URL`

Behavior:
- The app reads values in this order: `window._env_` -> `process.env` (CRA).
- `public/index.html` loads `env.js` before the bundle so `window._env_` is always available.
- Missing required keys produce a single console warning via `assertRequiredEnv`.
- After editing `.env`, restart the dev server. After editing `public/env.js`, hard refresh the browser to avoid cached script.
- Diagnostics: open `/env` to verify booleans for expected keys (no secrets shown).
