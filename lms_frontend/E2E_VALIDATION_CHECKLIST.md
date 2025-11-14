# E2E Validation Checklist

Use this checklist to verify the LMS end-to-end in any environment (local or preview). Do not commit real secrets.

Prerequisites:
- Backend running and reachable (e.g., http://localhost:3011 or your preview URL:PORT).
- Frontend running and reachable (e.g., http://localhost:3000 or your preview host).
- Backend CORS configured to include the frontend origin(s).
- Supabase project with at least one test user.

Frontend runtime config:
- lms_frontend/public/env.js contains:
  - window.__ENV__.REACT_APP_SUPABASE_URL
  - window.__ENV__.REACT_APP_SUPABASE_ANON_KEY
  - window.__ENV__.REACT_APP_API_BASE_URL (must match the backend)
- Optional local: lms_frontend/.env mirrors the above (requires restart).

Backend env:
- lms_backend/.env created from .env.example with values:
  - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET
  - FRONTEND_URL set to the primary frontend origin
  - CORS_ORIGINS includes localhost and preview frontend origins
  - DOCS_FRAME_ANCESTORS includes 'self' and preview frontend origin if embedding docs
  - PORT (default 3011)

CORS validation:
- From the browser console, fetch(`${REACT_APP_API_BASE_URL}/`) returns 200 with proper CORS headers.
- No CORS preflight errors appear when navigating the app.

E2E steps:

1) Login
- Open the frontend.
- Click Login and authenticate with a Supabase user (email/password).
- Verify successful session retrieval (no auth errors in console).

2) Onboarding
- If first login or onboarding incomplete, fill "Full Name" and "Department".
- Submit and verify onboarding_complete flips to true (profile PUT /auth/profile succeeds).

3) Role dashboard
- Confirm redirect to appropriate dashboard based on role:
  - admin: Admin Dashboard
  - hr: HR Dashboard
  - employee: Employee Dashboard

4) Create lesson (admin/hr)
- Navigate to Lessons.
- Create a new lesson (title + optional content URL).
- Verify it appears in list and GET /lessons includes the new record.

5) Create quiz (admin/hr)
- Navigate to Quizzes.
- Create a quiz with a simple spec (at least one question and correct answer).
- Verify it appears in list and GET /quizzes includes the new record.

6) Create assignment (admin/hr)
- Assign the created lesson and/or quiz to an employee user via Assignments UI or API.
- Verify GET /assignments includes the new assignment for the assignee.

7) Submit quiz (employee)
- As the employee, open assigned quiz.
- Answer questions and submit.
- Verify 200 from POST /quizzes/{quiz_id}/submit and a score/max_score returned.

8) Analytics (admin/hr)
- Navigate to Analytics.
- Verify GET /analytics/summary returns counts and the UI displays them:
  - users
  - lessons (>= 1)
  - quizzes (>= 1)
  - assignments (>= 1 if created)
  - quiz_submissions (>= 1 after submission)

Troubleshooting:
- If 401/403 errors: ensure Supabase session token is present and forwarded; check SUPABASE_JWT_SECRET matches your project.
- If CORS errors: check CORS_ORIGINS and FRONTEND_URL in backend .env; ensure they include the exact scheme+host+port of the frontend.
- If env missing: open /env page and verify presence booleans. Update public/env.js and hard-refresh.
