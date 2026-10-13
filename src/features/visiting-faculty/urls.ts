// ============================================================
//  Visiting Faculty Module — URL Constants
// ============================================================

const root = '/visiting-faculty';

export const vfUrls = {
  portal: '/home/sub-menu/visiting-faculty',

  /** Public — outside the signed-in layout. */
  public: {
    register: '/visiting-faculty-registration',
    track: '/visiting-faculty-registration/track',
  },

  department: {
    portal: '/home/sub-menu/vf-department-login',
    dashboard: `${root}/department/dashboard`,
    applications: `${root}/department/applications`,
    scrutiny: `${root}/department/scrutiny`,
    meritList: `${root}/department/merit-list`,
    faculty: `${root}/department/faculty`,
    attendance: `${root}/department/attendance`,
    bills: `${root}/department/bills`,
    reports: `${root}/department/reports`,
  },

  headOffice: {
    portal: '/home/sub-menu/vf-head-office-login',
    dashboard: `${root}/head-office/dashboard`,
    approvals: `${root}/head-office/approvals`,
    register: `${root}/head-office/faculty-register`,
    reports: `${root}/head-office/reports`,
  },

  finance: {
    portal: '/home/sub-menu/vf-finance-login',
    dashboard: `${root}/finance/dashboard`,
    bills: `${root}/finance/bills`,
    ledger: `${root}/finance/ledger`,
    rates: `${root}/finance/rate-master`,
    reports: `${root}/finance/reports`,
  },

  mobile: {
    portal: '/home/sub-menu/vf-mobile-app',
    app: `${root}/mobile/app`,
  },
};
