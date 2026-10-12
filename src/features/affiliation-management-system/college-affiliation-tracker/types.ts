export interface TrackerFilterState {
  session: string;
  applicationType: string;
  applicationNo: string;
}

export interface ApplicationVerificationAction {
  authority: string; // e.g. "DEO Decision", "JD Decision", "Standing Committee Decision"
  decision: string; // "Recommended", "Approved", "Rejected", "Pending"
  remark: string;
  actionDate: string; // "DD/MM/YYYY"
  isApproved?: boolean;
}

export interface ApplicationVerificationStep {
  stepTitle: string; // e.g. "Committee Status"
  stepSubtitle: string; // e.g. "Application Verification"
  badgeStatus: string; // "Verified", "Approved", "In Progress", "Pending"
  badgeVariant: 'success' | 'danger' | 'warning' | 'info';
  actions: ApplicationVerificationAction[];
}

export interface CollegeAffiliationTrackerRecord {
  applicationNo: string;
  applicationType: string;
  affiliationType: string;
  // College Details from Basic Registration (1st image)
  collegeName: string;
  collegeType: string;
  collegeEmail: string;
  principalName: string;
  principalMobileNo: string;
  principalEmail: string;
  state: string;
  district: string;
  blockTehsil: string;
  pinCode: string;
  collegeAddress: string;

  // School legacy fields (optional)
  schoolName?: string;
  sankul?: string;
  schoolCategory?: string;
  schoolSubCategory?: string;
  medium?: string;
  subjects?: string;
  udiseCode?: string;
  block?: string;
  address?: string;
  paymentDate: string;
  session: string;

  currentStatusBanner: string;
  currentStatusCode:
    | 'current'
    | 'approved'
    | 'partial'
    | 'rejected'
    | 'pending';

  activeStepIndex?: number;
  progressSteps?: ApplicationProgressStep[];

  committeeVerificationSteps: ApplicationVerificationStep[];
}

export interface ApplicationProgressStep {
  label: string;
  description: string;
  icon: string;
  authority?: string;
  decision?: string;
  actionDate?: string;
  discussion?: string;
  remark?: string;
}
