// ============================================================
//  Legal Case Management Module — URL Constants
// ============================================================

export const legalUrls = {
  portal: '/legal-case-management',

  admin: {
    portal: '/legal-case-management/admin',
    dashboard: '/legal-case-management/admin/dashboard',
    cases: '/legal-case-management/admin/cases',
    caseNew: '/legal-case-management/admin/cases/new',
    caseEdit: (id: number | string) =>
      `/legal-case-management/admin/cases/${id}/edit`,
    caseDetail: (id: number | string) =>
      `/legal-case-management/admin/cases/${id}`,
    hearings: '/legal-case-management/admin/hearings',
    payments: '/legal-case-management/admin/payments',
    reports: '/legal-case-management/admin/reports',
  },

  dataEntry: {
    portal: '/legal-case-management/data-entry',
    dashboard: '/legal-case-management/data-entry/dashboard',
    cases: '/legal-case-management/data-entry/cases',
    caseNew: '/legal-case-management/data-entry/cases/new',
    hearings: '/legal-case-management/data-entry/hearings',
  },

  viewer: {
    portal: '/legal-case-management/viewer',
    dashboard: '/legal-case-management/viewer/dashboard',
    cases: '/legal-case-management/viewer/cases',
    reports: '/legal-case-management/viewer/reports',
  },
};
