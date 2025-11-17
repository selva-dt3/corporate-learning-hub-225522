/**
 * Centralized environment variable reader for runtime and build-time values (CRA).
 *
 * Priority:
 *  1) window.__ENV__[KEY] / window._env_[KEY]  (runtime overrides loaded from public/env.js)
 *  2) process.env[KEY]   (CRA build-time from .env)
 *
 * Notes:
 * - Do NOT use import.meta.env in CRA; it's Vite-specific and can break builds.
 * - Provide helpers plus a getEnv() snapshot and assertRequiredEnv() with one-time warning.
 */
let warnedMissingOnce = false;
let infoLoggedOnce = false;

// Track readiness for modules that want to know if init happened
let _envReady = false;

// Internal singleton promise to ensure we fetch /env.js at most once if needed
let _envInitPromise = null;

/**
 * PUBLIC_INTERFACE
 * initEnv
 */
export function initEnv() {
  /**
   * Ensure window._env_ / window.__ENV__ is populated before application bootstrap.
   * If already present with expected keys, resolves immediately.
   * Otherwise attempts a one-time fetch of /env.js to populate it, then resolves.
   */
  if (typeof window === 'undefined') {
    // SSR/Node: nothing to do
    _envReady = true;
    return Promise.resolve();
  }

  // If we've already started an init, return it
  if (_envInitPromise) return _envInitPromise;

  // Basic predicate: do we have the expected keys?
  const hasKeys = () => {
    const w = window.__ENV__ || window._env_ || {};
    return Boolean(
      w?.REACT_APP_SUPABASE_URL ||
      w?.REACT_APP_SUPABASE_ANON_KEY ||
      w?.REACT_APP_API_BASE_URL
    );
  };

  if (hasKeys()) {
    // Mirror __ENV__ to _env_ for legacy usage
    if (window.__ENV__ && !window._env_) {
      window._env_ = window.__ENV__;
    }
    _envReady = true;
    try {
      // eslint-disable-next-line no-console
      console.info('[env:init] runtime env present', {
        REACT_APP_API_BASE_URL: Boolean((window.__ENV__ || window._env_)?.REACT_APP_API_BASE_URL),
      });
    } catch { /* noop */ }
    _envInitPromise = Promise.resolve();
    return _envInitPromise;
  }

  // One-time dynamic loader as fallback if the script didn't load yet
  _envInitPromise = new Promise((resolve) => {
    // Try to fetch env.js and eval it in global scope to populate window.__ENV__/_env_
    fetch('/env.js', { cache: 'no-store' })
      .then(async (resp) => {
        if (!resp.ok) throw new Error(`env.js HTTP ${resp.status}`);
        const scriptText = await resp.text();
        // Execute the env.js content
        // eslint-disable-next-line no-new-func
        const fn = new Function(scriptText);
        fn();
        // Ensure mirror exists
        if (window.__ENV__) {
          window._env_ = window.__ENV__;
        }
      })
      .catch((e) => {
        try {
          // eslint-disable-next-line no-console
          console.warn('[env:init] failed to fetch /env.js, falling back to process.env only:', e?.message || e);
        } catch { /* noop */ }
        // swallow - we'll fall back to process.env values only
      })
      .finally(() => {
        _envReady = true;
        try {
          const w = window.__ENV__ || window._env_ || {};
          // eslint-disable-next-line no-console
          console.info('[env:init] ready', {
            REACT_APP_API_BASE_URL: Boolean(w.REACT_APP_API_BASE_URL),
            source: w && Object.keys(w).length ? 'window.__ENV__/_env_' : 'process.env',
          });
        } catch { /* noop */ }
        resolve();
      });
  });

  return _envInitPromise;
}

/**
 * PUBLIC_INTERFACE
 * getEnv readiness
 */
export function isEnvReady() {
  /** Return true if initEnv has completed (or no-op for SSR). */
  return _envReady === true;
}

/**
 * PUBLIC_INTERFACE
 * waitForEnv
 */
export async function waitForEnv() {
  /** Await env readiness (resolves immediately if already ready). */
  if (_envReady) return;
  await initEnv();
}

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
    'REACT_APP_API_BASE_URL',
  ];
  const w = (typeof window !== 'undefined' && (window.__ENV__ || window._env_)) || {};
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
          REACT_APP_API_BASE_URL: Boolean(out.REACT_APP_API_BASE_URL),
          hasWindowEnv: typeof window !== 'undefined' && (!!window.__ENV__ || !!window._env_),
        },
        '(window.__ENV__/window._env_ takes precedence over process.env)'
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

  const w = (typeof window !== 'undefined' && (window.__ENV__ || window._env_)) || {};
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
        `Set them in public/env.js via window.__ENV__ (preferred, takes precedence) or in .env and restart dev server.`
    );
  }
  return missing.length === 0;
}
