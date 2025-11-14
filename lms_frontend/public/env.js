;(function () {
  /**
   * Runtime environment overrides.
   * This file is loaded by public/index.html BEFORE the main bundle so window._env_ is available.
   * Values here take precedence over .env build-time values.
   *
   * DO NOT put secrets in this repo. For local/dev, you can edit this file temporarily.
   * For deployments, this file should be generated at deploy time with the environment values.
   *
   * Required keys for Supabase auth:
   * - REACT_APP_SUPABASE_URL
   * - REACT_APP_SUPABASE_ANON_KEY
   *
   * Optional:
   * - REACT_APP_API_BASE_URL
   */
  var current = (typeof window !== 'undefined' && window._env_) || {};
  var injected = {
    // Example placeholders. Replace at runtime/deploy:
    // REACT_APP_SUPABASE_URL: "https://your-project.supabase.co",
    // REACT_APP_SUPABASE_ANON_KEY: "<anon-key>",
    // REACT_APP_API_BASE_URL: "http://localhost:3011"
  };

  // Merge preserving any pre-existing values
  var next = Object.assign({}, current, injected);
  window._env_ = next;

  // Minimal masked diagnostic to confirm presence without leaking secrets
  try {
    // eslint-disable-next-line no-console
    console.info('[env.js] loaded', {
      REACT_APP_SUPABASE_URL: Boolean(next.REACT_APP_SUPABASE_URL),
      REACT_APP_SUPABASE_ANON_KEY: Boolean(next.REACT_APP_SUPABASE_ANON_KEY),
      REACT_APP_API_BASE_URL: Boolean(next.REACT_APP_API_BASE_URL),
    });
  } catch (_) { /* noop */ }
})();
