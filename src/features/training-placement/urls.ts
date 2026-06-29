const baseUrl = '/training-placement';

export const tpUrls = {
  root: baseUrl,
  admin: {
    portal: `${baseUrl}/admin`,
    dashboard: `${baseUrl}/admin/dashboard`,
    settings: {
      hub: `${baseUrl}/admin/settings`,
      ouMapping: `${baseUrl}/admin/settings/ou-mapping`,
      ouMappingAdd: `${baseUrl}/admin/settings/ou-mapping/add`,
      ouMappingEdit: (id: string) =>
        `${baseUrl}/admin/settings/ou-mapping/edit/${id}`,
      ouMappingView: (id: string) =>
        `${baseUrl}/admin/settings/ou-mapping/view/${id}`,
      ouCoordinators: `${baseUrl}/admin/settings/ou-coordinators`,
      moduleConfig: `${baseUrl}/admin/settings/module-config`,
      placementSeasons: `${baseUrl}/admin/settings/placement-seasons`,
      placementSeasonAdd: `${baseUrl}/admin/settings/placement-seasons/add`,
      placementSeasonEdit: (id: string) =>
        `${baseUrl}/admin/settings/placement-seasons/edit/${id}`,
    },
    companies: `${baseUrl}/admin/companies`,
    companyAdd: `${baseUrl}/admin/companies/add`,
    companyEdit: (id: string) => `${baseUrl}/admin/companies/edit/${id}`,
    companyView: (id: string) => `${baseUrl}/admin/companies/view/${id}`,
    companyVerification: `${baseUrl}/admin/companies/verification`,
    companySeasons: `${baseUrl}/admin/company-seasons`,
    applications: `${baseUrl}/admin/student-applications`,
    opportunities: `${baseUrl}/admin/opportunities`,
    opportunityAdd: `${baseUrl}/admin/opportunities/add`,
    opportunityEdit: (id: string) =>
      `${baseUrl}/admin/opportunities/edit/${id}`,
    opportunityView: (id: string) =>
      `${baseUrl}/admin/opportunities/view/${id}`,
    reports: `${baseUrl}/admin/reports`,
  },
  dept: {
    portal: `${baseUrl}/dept`,
    dashboard: `${baseUrl}/dept/dashboard`,
    opportunities: `${baseUrl}/dept/opportunities`,
    applications: `${baseUrl}/dept/student-applications`,
  },
  company: {
    portal: `${baseUrl}/company`,
    dashboard: `${baseUrl}/company/dashboard`,
    profile: `${baseUrl}/company/profile`,
    seasons: `${baseUrl}/company/seasons`,
    opportunities: `${baseUrl}/company/opportunities`,
    opportunityAdd: `${baseUrl}/company/opportunities/add`,
    opportunityEdit: (id: string) =>
      `${baseUrl}/company/opportunities/edit/${id}`,
    opportunityView: (id: string) =>
      `${baseUrl}/company/opportunities/view/${id}`,
  },
  student: {
    portal: `${baseUrl}/student`,
    dashboard: `${baseUrl}/student/dashboard`,
    registration: `${baseUrl}/student/registration`,
    availableSeasons: `${baseUrl}/student/seasons/available`,
    appliedSeasons: `${baseUrl}/student/seasons/applied`,
    jobs: `${baseUrl}/student/jobs`,
    myApplications: `${baseUrl}/student/my-applications`,
  },
  public: {
    companyRegistration: `${baseUrl}/register/company`,
  },
};
