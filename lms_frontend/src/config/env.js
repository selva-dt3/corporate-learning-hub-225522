//
// Centralized environment variable reader for runtime and build-time values.
//
// - Order: window._env_ -> import.meta.env -> process.env -> REACT_APP_<key> fallback
// - Logs a single warning if required keys are missing.
// - Does not remove .env support; only adds runtime override capability.
//
let warnedMissingOnce = false;

/**
 * PUBLIC_INTERFACE
 * fromEnv
 */
export function fromEnv(key) {
  /** Read env value with runtime override support. */
  const k = String(key || '').trim();
  if (!k) return undefined;

  const w = typeof window !== 'undefined' ? window : undefined;

  // Check runtime injected env first
  const runtimeVal = w && w._env_ ? w._env_[k] : undefined;

  // Support Vite-like import.meta.env if present; guard access to avoid CRA parse errors
  let importMetaVal;
  try {
    // eslint-disable-next-line no-new-func
    const getImportMetaEnv = new Function('return (typeof importMeta!=="undefined" && importMeta.env) ? importMeta.env : (typeof import!=="undefined" && import.meta && import.meta.env ? import.meta.env : undefined);');
    const metaEnv = getImportMetaEnv();
    importMetaVal = metaEnv ? metaEnv[k] : undefined;
  } catch {
    importMetaVal = undefined;
  }

  // CRA process.env and REACT_APP_ prefixed fallback
  const processVal =
    (typeof process !== 'undefined' && process.env ? process.env[k] : undefined) ??
    (typeof process !== 'undefined' && process.env ? process.env[`REACT_APP_${k}`] : undefined);

  return runtimeVal ?? importMetaVal ?? processVal;
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
        `Set them in public/env.js via window._env_ or in .env and restart dev server.`
    );
  }
  return missing.length === 0;
}
