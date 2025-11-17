import React, { createContext, useContext, useMemo } from 'react';
import { createApiClient } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * AppContext
 * Lightweight context for no-auth mode. Provides a tokenless API client and
 * neutral role/profile values for components that previously depended on auth.
 */
export const AppContext = createContext(null);

// PUBLIC_INTERFACE
export function AppProvider({ children }) {
  /**
   * In no-auth mode:
   * - role: null
   * - profile: {}
   * - session: null
   * - api: client without Authorization headers
   * - signOut/signIn: no-ops
   */
  const api = useMemo(() => createApiClient(), []);
  const value = useMemo(
    () => ({
      session: null,
      role: null,
      onboardingComplete: true,
      profile: {},
      loading: false,
      api,
      // PUBLIC_INTERFACE
      signIn: async () => {
        throw new Error('Authentication is disabled in this deployment.');
      },
      // PUBLIC_INTERFACE
      signOut: async () => {
        // no-op
      },
      // PUBLIC_INTERFACE
      refreshProfile: async () => {
        // no-op
      },
      // PUBLIC_INTERFACE
      completeOnboarding: async () => {
        // no-op
      },
    }),
    [api]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAppContext() {
  /** Access the app context safely. */
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
