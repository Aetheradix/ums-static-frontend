// URL builders for the DAVV CMS. DAVV is a top-level tenant namespace (NOT nested under
// /octagon-cms). The institution type is an explicit path segment so it can scope access.
//
//   /davv                          → DAVV CMS landing
//   /davv/campuses                 → campus & institution directory
//   /davv/:type/:institution       → institution-scoped login  (e.g. /davv/utd/iet)

import type { InstitutionType } from './davvData';

const root = '/davv-cms';

export const davvUrls = {
  root,
  landing: root,
  directory: `${root}/campuses`,
  institution: (type: InstitutionType | string, slug: string) =>
    `${root}/${type}/${slug}`,
  // The Octagon-side entry point that lists universities (stays under the Octagon namespace).
  selectUniversity: '/octagon-cms/universities',
};
