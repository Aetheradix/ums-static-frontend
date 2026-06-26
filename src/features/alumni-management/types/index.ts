export interface OrganizationUnit {
  ou_code: string;
  name: string;
  actionDetails?: string;
}

export interface AlumniProfile {
  enrolmentNo: string;
  fullName: string;
  program: string;
  yearOfPassing: number;
  ouCode: string;
  emailAddress: string;
  mobileNumber?: string;
  currentCity?: string;
  currentEmployer?: string;
  designation?: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  registeredOn?: string;
  actionDetails: string;
  isDuplicate?: boolean;
  systemFlag?: string;
  pendingReason?: string;
  rejectionReason?: string;
}

export interface ProfessionalExperience {
  company_name: string;
  designation: string;
  employment_type: string;
  start_date: string;
  end_date: string;
  location?: string;
  description?: string;
}

export interface EducationalQualification {
  level: string;
  degree: string;
  institute: string;
  year: number;
  result_type: string;
  score: string;
}

export interface ContributionPreferences {
  mentorship: boolean;
  guestLectures: boolean;
  placementAssistance: boolean;
  financialSupport: boolean;
}
