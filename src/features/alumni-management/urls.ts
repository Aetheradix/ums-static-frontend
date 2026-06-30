const baseUrl = '/alumni-management';

export const alumniUrls = {
  root: baseUrl,
  admin: {
    portal: `${baseUrl}/portal-admin`,
    dashboard: `${baseUrl}/admin/dashboard`,
    registrationManagement: {
      dashboard: `${baseUrl}/admin/registration-management`,
    },
    verifiedAlumni: `${baseUrl}/admin/verified-alumni`,
    addAlumni: `${baseUrl}/admin/add-alumni`,
    importAlumni: `${baseUrl}/admin/import-alumni`,
    communication: {
      emailCampaigns: `${baseUrl}/admin/communication/email-campaigns`,
      emailTemplates: `${baseUrl}/admin/communication/email-templates`,
      notificationHistory: `${baseUrl}/admin/communication/notification-history`,
      accountActivationEmails: `${baseUrl}/admin/communication/account-activation-emails`,
    },
    reports: `${baseUrl}/admin/reports`,
    settings: {
      ouMapping: `${baseUrl}/admin/settings/ou-mapping`,
      contributionAreas: `${baseUrl}/admin/settings/contribution-areas`,
      registrationRules: `${baseUrl}/admin/settings/registration-rules`,
      mailTemplates: `${baseUrl}/admin/settings/mail-templates`,
      additionalFieldsBuilder: `${baseUrl}/admin/settings/additional-fields-builder`,
      privacyRules: `${baseUrl}/admin/settings/privacy-rules`,
    },
    auditLogs: `${baseUrl}/admin/audit-logs`,
  },
  user: {
    portal: `${baseUrl}/portal-user`,
    dashboard: `${baseUrl}/user/dashboard`,
    myProfile: `${baseUrl}/user/my-profile`,
    qualifications: `${baseUrl}/user/qualifications`,
    experience: `${baseUrl}/user/experience`,
    contributionPreferences: `${baseUrl}/user/contribution-preferences`,
    privacySettings: `${baseUrl}/user/privacy-settings`,
  },
};
