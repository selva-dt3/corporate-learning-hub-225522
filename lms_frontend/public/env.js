(function () {
  // PUBLIC_INTERFACE
  /**
   * window._env_ is used to override CRA build-time env at runtime without rebuild.
   * Only booleans for presence should be logged by the app; do not print values.
   * After editing this file, hard refresh the browser.
   */
  try {
    var existing = (typeof window !== 'undefined' && window._env_) || {};
    // Define EXACT keys expected by the app
    var injected = {
      REACT_APP_SUPABASE_URL: existing.REACT_APP_SUPABASE_URL || "",
      REACT_APP_SUPABASE_ANON_KEY: existing.REACT_APP_SUPABASE_ANON_KEY || "",
      REACT_APP_API_BASE_URL: existing.REACT_APP_API_BASE_URL || ""
    };
    window._env_ = injected;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[env.js] failed to initialize window._env_:", e && e.message);
  }
})();
