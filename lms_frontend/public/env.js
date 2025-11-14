(function () {
  // Merge-friendly initialization
  var existing = (typeof window !== 'undefined' && (window.__ENV__ || window._env_)) || {};
  var overrides = {
    REACT_APP_SUPABASE_URL: "https://zladwgqmjudpsnhaunct.supabase.co",
    REACT_APP_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIs...",
    REACT_APP_API_BASE_URL: "https://vscode-internal-12349-beta.beta01.cloud.kavia.ai:3001" // replace as needed
  };

  // Define window.__ENV__ (primary) and mirror to window._env_ (compat)
  window.__ENV__ = Object.assign({}, existing, overrides);
  window._env_ = window.__ENV__;

  try {
    // eslint-disable-next-line no-console
    console.info('[env.js] runtime config loaded', {
      REACT_APP_SUPABASE_URL: Boolean(window.__ENV__.REACT_APP_SUPABASE_URL),
      REACT_APP_SUPABASE_ANON_KEY: Boolean(window.__ENV__.REACT_APP_SUPABASE_ANON_KEY),
      REACT_APP_API_BASE_URL: Boolean(window.__ENV__.REACT_APP_API_BASE_URL)
    });
  } catch (_) { /* noop */ }
})();
