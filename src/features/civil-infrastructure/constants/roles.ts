/**
 * Role definitions for the Civil Infrastructure module.
 *
 * The module exposes four role portals (admin, engineer, finance, vendor),
 * each mounted under `/civil-infrastructure/<role>/*`. RBAC is inert app-wide
 * (hasPermission() is stubbed to return true), so these constants exist to give
 * pages a single, typed vocabulary for "which portal am I in" rather than to
 * enforce access.
 */

export type CivilRole = 'admin' | 'engineer' | 'finance' | 'vendor';

interface RoleMeta {
  key: CivilRole;
  label: string;
  /** Route segment under /civil-infrastructure. */
  segment: string;
  /** Sub-menu path (see urls.ts). */
  menuPath: string;
  icon: string;
}

export const CIVIL_ROLES: Record<CivilRole, RoleMeta> = {
  admin: {
    key: 'admin',
    label: 'Admin Login',
    segment: 'admin',
    menuPath: '/home/sub-menu/civil-admin',
    icon: 'shield',
  },
  engineer: {
    key: 'engineer',
    label: 'Site Engineer Login',
    segment: 'engineer',
    menuPath: '/home/sub-menu/civil-engineer',
    icon: 'hard-hat',
  },
  finance: {
    key: 'finance',
    label: 'Finance Login',
    segment: 'finance',
    menuPath: '/home/sub-menu/civil-finance',
    icon: 'wallet',
  },
  vendor: {
    key: 'vendor',
    label: 'Vendor Login',
    segment: 'vendor',
    menuPath: '/home/sub-menu/civil-vendor',
    icon: 'briefcase',
  },
};

/** Derives the current civil role from a route pathname, if any. */
export function roleFromPath(pathname: string): CivilRole | null {
  const match = pathname.match(
    /\/civil-infrastructure\/(admin|engineer|finance|vendor)\b/
  );
  return match ? (match[1] as CivilRole) : null;
}
