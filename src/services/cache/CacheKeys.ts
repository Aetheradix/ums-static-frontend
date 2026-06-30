export const CacheKeys = {
  STUDENT_APPLICATION_DRAFT: 'student_application_draft',
  STUDENT_SUBMITTED_APPLICATIONS: 'student_submitted_applications',
  STUDENT_PROFILE: 'student_profile',
  TP_SEED_DATA: 'tp_seed_data',
} as const;

export type CacheKey = (typeof CacheKeys)[keyof typeof CacheKeys];
