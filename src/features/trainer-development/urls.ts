// ─── TDM URL Constants ────────────────────────────────────────────────────────

export const tdmUrls = {
  portal: '/trainer-development',

  admin: {
    portal: '/trainer-development/admin',
    dashboard: '/trainer-development/admin/dashboard',
    // Masters
    trainingCategory: '/trainer-development/admin/masters/training-category',
    trainingMode: '/trainer-development/admin/masters/training-mode',
    competencyMaster: '/trainer-development/admin/masters/competency',
    certificationMaster: '/trainer-development/admin/masters/certification',
    venueMaster: '/trainer-development/admin/masters/venue',
    // Operations
    trainerRegistration: '/trainer-development/admin/trainer-registration',
    competencyMapping: '/trainer-development/admin/competency-mapping',
    trainingPlanning: '/trainer-development/admin/training-planning',
    trainingScheduling: '/trainer-development/admin/training-scheduling',
    trainingCalendar: '/trainer-development/admin/training-calendar',
    trainingSessions: '/trainer-development/admin/training-sessions',
    attendance: '/trainer-development/admin/attendance',
    assessment: '/trainer-development/admin/assessment',
    feedback: '/trainer-development/admin/feedback',
    performance: '/trainer-development/admin/performance',
    certificates: '/trainer-development/admin/certificates',
    approvalWorkflow: '/trainer-development/admin/approval-workflow',
    reports: '/trainer-development/admin/reports',
    settings: '/trainer-development/admin/settings',
  },

  faculty: {
    portal: '/trainer-development/faculty',
    dashboard: '/trainer-development/faculty/dashboard',
    myTrainings: '/trainer-development/faculty/my-trainings',
    applyTraining: '/trainer-development/faculty/apply-training',
    myCertificates: '/trainer-development/faculty/my-certificates',
    competencies: '/trainer-development/faculty/competencies',
    selfAssessment: '/trainer-development/faculty/self-assessment',
    attendance: '/trainer-development/faculty/attendance',
    feedback: '/trainer-development/faculty/feedback',
    profile: '/trainer-development/faculty/profile',
  },

  external: {
    portal: '/trainer-development/external',
    dashboard: '/trainer-development/external/dashboard',
    assignedTrainings: '/trainer-development/external/assigned-trainings',
    schedule: '/trainer-development/external/schedule',
    attendance: '/trainer-development/external/attendance',
    materials: '/trainer-development/external/materials',
    feedbackView: '/trainer-development/external/feedback',
    honorarium: '/trainer-development/external/honorarium',
  },
};
