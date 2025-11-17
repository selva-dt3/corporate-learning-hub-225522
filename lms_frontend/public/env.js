(function () {
  // Define only client-safe keys here. Never put service role or secrets.
  var existing = (typeof window !== 'undefined' && (window.__ENV__ || window._env_)) || {};
  window.__ENV__ = Object.assign({}, existing, {
    // Example placeholders; replace at deploy/runtime. Keep values empty by default to avoid accidental leakage.
    // REACT_APP_SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
    // REACT_APP_SUPABASE_ANON_KEY: "<anon key>",
    // REACT_APP_API_BASE_URL: "http://localhost:3011"
  });
  window._env_ = window.__ENV__;
  try {
    // eslint-disable-next-line no-console
    console.log('[env.js] loaded', {
      hasWindowEnv: true,
      REACT_APP_SUPABASE_URL: Boolean(window.__ENV__.REACT_APP_SUPABASE_URL),
      REACT_APP_SUPABASE_ANON_KEY: Boolean(window.__ENV__.REACT_APP_SUPABASE_ANON_KEY),
      REACT_APP_API_BASE_URL: Boolean(window.__ENV__.REACT_APP_API_BASE_URL),
    });
  } catch (e) { /* noop */ }
})();
