//
// API client with Supabase JWT forwarding.
//
// PUBLIC_INTERFACE
export function createApiClient(getTokenFn) {
  /** Create a minimal fetch-based API client that injects the Supabase access token.
   * @param {() => Promise<string|null>} getTokenFn - async function returning the current access token
   * @returns {{get:Function, post:Function, put:Function, del:Function}}
   */
  const baseURL = process.env.REACT_APP_API_BASE_URL || '';
  if (!baseURL) {
    // Not throwing to support local dev without backend yet
    // eslint-disable-next-line no-console
    console.warn('REACT_APP_API_BASE_URL is not set. Set it to http://localhost:3011 for local backend. API calls will target the current origin otherwise.');
  }

  const buildHeaders = async (extra = {}) => {
    const token = await getTokenFn?.();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    };
  };

  const handle = async (resp) => {
    const text = await resp.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch {
      data = text;
    }
    if (!resp.ok) {
      const error = new Error(data?.message || 'API Error');
      error.status = resp.status;
      error.data = data;
      throw error;
    }
    return data;
  };

  const url = (path) => {
    if (/^https?:\/\//.test(path)) return path;
    const base = baseURL || '';
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  // PUBLIC_INTERFACE
  const get = async (path) => {
    const headers = await buildHeaders();
    const resp = await fetch(url(path), { method: 'GET', headers });
    return handle(resp);
  };
  // PUBLIC_INTERFACE
  const post = async (path, body) => {
    const headers = await buildHeaders();
    const resp = await fetch(url(path), { method: 'POST', headers, body: JSON.stringify(body ?? {}) });
    return handle(resp);
  };
  // PUBLIC_INTERFACE
  const put = async (path, body) => {
    const headers = await buildHeaders();
    const resp = await fetch(url(path), { method: 'PUT', headers, body: JSON.stringify(body ?? {}) });
    return handle(resp);
  };
  // PUBLIC_INTERFACE
  const del = async (path) => {
    const headers = await buildHeaders();
    const resp = await fetch(url(path), { method: 'DELETE', headers });
    return handle(resp);
  };

  return { get, post, put, del };
}
