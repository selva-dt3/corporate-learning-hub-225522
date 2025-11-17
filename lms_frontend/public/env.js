(function () {
  // Client-safe runtime configuration for the LMS frontend.
  // This script is loaded before the app bundle via public/index.html.
  // It allows changing Supabase and API endpoints without rebuilding.
  var existing = (typeof window !== 'undefined' && (window.__ENV__ || window._env_)) || {};

  // Only include public/anon values here. Do NOT place any server-only secrets (e.g., service role keys).
  var runtimeEnv = Object.assign({}, existing, {
    REACT_APP_SUPABASE_URL: "https://fcrzmnafjvclnvyuquau.supabase.co",
    REACT_APP_SUPABASE_ANON_KEY: "<the user-provided SUPABASE_KEY value>",
    REACT_APP_API_BASE_URL: "http://localhost:3001"
  });

  window.__ENV__ = runtimeEnv;
  // Mirror for backward compatibility with code that reads window._env_
  window._env_ = window.__ENV__;

  try {
    // Masked presence log (no secrets printed)
    // eslint-disable-next-line no-console
    console.log("[env.js] loaded", {
      REACT_APP_SUPABASE_URL: Boolean(runtimeEnv.REACT_APP_SUPABASE_URL),
      REACT_APP_SUPABASE_ANON_KEY: Boolean(runtimeEnv.REACT_APP_SUPABASE_ANON_KEY),
      REACT_APP_API_BASE_URL: Boolean(runtimeEnv.REACT_APP_API_BASE_URL)
    });
  } catch (_) { /* noop */ }
})();
