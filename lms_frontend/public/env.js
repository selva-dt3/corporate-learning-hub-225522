(function () {
  // Runtime environment overrides for CRA.
  // This file is loaded before the application bundle (see public/index.html).
  // Values here take precedence over .env build-time variables.
  // To use: set/override keys on window._env_ and refresh the page (no rebuild required).

  window._env_ = Object.assign(
    {},
    window._env_ || {},
    {
      // Example placeholders (keep empty by default; fill in on deployment or local testing)
      // REACT_APP_SUPABASE_URL: "https://your-project.supabase.co",
      // REACT_APP_SUPABASE_ANON_KEY: "your-anon-key",
      // REACT_APP_API_BASE_URL: "http://localhost:3011"
    }
  );
})();
