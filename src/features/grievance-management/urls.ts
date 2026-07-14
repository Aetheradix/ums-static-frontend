// ============================================================
//  University ERP — Grievance Management System
//  URL Constants — Universal Routing Layer
// ============================================================

export const grvUrls = {
  portal: '/grievance-management',

  student: {
    portal: '/grievance-management/student',
    dashboard: '/grievance-management/student/dashboard',
    raise: '/grievance-management/student/raise-grievance',
    myGrievances: '/grievance-management/student/my-grievances',
    track: '/grievance-management/student/track',
    downloads: '/grievance-management/student/downloads',
    details: '/grievance-management/student/complaint-details',
    communication: '/grievance-management/student/communication',
    appeal: '/grievance-management/student/appeal',
    history: '/grievance-management/student/history',
  },

  teacher: {
    portal: '/grievance-management/teacher',
    dashboard: '/grievance-management/teacher/dashboard',
    raise: '/grievance-management/teacher/raise-grievance',
    myGrievances: '/grievance-management/teacher/my-grievances',
    track: '/grievance-management/teacher/track',
    downloads: '/grievance-management/teacher/downloads',
    details: '/grievance-management/teacher/complaint-details',
    communication: '/grievance-management/teacher/communication',
    appeal: '/grievance-management/teacher/appeal',
    history: '/grievance-management/teacher/history',
  },

  department: {
    portal: '/grievance-management/department',
    dashboard: '/grievance-management/department/dashboard',
    inbox: '/grievance-management/department/inbox',
    details: '/grievance-management/department/complaint-details',
    notesheet: '/grievance-management/department/notesheet',
    reports: '/grievance-management/department/reports',
  },

  departmentOfficer: {
    portal: '/grievance-management/department-officer',
    dashboard: '/grievance-management/department-officer/dashboard',
    inbox: '/grievance-management/department-officer/inbox',
    details: '/grievance-management/department-officer/complaint-details',
  },

  hod: {
    portal: '/grievance-management/hod',
    dashboard: '/grievance-management/hod/dashboard',
    pending: '/grievance-management/hod/pending-complaints',
    review: '/grievance-management/hod/complaint-review',
  },

  cell: {
    portal: '/grievance-management/grievance-cell',
    dashboard: '/grievance-management/grievance-cell/dashboard',
    management: '/grievance-management/grievance-cell/complaint-management',
    assignment: '/grievance-management/grievance-cell/assignment',
    sla: '/grievance-management/grievance-cell/sla-monitoring',
    committees: '/grievance-management/grievance-cell/committees',
    committee: '/grievance-management/grievance-cell/committee-review',
    reports: '/grievance-management/grievance-cell/reports',
  },

  authority: {
    portal: '/grievance-management/authority',
    dashboard: '/grievance-management/authority/dashboard',
    approvals: '/grievance-management/authority/pending-approvals',
    appeals: '/grievance-management/authority/appeal-management',
    history: '/grievance-management/authority/decision-history',
  },

  registrar: {
    portal: '/grievance-management/registrar',
    dashboard: '/grievance-management/registrar/dashboard',
    pending: '/grievance-management/registrar/pending-decisions',
    decision: '/grievance-management/registrar/final-decision',
    pendingDecisions: '/grievance-management/registrar/pending-decisions',
    finalDecision: '/grievance-management/registrar/final-decision',
  },

  admin: {
    portal: '/grievance-management/admin',
    dashboard: '/grievance-management/admin/dashboard',
    categories: '/grievance-management/admin/category-master',
    departments: '/grievance-management/admin/department-mapping',
    workflow: '/grievance-management/admin/workflow',
    escalation: '/grievance-management/admin/workflow-escalation',
    sla: '/grievance-management/admin/sla-config',
    notifications: '/grievance-management/admin/notification-templates',
    integrations: '/grievance-management/admin/integration-dashboard',
    audit: '/grievance-management/admin/audit-logs',
    masters: '/grievance-management/admin/masters',
    users: '/grievance-management/admin/users',
    reports: '/grievance-management/admin/reports',
  },
};
