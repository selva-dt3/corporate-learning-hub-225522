import { getStringEnv } from '../config/env';

/**
 * PUBLIC_INTERFACE
 * createApiClient
 * Create a minimal fetch-based API client that injects the Supabase access token.
 * Adds robust JSON/text parsing, friendly error messages, and includes credentials for CORS cookies compatibility.
 */
export function createApiClient(getTokenFn) {
  /** Create a minimal fetch-based API client that injects the Supabase access token.
   * @param {() => Promise<string|null>} getTokenFn - async function returning the current access token
   * @returns {{get:Function, post:Function, put:Function, del:Function}}
   */
  const baseURL =
    getStringEnv('REACT_APP_API_BASE_URL') ||
    getStringEnv('API_BASE_URL', '');

  if (!baseURL) {
    // Not throwing to support local dev without backend yet
    try {
      // eslint-disable-next-line no-console
      console.warn(
        'API base URL is not set. Set REACT_APP_API_BASE_URL (or window._env_.REACT_APP_API_BASE_URL). API calls will use relative paths.'
      );
    } catch { /* noop */ }
  }

  const buildHeaders = async (extra = {}) => {
    const token = await getTokenFn?.();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    };
  };

  const parseBody = async (resp) => {
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        return await resp.json();
      } catch {
        // fall through to text parse
      }
    }
    const txt = await resp.text();
    try {
      return txt ? JSON.parse(txt) : null;
    } catch {
      return txt || null;
    }
  };

  const handle = async (resp) => {
    const data = await parseBody(resp);
    if (!resp.ok) {
      const msg =
        (data && (data.message || data.error || data.detail)) ||
        (resp.status === 401 ? 'Unauthorized' : 'API Error');
      const error = new Error(String(msg));
      error.status = resp.status;
      error.data = data;
      throw error;
    }
    return data;
  };

  const url = (path) => {
    if (/^https?:\/\//.test(path)) return path;
    const base = baseURL || '';
    if (!base) {
      // No base means use relative path to current origin
      return `/${path.replace(/^\//, '')}`;
    }
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  // PUBLIC_INTERFACE
  const get = async (path) => {
    const headers = await buildHeaders();
    const resp = await fetch(url(path), { method: 'GET', headers, credentials: 'include' });
    return handle(resp);
  };
  // PUBLIC_INTERFACE
  const post = async (path, body) => {
    const headers = await buildHeaders();
    const resp = await fetch(url(path), {
      method: 'POST',
      headers,
      body: JSON.stringify(body ?? {}),
      credentials: 'include'
    });
    return handle(resp);
  };
  // PUBLIC_INTERFACE
  const put = async (path, body) => {
    const headers = await buildHeaders();
    const resp = await fetch(url(path), {
      method: 'PUT',
      headers,
      body: JSON.stringify(body ?? {}),
      credentials: 'include'
    });
    return handle(resp);
  };
  // PUBLIC_INTERFACE
  const del = async (path) => {
    const headers = await buildHeaders();
    const resp = await fetch(url(path), { method: 'DELETE', headers, credentials: 'include' });
    return handle(resp);
  };

  return { get, post, put, del };
}
