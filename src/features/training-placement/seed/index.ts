export { seedOrganizationalUnits, seedProgrammes } from './lookups';
export { seedPlacementSeasons } from './seasons';
export { seedCompanies } from './companies';
export {
  seedCompanySeasons,
  seedOpportunities,
  seedStudents,
  seedApplications,
} from './entities';

import { seedOrganizationalUnits, seedProgrammes } from './lookups';
import { seedPlacementSeasons } from './seasons';
import { seedCompanies } from './companies';
import {
  seedCompanySeasons,
  seedOpportunities,
  seedStudents,
  seedApplications,
} from './entities';

export function getInitialSeedData() {
  return {
    organizationalUnits: structuredClone(seedOrganizationalUnits),
    programmes: structuredClone(seedProgrammes),
    seasons: structuredClone(seedPlacementSeasons),
    companies: structuredClone(seedCompanies),
    companySeasons: structuredClone(seedCompanySeasons),
    opportunities: structuredClone(seedOpportunities),
    students: structuredClone(seedStudents),
    applications: structuredClone(seedApplications),
  };
}

export type TpSeedData = ReturnType<typeof getInitialSeedData>;
