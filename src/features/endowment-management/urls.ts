const BASE_PATH = '/endowment-management';

export const endowmentUrls = {
  portal: () => BASE_PATH,
  admin: {
    dashboard: () => `${BASE_PATH}/admin/dashboard`,
    donors: () => `${BASE_PATH}/admin/donors`,
    donations: () => `${BASE_PATH}/admin/donations`,
    funds: () => `${BASE_PATH}/admin/funds`,
    schemes: () => `${BASE_PATH}/admin/schemes`,
    selection: () => `${BASE_PATH}/admin/selection`,
    disbursement: () => `${BASE_PATH}/admin/disbursement`,
    reports: {
      fundUtilization: () => `${BASE_PATH}/admin/reports/fund-utilization`,
      donorAcknowledgement: () =>
        `${BASE_PATH}/admin/reports/donor-acknowledgement`,
      schemePerformance: () => `${BASE_PATH}/admin/reports/scheme-performance`,
    },
  },
  master: {
    dashboard: () => `${BASE_PATH}/master`,
    types: () => `${BASE_PATH}/master/types`,
  },
  student: {
    portal: () => `${BASE_PATH}/student`,
    dashboard: () => `${BASE_PATH}/student/dashboard`,
    browseSchemes: () => `${BASE_PATH}/student/schemes`,
    myApplications: () => `${BASE_PATH}/student/applications`,
    myAwards: () => `${BASE_PATH}/student/awards`,
  },
};
