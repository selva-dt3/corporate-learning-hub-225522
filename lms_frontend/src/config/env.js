/**
 * Centralized environment variable reader for runtime and build-time values (CRA).
 *
 * Priority:
 *  1) window._env_[KEY]  (runtime overrides loaded from public/env.js)
 *  2) process.env[KEY]   (CRA build-time from .env)
 *
 * Notes:
 * - Do NOT use import.meta.env in CRA; it's Vite-specific and can break builds.
 * - Provide helpers plus a getEnv() snapshot and assertRequiredEnv() with one-time warning.
 */
let warnedMissingOnce = false;
let infoLoggedOnce = false;

/**
 * PUBLIC_INTERFACE
 * getEnv
 */
export function getEnv() {
  /**
   * Return a shallow snapshot of resolved env keys we care about.
   * Add more keys here as the app evolves.
   */
  const keys = [
    'REACT_APP_SUPABASE_URL',
    'REACT_APP_SUPABASE_ANON_KEY',
    'REACT_APP_API_BASE_URL',
  ];
  const w = (typeof window !== 'undefined' && window._env_) || {};
  const p = (typeof process !== 'undefined' && process.env) || {};
  const get = (k) => (w[k] ?? p[k] ?? '');

  const out = {};
  for (const k of keys) {
    out[k] = get(k) || '';
  }

  // One-time info log about presence (mask values)
  if (!infoLoggedOnce) {
    infoLoggedOnce = true;
    try {
      // eslint-disable-next-line no-console
      console.info(
        '[env] presence',
        {
          REACT_APP_SUPABASE_URL: Boolean(out.REACT_APP_SUPABASE_URL),
          REACT_APP_SUPABASE_ANON_KEY: Boolean(out.REACT_APP_SUPABASE_ANON_KEY),
          REACT_APP_API_BASE_URL: Boolean(out.REACT_APP_API_BASE_URL),
          hasWindowEnv: typeof window !== 'undefined' && !!window._env_,
        },
        '(window._env_ takes precedence over process.env)'
      );
    } catch {
      /* noop */
    }
  }

  return out;
}

/**
 * PUBLIC_INTERFACE
 * fromEnv
 */
export function fromEnv(key) {
  /** Read env value with runtime override support (CRA-safe). */
  const k = String(key || '').trim();
  if (!k) return undefined;

  const w = (typeof window !== 'undefined' && window._env_) || {};
  const p = (typeof process !== 'undefined' && process.env) || {};
  return w[k] ?? p[k];
}

/**
 * PUBLIC_INTERFACE
 * getBooleanEnv
 */
export function getBooleanEnv(key, defaultValue = false) {
  /** Read boolean-like environment variable. */
  const raw = fromEnv(key);
  if (raw == null) return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(String(raw).toLowerCase());
}

/**
 * PUBLIC_INTERFACE
 * getStringEnv
 */
export function getStringEnv(key, defaultValue = '') {
  /** Read string environment variable or provide default. */
  const raw = fromEnv(key);
  if (raw == null || String(raw).length === 0) return defaultValue;
  return String(raw);
}

/**
 * PUBLIC_INTERFACE
 * assertRequiredEnv
 */
export function assertRequiredEnv(keys = []) {
  /**
   * Ensure required keys exist; logs one consolidated warning at most once.
   */
  const missing = (Array.isArray(keys) ? keys : []).filter(
    (k) => !getStringEnv(k, '')
  );
  if (missing.length && !warnedMissingOnce) {
    warnedMissingOnce = true;
    // eslint-disable-next-line no-console
    console.warn(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        `Set them in public/env.js via window._env_ (takes precedence) or in .env and restart dev server.`
    );
  }
  return missing.length === 0;
}
