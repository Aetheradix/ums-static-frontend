import type { BreadcrumbItem } from 'shared/new-components/Breadcrumb';
import type { PortalRole } from '../context/HmsContext';
import { hmsUrls } from '../urls';

const PORTALS: Record<PortalRole, { label: string; path: string }> = {
  admin: { label: 'Hostel Admin', path: hmsUrls.admin.root },
  warden: { label: 'Hostel Warden', path: hmsUrls.warden.root },
  student: { label: 'Student Portal', path: hmsUrls.student.root },
};

/**
 * Home › Hostel Management System › <portal> › <page> — the trail every page
 * in this module renders. The portal crumb resolves from `useHmsRole()`, so
 * a page shared between roles always points back where the user came from.
 */
export const hmsBreadcrumbs = (
  portal: PortalRole | null,
  label: string
): BreadcrumbItem[] => [
  { label: 'Home', to: '/home' },
  { label: 'Hostel Management System', to: hmsUrls.root },
  ...(portal
    ? [{ label: PORTALS[portal].label, to: PORTALS[portal].path }]
    : []),
  { label },
];
