(function () {
  // Merge runtime values into window.__ENV__ without exposing secrets in logs.
  var existing = (typeof window !== 'undefined' && (window.__ENV__ || window._env_)) || {};
  var next = Object.assign({}, existing, {
    // Set/override values here for your environment (examples below)
    // REACT_APP_SUPABASE_URL: "https://your-project.supabase.co",
    // REACT_APP_SUPABASE_ANON_KEY: "<anon key>",
    // REACT_APP_API_BASE_URL: "http://localhost:3011"
  });

  // Write to both __ENV__ and _env_ for compatibility
  window.__ENV__ = next;
  window._env_ = next;

  try {
    // eslint-disable-next-line no-console
    console.log('[env.js] loaded', {
      REACT_APP_SUPABASE_URL: Boolean(next.REACT_APP_SUPABASE_URL),
      REACT_APP_SUPABASE_ANON_KEY: Boolean(next.REACT_APP_SUPABASE_ANON_KEY),
      REACT_APP_API_BASE_URL: Boolean(next.REACT_APP_API_BASE_URL),
      note: 'presence booleans only; values are masked'
    });
  } catch (_) { /* noop */ }
})();
