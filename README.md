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

Note: After changing `.env`, restart the dev server or preview so environment changes take effect.

Backend base URL:
- The frontend reads REACT_APP_API_BASE_URL. For the current environment use:
  https://vscode-internal-31347-beta.beta01.cloud.kavia.ai:3001
- After setting this in lms_frontend/.env, restart the preview/dev server to apply.

See lms_frontend/README.md for detailed instructions and E2E sanity steps.