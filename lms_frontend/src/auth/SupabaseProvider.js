import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createApiClient } from '../api/client';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/**
 * Supabase client initialization from environment variables.
 * Requires:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_ANON_KEY
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnon = process.env.REACT_APP_SUPABASE_ANON_KEY;
export const supabase = supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null;

/**
 * Fetches role and onboarding flag for current user.
 * This implementation first tries a backend endpoint if configured,
 * otherwise falls back to Supabase public 'profiles' table.
 */
async function fetchUserProfile(getToken) {
  const token = await getToken();
  const api = createApiClient(async () => token);

  // Try backend endpoint if REACT_APP_API_BASE_URL is set
  const hasBackend = !!process.env.REACT_APP_API_BASE_URL;
  if (hasBackend) {
    try {
      const me = await api.get('/me');
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
  if (!supabase) return { role: 'employee', onboarding_complete: false, profile: {} };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { role: null, onboarding_complete: false, profile: {} };

  const { data, error } = await supabase
    .from('profiles')
    .select('role,onboarding_complete,full_name,department')
    .eq('id', user.id)
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
    if (!supabase) {
      // eslint-disable-next-line no-console
      console.warn('Supabase not configured. Provide REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }
    const init = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        const info = await fetchUserProfile(async () => s?.access_token || null);
        setRole(info.role);
        setOnboardingComplete(!!info.onboarding_complete);
        setProfile(info.profile || {});
      }
      setLoading(false);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
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

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const getToken = async () => {
    if (!supabase) return null;
    const { data: { session: s } } = await supabase.auth.getSession();
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
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    // PUBLIC_INTERFACE
    signOut: async () => {
      if (!supabase) return;
      await supabase.auth.signOut();
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
        if (supabase && session?.user) {
          await supabase.from('profiles').upsert({
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
