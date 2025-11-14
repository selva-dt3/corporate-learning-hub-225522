# LMS Frontend (React)

This is the React frontend for the Corporate Learning Hub. It implements:
- Supabase authentication (email/password)
- Role-based navigation (admin, hr, employee)
- Onboarding flow (minimal fields with backend/Supabase fallback)
- Dashboards and stub views for Lessons, Quizzes, and Analytics
- API client that forwards the Supabase access token

## Getting Started

1. Install dependencies
```
npm install
```

2. Configure environment variables
Copy `.env.example` to `.env` and set values:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_API_BASE_URL` (optional; when backend available)

3. Run the app
```
npm start
```

Open http://localhost:3000 in your browser.

## Project Structure

- `src/auth/SupabaseProvider.js` — Initializes Supabase client, provides auth/session/role context, profile fetching, and onboarding completion.
- `src/auth/ProtectedRoute.jsx` — Enforces authentication and optional roles; redirects to onboarding if incomplete.
- `src/api/client.js` — Fetch wrapper with `Authorization: Bearer <token>` header, base URL from `REACT_APP_API_BASE_URL`.
- `src/router.jsx` — App routes using `react-router-dom`, with nested shell layout (Sidebar + Topbar).
- `src/pages` — Login, Onboarding, and role-specific dashboards; Lessons, Quizzes, Analytics pages (stubbed until backend endpoints are ready).
- `src/components/layout` — Sidebar and Topbar shared layout components.
- `src/App.css` — Theme and layout styles using Ocean Professional color palette.

## Notes

- Role and onboarding are fetched from backend `/me` if `REACT_APP_API_BASE_URL` is set; otherwise the app falls back to the Supabase `profiles` table with fields: `role`, `onboarding_complete`, `full_name`, `department`.
- When the backend is ready, implement the following endpoints to replace stubs:
  - `GET /me` -> `{ role: 'admin'|'hr'|'employee', onboarding_complete: boolean, ... }`
  - `POST /onboarding/complete`
  - `GET /lessons`, `POST /lessons`, `DELETE /lessons/:id`
  - `GET /quizzes`
  - `GET /analytics/summary`

## Security

- No secrets are hardcoded.
- Tokens are read at runtime from Supabase session.
- All API calls include the bearer token when available.

## Environment Variables

See `.env.example` for required settings.
