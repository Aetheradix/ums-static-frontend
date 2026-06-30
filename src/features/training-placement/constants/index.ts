export const PLACEMENT_SEASON_STATUS = ['Active', 'Inactive'] as const;

export const COMPANY_VERIFICATION_STATUS = [
  'Pending',
  'Approved',
  'Rejected',
] as const;

export const COMPANY_SEASON_STATUS = ['Saved', 'Applied'] as const;

export const PAYMENT_STATUS = [
  'Not Applicable',
  'Pending',
  'Paid',
  'Failed',
] as const;

export const OPPORTUNITY_TYPE = ['Internship', 'Placement'] as const;

export const OPPORTUNITY_NATURE = ['Full time', 'Part-Time'] as const;

export const PROCESS_TYPE = ['On-Campus', 'Off-Campus'] as const;

export const OPPORTUNITY_STATUS = [
  'Draft',
  'Active',
  'Closed',
  'Inactive',
] as const;

export const HIRING_STATUS = [
  'Applied',
  'Shortlisted',
  'Written Test Scheduled',
  'GD Scheduled',
  'Interview Scheduled',
  'Selected',
  'Rejected',
  'On Hold',
  'Withdrawn',
] as const;

export const EXPERIENCE_OPTIONS = [
  'Fresher',
  '0-1 years',
  '1-2 years',
  '2-5 years',
  '5+ years',
] as const;

export const STUDENT_CATEGORY = [
  'General',
  'OBC',
  'SC',
  'ST',
  'EWS',
  'PwD',
] as const;

export const GENDER_OPTIONS = ['Male', 'Female', 'Transgender'] as const;

export function seasonStatusVariant(
  status: string
): 'approved' | 'neutral' | 'pending' {
  return status === 'Active' ? 'approved' : 'neutral';
}

export function verificationStatusVariant(
  status: string
): 'approved' | 'neutral' | 'pending' | 'rejected' {
  if (status === 'Approved') return 'approved';
  if (status === 'Pending') return 'pending';
  if (status === 'Rejected') return 'rejected';
  return 'neutral';
}
