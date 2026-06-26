export const feedbackUrls = {
  portal: '/student-feedback-management',
  admin: {
    portal: '/student-feedback-management/admin',
    dashboard: '/student-feedback-management/admin/dashboard',
    sessions: '/student-feedback-management/admin/sessions',
    questionBank: '/student-feedback-management/admin/question-bank',
    templates: '/student-feedback-management/admin/templates',
    assignments: '/student-feedback-management/admin/assignments',
    responses: '/student-feedback-management/admin/responses',
    reports: '/student-feedback-management/admin/reports',
    notifications: '/student-feedback-management/admin/notifications',
    settings: '/student-feedback-management/admin/settings',
  },
  student: {
    dashboard: '/student-feedback-management/student',
    form: '/student-feedback-management/student/form/:sessionId',
    formItem:
      '/student-feedback-management/student/form/:sessionId/:responseId',
  },
};
