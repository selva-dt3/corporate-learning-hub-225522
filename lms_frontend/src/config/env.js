//
// Centralized environment variable reader for runtime and build-time values.
//
/**
 * fromEnv reads a key from the browser runtime window._env_ override first,
 * then from process.env, then from the REACT_APP_ prefixed variant.
 * Example: fromEnv('REACT_APP_SUPABASE_URL') or fromEnv('SUPABASE_URL')
 *
 * This allows Netlify-like runtime injection via window._env_.
 */
// PUBLIC_INTERFACE
export function fromEnv(key) {
  /** Read env with runtime override support. */
  const k = String(key || '').trim();
  if (!k) return undefined;
  const w = typeof window !== 'undefined' ? window : undefined;

  // Prefer explicitly passed key
  let val =
    (w && w._env_ && w._env_[k]) ??
    process.env[k] ??
    // Also support calls that pass bare key (e.g., SUPABASE_URL) by checking REACT_APP_ prefix
    process.env[`REACT_APP_${k}`];

  return val;
}

// PUBLIC_INTERFACE
export function getBooleanEnv(key, defaultValue = false) {
  /** Read boolean-like environment variable. */
  const raw = fromEnv(key);
  if (raw == null) return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(String(raw).toLowerCase());
}

// PUBLIC_INTERFACE
export function getStringEnv(key, defaultValue = '') {
  /** Read string environment variable or provide default. */
  const raw = fromEnv(key);
  if (raw == null || String(raw).length === 0) return defaultValue;
  return String(raw);
}
