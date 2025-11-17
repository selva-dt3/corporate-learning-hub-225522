import { useAppContext } from './AppProvider';

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Backward-compatible hook name that now proxies to the no-auth AppProvider.
 */
export function useAuth() {
  /** Accessor hook for app context in no-auth mode. */
  return useAppContext();
}
