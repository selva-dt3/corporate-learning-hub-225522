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
Copy `.env.example` to `.env` and set values:
- `REACT_APP_SUPABASE_URL` (from Supabase Settings)
- `REACT_APP_SUPABASE_ANON_KEY` (from Supabase Settings)
- `REACT_APP_API_BASE_URL` (default: http://localhost:3001 or your preview backend URL)

3. Run the app
```
npm start
```

Open http://localhost:3000 in your browser.

## Integration with Backend

- API base URL is read from `REACT_APP_API_BASE_URL`.
- Each request includes `Authorization: Bearer <supabase_access_token>` when the user is signed in.
- Ensure backend CORS allows your frontend origin (e.g., http://localhost:3000).

## Project Structure

- `src/auth/SupabaseProvider.js` — Initializes Supabase client, provides auth/session/role, profile fetching, and onboarding completion.
- `src/auth/ProtectedRoute.jsx` — Enforces authentication and optional roles; redirects to onboarding if incomplete.
- `src/api/client.js` — Fetch wrapper with `Authorization: Bearer <token>`, base URL from `REACT_APP_API_BASE_URL`.
- `src/router.jsx` — App routes using `react-router-dom`, with nested shell layout (Sidebar + Topbar).
- `src/pages` — Login, Onboarding, and role-specific dashboards; Lessons, Quizzes, Analytics pages.
- `src/components/layout` — Sidebar and Topbar shared layout components.
- `src/App.css` — Theme and layout styles using Ocean Professional color palette.

## Security

- No secrets are hardcoded.
- Tokens are read at runtime from Supabase session.
- All API calls include the bearer token when available.

## Quick E2E sanity (manual)

1) Start backend at http://localhost:3001 (see backend README) and frontend at http://localhost:3000
2) Login using a Supabase user that has a profile row in public.profiles
3) Complete onboarding form
4) Verify redirect to role dashboard (admin/hr/employee)
5) Navigate to Lessons (list/create), Quizzes (list), and Analytics (for hr/admin only)

## Environment Variables

See `.env.example` for required settings.
