// Static-prototype persistence for the public College Registration form.
// The saved values pre-fill Basic Registration Details and the College
// Affiliation Form (profile-details) so the flow feels end-to-end.

const STORAGE_KEY = 'ams-college-registration';

export interface SavedCollegeRegistration {
  collegeName: string;
  collegeType: string;
  collegeEmail: string;
  principalDirectorName: string;
  principalMobileNo: string;
  principalEmail: string;
  stateName: string;
  districtName: string;
  blockTehsil: string;
  pinCode: string;
  collegeAddress: string;
  societyName?: string;
  secretaryName?: string;
  secretaryMobileNo?: string;
  secretaryEmail?: string;
  educationType?: string;
  approvalAuthority?: string;
  applicationFeePaid?: boolean;
  feeTransactionRef?: string;
  feePaidDate?: string;
  applicationNumber?: string;
}

export function saveCollegeRegistration(data: SavedCollegeRegistration) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable (private mode etc.) — prototype silently falls back.
  }
}

export function getCollegeRegistration(): SavedCollegeRegistration | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedCollegeRegistration) : null;
  } catch {
    return null;
  }
}
