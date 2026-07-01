export const lmsUrls = {
  portal: '/leave-management',

  admin: {
    portal: '/leave-management/admin',
    dashboard: '/leave-management/admin/dashboard',
    mastersPortal: '/leave-management/admin/masters',
    // Masters
    leaveTypes: '/leave-management/admin/masters/leave-types',
    leavePolicy: '/leave-management/admin/masters/leave-policy',
    approvalHierarchy: '/leave-management/admin/masters/approval-hierarchy',
    academicCalendar: '/leave-management/admin/masters/academic-calendar',
    // Operations
    leaveRequests: '/leave-management/admin/leave-requests',
    attendance: '/leave-management/admin/attendance',
    biometric: '/leave-management/admin/biometric',
    ltc: '/leave-management/admin/ltc',
    reports: '/leave-management/admin/reports',
    settings: '/leave-management/admin/settings',
  },

  teacher: {
    portal: '/leave-management/teacher',
    dashboard: '/leave-management/teacher/dashboard',
    applyLeave: '/leave-management/teacher/apply-leave',
    myApplications: '/leave-management/teacher/my-applications',
    studentRequests: '/leave-management/teacher/student-requests',
    attendance: '/leave-management/teacher/attendance',
    biometric: '/leave-management/teacher/biometric',
    reports: '/leave-management/teacher/reports',
  },

  student: {
    portal: '/leave-management/student',
    dashboard: '/leave-management/student/dashboard',
    applyLeave: '/leave-management/student/apply-leave',
    myLeave: '/leave-management/student/my-leave',
    attendance: '/leave-management/student/attendance',
    biometric: '/leave-management/student/biometric',
    notifications: '/leave-management/student/notifications',
  },
};
