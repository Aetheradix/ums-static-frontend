// ─── URL builder for the Grievance Management module ────────────────────────────

export const GRIEVANCE_MANAGEMENT_BASE_URL = 'grievance-management';

export const grievanceManagementUrls = (base: string) => {
  const prefix = `${base}`;
  return {
    root: prefix,
    dashboard: `${prefix}/dashboard`,
    categories: `${prefix}/categories`,
    committees: `${prefix}/committees`,
    categoryUserMapping: `${prefix}/category-user-mapping`,
    grievanceUserMapping: `${prefix}/grievance-user-mapping`,
    grievances: `${prefix}/grievances`,
    publicGrievances: `${prefix}/public-grievances`,
    reports: `${prefix}/reports`,
  };
};
