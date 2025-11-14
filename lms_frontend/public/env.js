(function () {
  /**
   * Runtime env overrides. This file is loaded by public/index.html prior to the bundle.
   * It sets window.__ENV__ as requested and mirrors values into window._env_ that the app reads.
   * Update values below or leave empty strings to rely on .env build-time variables.
   */
  var env = {
    REACT_APP_SUPABASE_URL: "",
    REACT_APP_SUPABASE_ANON_KEY: "",
    REACT_APP_API_BASE_URL: ""
  };

  // Expose as __ENV__ (per requirement)
  window.__ENV__ = Object.assign({}, window.__ENV__ || {}, env);

  // Also expose as _env_ to keep compatibility with the existing env reader
  window._env_ = Object.assign({}, window._env_ || {}, env);

  try {
    // eslint-disable-next-line no-console
    console.log("[env.js] loaded", {
      REACT_APP_SUPABASE_URL: Boolean(env.REACT_APP_SUPABASE_URL),
      REACT_APP_SUPABASE_ANON_KEY: Boolean(env.REACT_APP_SUPABASE_ANON_KEY),
      REACT_APP_API_BASE_URL: Boolean(env.REACT_APP_API_BASE_URL)
    });
  } catch (e) {
    /* noop */
  }
})();
