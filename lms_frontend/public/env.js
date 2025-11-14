(function () {
  // PUBLIC_INTERFACE
  // Runtime environment injection. Edit these values to override without rebuild.
  // The app reads window._env_ first, then falls back to process.env.
  window._env_ = Object.assign({}, window._env_ || {}, {
    // Example values; replace with your environment-specific values.
    // REACT_APP_SUPABASE_URL: "https://your-project.supabase.co",
    // REACT_APP_SUPABASE_ANON_KEY: "your-anon-key",
    // REACT_APP_API_BASE_URL: "http://localhost:3011"
  });
})();
