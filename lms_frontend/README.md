# LMS Frontend (React) — No-Auth Mode

This is the React frontend for the Corporate Learning Hub. In this deployment:
- No Supabase authentication is used
- All dashboards (Admin, HR, Employee) and pages (Lessons, Quizzes, Analytics) are publicly accessible
- A polished Home page provides role cards (Admin, HR, Employee) with Ocean Professional theme
- The API client does not attach Authorization headers by default

Screenshots (placeholders):
- Home: docs/screenshots/home.png
- Admin Dashboard: docs/screenshots/admin.png
- HR Dashboard: docs/screenshots/hr.png
- Employee Dashboard: docs/screenshots/employee.png

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

## Design System (Ocean Professional)

- Tokens: see `src/theme.css` (colors, spacing, shadows)
- Core components (reusable, accessible):
  - `Button` (`src/components/ui/Button.jsx`) variants: primary, secondary, ghost, danger
  - `Card` (`src/components/ui/Card.jsx`)
  - `Badge` (`src/components/ui/Badge.jsx`) variants: success, warning, error, info
  - `Tabs` (`src/components/ui/Tabs.jsx`) headless ARIA tabs
  - `Modal` (`src/components/ui/Modal.jsx`) focus management, ESC close
  - `Toast` (`src/components/ui/Toast.jsx`) provider with `useToast()`

Usage example:
```jsx
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import { useToast } from './components/ui/Toast';

function Example() {
  const toast = useToast();
  return (
    <Card header="Demo">
      <Button onClick={() => toast.show('Saved!', 'success')}>Save</Button>
    </Card>
  );
}
```

## Layout

- `DashboardLayout` (`src/components/layout/DashboardLayout.jsx`) used by Admin, HR, Employee dashboards, Lessons, Quizzes, Analytics.
- Sidebar and Topbar refined styling with active states and ARIA roles.

## Integration with Backend

- API base URL: `REACT_APP_API_BASE_URL` (from runtime env or `.env`).
- Authorization: no Authorization header is added by default in requests.
- CORS: backend must allow your origin via CORS_ORIGINS; otherwise browser blocks requests.

Runtime env quick check:
- Visit `/env` to see presence booleans for keys:
  - REACT_APP_API_BASE_URL

## Project Structure

- `src/auth/AppProvider.js` — Provider for no-auth mode, tokenless API client.
- `src/api/client.js` — Fetch wrapper without bearer token; base URL from env.
- `src/config/env.js` — Environment loader; fetches `/env.js` at runtime if needed.
- `src/router.jsx` — Public routes; Home and dashboards use shared layout.
- `src/pages` — Dashboards, Lessons, Quizzes, Analytics.
- `src/components/layout` — Sidebar, Topbar, DashboardLayout.
- `src/components/ui` — Reusable UI components.
- `src/theme.css` — Ocean Professional tokens.

## Accessibility

- Buttons, Tabs, Modal include appropriate ARIA attributes.
- Focus states are visible (focus ring).
- Landmark roles used (nav, region, dialog).

## End-to-End (No-Auth)

1) Start backend http://localhost:3011 and frontend http://localhost:3000.
2) Navigate to `/` and choose a dashboard.
3) Lessons/Quizzes: try creating/listing to validate backend behavior.
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
