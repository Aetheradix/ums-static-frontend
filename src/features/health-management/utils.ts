import { hmsUrls } from './urls';

/**
 * Returns breadcrumb items for health-management pages.
 *
 * Pattern (following alumni-management convention):
 *   Health Services > [portal label] > [section?] > [page]
 *
 * The root "Health Services" portal page (HealthPortalPage) already handles
 * the "Home" back-link via `backPath="/home"` on <PortalSelector />.
 * So pages inside the module should NOT prepend a "Home" crumb.
 *
 * @param section   - e.g. 'Memberships', 'Health Records', 'Medical Stock'
 * @param subPage   - optional sub-page label, e.g. 'Add Membership'
 * @param portal    - optional portal label to appear between Health Services and section
 * @param portalPath - optional portal path for the link
 */
export function getHmsBreadcrumbs(
  section: string,
  subPage?: string,
  portal?: string,
  portalPath?: string
) {
  const crumbs: { label: string; to?: string }[] = [
    { label: 'Health Services', to: hmsUrls.portal },
  ];

  if (portal && portalPath) {
    crumbs.push({ label: portal, to: portalPath });
  }

  if (subPage) {
    // section is a link when there's a sub-page
    const sectionPath = getSectionPath(section);
    crumbs.push({ label: section, to: sectionPath ?? undefined });
    crumbs.push({ label: subPage });
  } else {
    crumbs.push({ label: section });
  }

  return crumbs;
}

/** Maps a section label to its list-page URL */
function getSectionPath(section: string): string | null {
  const map: Record<string, string> = {
    Memberships: hmsUrls.memberships,
    'Health Records': hmsUrls.records,
    'Medical Stock': hmsUrls.stock,
    Prescriptions: hmsUrls.prescriptions,
    Dispensary: hmsUrls.dispensary,
    Appointments: hmsUrls.appointments,
    'Guest Users': hmsUrls.guestUsers,
    Doctors: hmsUrls.doctors,
    Reports: hmsUrls.reports,
  };
  return map[section] ?? null;
}
