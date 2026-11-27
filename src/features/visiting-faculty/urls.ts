// ============================================================
//  Visiting Faculty Module — URL Constants
// ============================================================

const root = '/visiting-faculty';

export const vfUrls = {
  portal: '/home/sub-menu/visiting-faculty',

  /** Public — outside the signed-in layout. */
  public: {
    register: '/visiting-faculty-registration',
    newRegistration: '/visiting-faculty-registration/new',
    reapply: '/visiting-faculty-registration/re-apply',
    track: '/visiting-faculty-registration/track',
  },

  hod: {
    portal: '/home/sub-menu/vf-hod-login',
    dashboard: `${root}/hod/dashboard`,
    applications: `${root}/hod/applications`,
    scrutiny: `${root}/hod/scrutiny`,
    interview: `${root}/hod/interview`,
    meritList: `${root}/hod/merit-list`,
    faculty: `${root}/hod/faculty`,
    attendance: `${root}/hod/attendance`,
    bills: `${root}/hod/bills`,
    reports: `${root}/hod/reports`,
  },

  department: {
    portal: '/home/sub-menu/vf-department-login',
    dashboard: `${root}/department/dashboard`,
    meritReview: `${root}/department/merit-review`,
    billReview: `${root}/department/bill-review`,
    faculty: `${root}/department/faculty`,
    attendance: `${root}/department/attendance`,
    reports: `${root}/department/reports`,
  },

  headOffice: {
    portal: '/home/sub-menu/vf-head-office-login',
    dashboard: `${root}/head-office/dashboard`,
    approvals: `${root}/head-office/approvals`,
    billApproval: `${root}/head-office/bill-approval`,
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
