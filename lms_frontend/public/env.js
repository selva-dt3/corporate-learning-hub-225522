;(function () {
  /**
   * Runtime environment injector for the LMS frontend.
   *
   * How to use:
   * - Edit these values on your deployed site without rebuilding.
   * - This file is served from /env.js and is loaded before the app bundle.
   * - Values from window._env_ override process.env at runtime.
   *
   * Required keys:
   * - REACT_APP_SUPABASE_URL
   * - REACT_APP_SUPABASE_ANON_KEY
   * - REACT_APP_API_BASE_URL
   *
   * Safe defaults below are empty strings. Update them for your environment.
   *
   * Example production values:
   *   window._env_.REACT_APP_SUPABASE_URL = "https://zladwgqmjudpsnhaunct.supabase.co";
   *   window._env_.REACT_APP_SUPABASE_ANON_KEY = "<anon key>";
   *   window._env_.REACT_APP_API_BASE_URL = "https://vscode-internal-31347-beta.beta01.cloud.kavia.ai:3001";
   */
  window._env_ = Object.assign(
    {
      REACT_APP_SUPABASE_URL: "",
      REACT_APP_SUPABASE_ANON_KEY: "",
      REACT_APP_API_BASE_URL: ""
    },
    window._env_ || {}
  );
})();
