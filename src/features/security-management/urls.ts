export const smsUrls = {
  portal: '/security-management',

  superAdmin: {
    portal: '/security-management/super-admin',
    dashboard: '/security-management/super-admin/dashboard',
    // Masters
    incidentCategory:
      '/security-management/super-admin/masters/incident-category',
    incidentType: '/security-management/super-admin/masters/incident-type',
    priority: '/security-management/super-admin/masters/priority',
    severity: '/security-management/super-admin/masters/severity',
    status: '/security-management/super-admin/masters/status',
    building: '/security-management/super-admin/masters/building',
    location: '/security-management/super-admin/masters/location',
    departmentMapping:
      '/security-management/super-admin/masters/department-mapping',
    emergencyContactType:
      '/security-management/super-admin/masters/emergency-contact-type',
    // Operations
    helpline: '/security-management/super-admin/helpline',
    guidelines: '/security-management/super-admin/guidelines',
    awareness: '/security-management/super-admin/awareness',
    incidents: '/security-management/super-admin/incidents',
    reports: '/security-management/super-admin/reports',
    settings: '/security-management/super-admin/settings',
  },

  securityAdmin: {
    portal: '/security-management/security-admin',
    dashboard: '/security-management/security-admin/dashboard',
    incidents: '/security-management/security-admin/incidents',
    helpline: '/security-management/security-admin/helpline',
    guidelines: '/security-management/security-admin/guidelines',
    awareness: '/security-management/security-admin/awareness',
    reports: '/security-management/security-admin/reports',
  },

  officer: {
    portal: '/security-management/officer',
    dashboard: '/security-management/officer/dashboard',
    assignedIncidents: '/security-management/officer/assigned-incidents',
  },

  employee: {
    portal: '/security-management/employee',
    dashboard: '/security-management/employee/dashboard',
    reportIncident: '/security-management/employee/report-incident',
    myIncidents: '/security-management/employee/my-incidents',
    helplines: '/security-management/employee/helplines',
    guidelines: '/security-management/employee/guidelines',
    awareness: '/security-management/employee/awareness',
  },

  student: {
    portal: '/security-management/student',
    dashboard: '/security-management/student/dashboard',
    reportIncident: '/security-management/student/report-incident',
    myIncidents: '/security-management/student/my-incidents',
    helplines: '/security-management/student/helplines',
    guidelines: '/security-management/student/guidelines',
    awareness: '/security-management/student/awareness',
  },
};
