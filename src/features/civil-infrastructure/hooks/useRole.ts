import { useLocation } from 'react-router-dom';
import { CIVIL_ROLES, type CivilRole, roleFromPath } from '../constants/roles';

/**
 * Returns the civil role portal the user is currently in, derived from the URL.
 *
 * RBAC is inert app-wide, so this is a UI-context signal (which portal / which
 * breadcrumb / which actions to surface), not an access control.
 */
export function useRole(): {
  role: CivilRole | null;
  roleMeta: (typeof CIVIL_ROLES)[CivilRole] | null;
  isAdmin: boolean;
  isEngineer: boolean;
  isFinance: boolean;
  isVendor: boolean;
} {
  const { pathname } = useLocation();
  const role = roleFromPath(pathname);
  return {
    role,
    roleMeta: role ? CIVIL_ROLES[role] : null,
    isAdmin: role === 'admin',
    isEngineer: role === 'engineer',
    isFinance: role === 'finance',
    isVendor: role === 'vendor',
  };
}
