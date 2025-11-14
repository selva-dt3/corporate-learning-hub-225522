(function () {
  // Runtime environment configuration for the LMS frontend.
  // This file is loaded by public/index.html before the React bundle.
  // It allows overriding env without rebuilding the app.
  var existing = (typeof window !== "undefined" && (window.__ENV__ || window._env_)) || {};

  var injected = {
    // REQUIRED: Set to your Supabase project URL
    REACT_APP_SUPABASE_URL: existing.REACT_APP_SUPABASE_URL || "",
    // REQUIRED: Set to your Supabase anon public key
    REACT_APP_SUPABASE_ANON_KEY: existing.REACT_APP_SUPABASE_ANON_KEY || "",
    // REQUIRED: Backend API base URL; defaults to local dev
    REACT_APP_API_BASE_URL: existing.REACT_APP_API_BASE_URL || "http://localhost:3011"
  };

  // Merge into window.__ENV__ and mirror to window._env_ for CRA compatibility
  window.__ENV__ = Object.assign({}, existing, injected);
  window._env_ = window.__ENV__;

  // Non-sensitive diagnostics
  var presence = {
    REACT_APP_SUPABASE_URL: !!window.__ENV__.REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_ANON_KEY: !!window.__ENV__.REACT_APP_SUPABASE_ANON_KEY,
    REACT_APP_API_BASE_URL: !!window.__ENV__.REACT_APP_API_BASE_URL
  };
  // eslint-disable-next-line no-console
  console.log("[env.js] loaded", presence);
})();
