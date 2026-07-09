// ============================================================
//  University ERP — Grievance Management System
//  URL Constants
// ============================================================

export const grvUrls = {
  portal: '/grievance-management',

  student: {
    portal: '/grievance-management/student',
    dashboard: '/grievance-management/student/dashboard',
    raise: '/grievance-management/student/raise-grievance',
    track: '/grievance-management/student/track',
    details: '/grievance-management/student/complaint-details',
    communication: '/grievance-management/student/communication',
    appeal: '/grievance-management/student/appeal',
    history: '/grievance-management/student/history',
  },

  department: {
    portal: '/grievance-management/department',
    dashboard: '/grievance-management/department/dashboard',
    inbox: '/grievance-management/department/inbox',
    details: '/grievance-management/department/complaint-details',
    notesheet: '/grievance-management/department/notesheet',
    reports: '/grievance-management/department/reports',
  },

  cell: {
    portal: '/grievance-management/grievance-cell',
    dashboard: '/grievance-management/grievance-cell/dashboard',
    management: '/grievance-management/grievance-cell/complaint-management',
    assignment: '/grievance-management/grievance-cell/assignment',
    sla: '/grievance-management/grievance-cell/sla-monitoring',
    committees: '/grievance-management/grievance-cell/committees',
    reports: '/grievance-management/grievance-cell/reports',
  },

  authority: {
    portal: '/grievance-management/authority',
    dashboard: '/grievance-management/authority/dashboard',
    approvals: '/grievance-management/authority/pending-approvals',
    appeals: '/grievance-management/authority/appeal-management',
    history: '/grievance-management/authority/decision-history',
  },

  admin: {
    portal: '/grievance-management/admin',
    dashboard: '/grievance-management/admin/dashboard',
    categories: '/grievance-management/admin/category-master',
    departments: '/grievance-management/admin/department-mapping',
    workflow: '/grievance-management/admin/workflow-escalation',
    sla: '/grievance-management/admin/sla-config',
    notifications: '/grievance-management/admin/notification-templates',
    integrations: '/grievance-management/admin/integration-dashboard',
    audit: '/grievance-management/admin/audit-logs',
  },
};
