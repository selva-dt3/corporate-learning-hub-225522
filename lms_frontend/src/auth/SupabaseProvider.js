import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createApiClient } from '../api/client';
import { getStringEnv, assertRequiredEnv, getEnv, initEnv } from '../config/env';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/**
 * Supabase client factory using v2 signature and runtime env.
 * We defer reading env until after initEnv() is complete (index.js calls initEnv before rendering).
 */
let warnedOnce = false;
let infoOnce = false;
let supabase = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /**
   * Lazily create and cache the Supabase client once env is ready.
   * Values are read via getEnv()/getStringEnv to respect runtime overrides.
   */
  if (supabase) return supabase;

  const envSnapshot = getEnv();
  const resolvedUrl = envSnapshot.REACT_APP_SUPABASE_URL || getStringEnv('REACT_APP_SUPABASE_URL', '');
  const resolvedAnon = envSnapshot.REACT_APP_SUPABASE_ANON_KEY || getStringEnv('REACT_APP_SUPABASE_ANON_KEY', '');
  const apiBase = envSnapshot.REACT_APP_API_BASE_URL || getStringEnv('REACT_APP_API_BASE_URL', '');

  if (!infoOnce) {
    infoOnce = true;
    try {
      // eslint-disable-next-line no-console
      console.info('[supabase] presence', {
        url: Boolean(resolvedUrl),
        anon_present: Boolean(resolvedAnon),
        api_present: Boolean(apiBase),
        hasWindowEnv: typeof window !== 'undefined' && !!window._env_,
      });
    } catch { /* noop */ }
  }

  if (resolvedUrl && resolvedAnon) {
    supabase = createClient(resolvedUrl, resolvedAnon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: { 'X-Client-Info': 'lms-frontend' },
      },
    });
  } else {
    supabase = null;
  }

  return supabase;
}

/**
 * Fetches role and onboarding flag for current user.
 * This implementation first tries a backend endpoint if configured,
 * otherwise falls back to Supabase public 'profiles' table.
 */
async function fetchUserProfile(getToken) {
  const token = await getToken();
  const api = createApiClient(async () => token);

  // Try backend endpoint if configured
  const hasBackend =
    !!getStringEnv('REACT_APP_API_BASE_URL') ||
    !!getStringEnv('API_BASE_URL');

  if (hasBackend) {
    try {
      const me = await api.get('/auth/profile');
      return {
        role: me?.role || 'employee',
        onboarding_complete: !!me?.onboarding_complete,
        profile: me || {},
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Falling back to Supabase profile. Reason:', e.message);
    }
  }

  // Fallback: Supabase
  const sb = getSupabaseClient();
  if (!sb) return { role: 'employee', onboarding_complete: false, profile: {} };

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { role: null, onboarding_complete: false, profile: {} };

  const { data, error } = await sb
    .from('profiles')
    .select('role,onboarding_complete,full_name,department')
    .eq('user_id', user.id)
    .single();

  if (error) {
    // eslint-disable-next-line no-console
    console.warn('profiles fetch error:', error.message);
    return { role: 'employee', onboarding_complete: false, profile: {} };
  }
  return {
    role: data?.role || 'employee',
    onboarding_complete: !!data?.onboarding_complete,
    profile: data || {},
  };
}

/**
 * SupabaseProvider wraps the application with auth/session context.
 */
// PUBLIC_INTERFACE
export function SupabaseProvider({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;

    const start = async () => {
      // Ensure env is ready (no-op if already initialized)
      await initEnv();

      // Validate required keys and log one-time diagnostics (presence only)
      assertRequiredEnv(['REACT_APP_SUPABASE_URL', 'REACT_APP_SUPABASE_ANON_KEY']);

      const sb = getSupabaseClient();
      if (!sb) {
        if (!warnedOnce) {
          warnedOnce = true;
          // eslint-disable-next-line no-console
          console.warn('Supabase not configured. Provide REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY (or runtime window._env_ overrides).');
        }
        setLoading(false);
        return;
      }

      const { data: { session: s } } = await sb.auth.getSession();
      setSession(s);
      if (s) {
        const info = await fetchUserProfile(async () => s?.access_token || null);
        setRole(info.role);
        setOnboardingComplete(!!info.onboarding_complete);
        setProfile(info.profile || {});
      }
      setLoading(false);

      const { data: listener } = sb.auth.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession);
        if (newSession) {
          const info = await fetchUserProfile(async () => newSession?.access_token || null);
          setRole(info.role);
          setOnboardingComplete(!!info.onboarding_complete);
          setProfile(info.profile || {});
        } else {
          setRole(null);
          setOnboardingComplete(false);
          setProfile({});
        }
      });

      unsubscribe = () => listener?.subscription?.unsubscribe?.();
    };

    start();

    return () => {
      unsubscribe?.();
    };
  }, []);

  const getToken = async () => {
    const sb = getSupabaseClient();
    if (!sb) return null;
    const { data: { session: s } } = await sb.auth.getSession();
    return s?.access_token || null;
  };

  const api = useMemo(() => createApiClient(getToken), []);

  const value = useMemo(() => ({
    session,
    role,
    onboardingComplete,
    profile,
    loading,
    api,
    // PUBLIC_INTERFACE
    signIn: async (email, password) => {
      const sb = getSupabaseClient();
      if (!sb) throw new Error('Supabase not configured');
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    // PUBLIC_INTERFACE
    signOut: async () => {
      const sb = getSupabaseClient();
      if (!sb) return;
      await sb.auth.signOut();
    },
    // PUBLIC_INTERFACE
    refreshProfile: async () => {
      if (!session) return;
      const info = await fetchUserProfile(getToken);
      setRole(info.role);
      setOnboardingComplete(!!info.onboarding_complete);
      setProfile(info.profile || {});
    },
    // PUBLIC_INTERFACE
    completeOnboarding: async (payload) => {
      // Attempt backend first
      try {
        await api.post('/onboarding/complete', payload);
      } catch (e) {
        // Fallback: update Supabase profile
        const sb = getSupabaseClient();
        if (sb && session?.user) {
          await sb.from('profiles').upsert({
            id: session.user.id,
            onboarding_complete: true,
            full_name: payload.full_name || null,
            department: payload.department || null,
            updated_at: new Date().toISOString(),
          });
        }
      }
      setOnboardingComplete(true);
    }
  }), [session, role, onboardingComplete, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuthContext() {
  /** Access the auth context safely. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within SupabaseProvider');
  }
  return ctx;
}
