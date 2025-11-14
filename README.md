# Corporate Learning Hub - Frontend Workspace

This workspace contains the React frontend app under `lms_frontend/`.

Quick start:
- cd lms_frontend
- Create .env and set:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY
  - REACT_APP_API_BASE_URL (default http://localhost:3011)
- npm install
- npm start

Environment configuration:
- Build-time: `.env` (requires dev server restart)
- Runtime overrides (no rebuild): edit `lms_frontend/public/env.js`
  - Values in `public/env.js` are injected into `window._env_` and take precedence over `.env`.
  - public/index.html now includes `<script src="%PUBLIC_URL%/env.js"></script>` before the bundle to ensure `window._env_` is available at runtime.
  - After changing `public/env.js`, perform a hard refresh (Shift+Reload) to avoid cached script issues.

Recommended runtime values (example):
- window._env_.REACT_APP_SUPABASE_URL = "https://zladwgqmjudpsnhaunct.supabase.co";
- window._env_.REACT_APP_SUPABASE_ANON_KEY = "<anon key>";
- window._env_.REACT_APP_API_BASE_URL = "https://vscode-internal-31347-beta.beta01.cloud.kavia.ai:3001"

Notes:
- If you change `.env`, restart the dev server or preview so changes take effect.
- If you change `public/env.js`, no rebuild is needed; just refresh the browser (values are read at runtime). Prefer a hard refresh if the file looks cached.
- A minimal diagnostics page is available at `/env` (development-safe) which shows booleans for presence of expected keys.

Backend base URL:
- The frontend reads REACT_APP_API_BASE_URL. For the current environment use:
  https://vscode-internal-31347-beta.beta01.cloud.kavia.ai:3001
- You can set this in either `lms_frontend/.env` (requires restart) or `lms_frontend/public/env.js` (no rebuild).

See lms_frontend/README.md for detailed instructions and E2E sanity steps.