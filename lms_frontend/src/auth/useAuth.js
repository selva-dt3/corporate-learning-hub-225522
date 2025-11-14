import { useAuthContext } from './SupabaseProvider';

// PUBLIC_INTERFACE
export function useAuth() {
  /** Accessor hook for auth context. */
  return useAuthContext();
}
