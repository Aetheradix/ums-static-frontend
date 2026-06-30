export const MemberType = {
  EMPLOYEE: 'Employee',
  STUDENT: 'Student',
  GUEST: 'Guest',
} as const;
export type MemberType = (typeof MemberType)[keyof typeof MemberType];

export const ValidityType = {
  LIFETIME: 'Lifetime',
  VALID_TILL: 'Valid Till',
  SUPERANNUATION: 'Superannuation',
} as const;
export type ValidityType = (typeof ValidityType)[keyof typeof ValidityType];

export const AffiliationType = {
  AFFILIATED: 'Affiliated',
  ATTACHED: 'Attached',
} as const;
export type AffiliationType =
  (typeof AffiliationType)[keyof typeof AffiliationType];

export const VisitingStatus = {
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
} as const;
export type VisitingStatus =
  (typeof VisitingStatus)[keyof typeof VisitingStatus];

export const RecordReferral = {
  YES: 'Yes',
  NO: 'No',
} as const;
export type RecordReferral =
  (typeof RecordReferral)[keyof typeof RecordReferral];

export const AppointmentStatus = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;
export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export interface MembershipType {
  id: string;
  name: string;
  memberType: MemberType;
  healthCenter: string;
  benefits: string;
  validityType: ValidityType;
  validityDays: number;
  validityMonths: number;
  validityYears: number;
  status: 'Active' | 'Inactive';
  feeApplicable: 'Yes' | 'No';
  feeAmount: number;
}

export interface MembershipCardTemplate {
  id: string;
  name: string;
  templateBody: string;
  backgroundColor: string;
  status: 'Active' | 'Inactive';
}

export interface SettingsGeneral {
  subscribedMembershipOnly: boolean;
}

export interface UnitType {
  id: string;
  type: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface FacilityMaster {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface Facility {
  id: string;
  healthCenter: string;
  facilityName: string;
  details: string;
  status: 'Active' | 'Inactive';
}

export interface Hospital {
  id: string;
  name: string;
  registrationNo: string;
  affiliation: AffiliationType;
  unitType: string;
  facility: string;
  contactNo: string;
  address: string;
  status: 'Active' | 'Inactive';
  remarks: string;
}

export interface DoctorSpeciality {
  id: string;
  speciality: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface Doctor {
  id: string;
  isUniversityDoctor: 'Yes' | 'No';
  universityDoctorName: string;
  profileId: string;
  name: string;
  contact: string;
  address: string;
  hospital: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  experience: number;
  visitingHoursStart: string;
  visitingHoursEnd: string;
  visitingDays: string;
  visitingStatus: VisitingStatus;
  speciality: string;
  extraInfo: string;
  status: 'Active' | 'Inactive';
}

export interface HealthRecordDay {
  id: string;
  days: number;
}

export interface ReferralTemplate {
  id: string;
  name: string;
  templateBody: string;
  backgroundColor: string;
  status: 'Active' | 'Inactive';
}

export interface PrescriptionControl {
  id: string;
  showSignature: boolean;
}

export interface Dependent {
  id: string;
  name: string;
  relation: string;
}

export interface Membership {
  id: string;
  memberType: MemberType;
  memberId: string;
  memberName: string;
  program: string;
  academicYear: string;
  academicSession: string;
  academicSection: string;
  healthCenter: string;
  membershipTypeId: string;
  membershipTypeName: string;
  membershipDate: string;
  validFrom: string;
  validityType: ValidityType;
  validTill: string;
  dependents: Dependent[];
}

export interface MedicineBrand {
  id: string;
  brandName: string;
  remarks: string;
}

export interface MedicineCompany {
  id: string;
  companyName: string;
  remarks: string;
}

export interface MedicineSalt {
  id: string;
  saltName: string;
  remarks: string;
}

export interface MedicineStockType {
  id: string;
  name: string;
  description: string;
  disabled: boolean;
}

export interface MedicalStock {
  id: string;
  brandId: string;
  brandName: string;
  companyId: string;
  companyName: string;
  saltId: string;
  saltName: string;
  stockTypeId: string;
  stockTypeName: string;
  batchNo: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  healthCenter: string;
}

export interface PrescriptionCode {
  id: string;
  code: string;
  doseQuantity: string;
  description: string;
}

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  dose: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  healthRecordId: string;
  prescribedOn: string;
  patientName: string;
  remarks: string;
  items: PrescriptionItem[];
  declaration: boolean;
  prescribedBy: string;
}

export interface DispensaryItem {
  medicineId: string;
  medicineName: string;
  dose: string;
  frequency: string;
  duration: string;
}

export interface Dispensary {
  id: string;
  healthRecordId: string;
  dispensedOn: string;
  patientName: string;
  remarks: string;
  items: DispensaryItem[];
  declaration: boolean;
  dispensedBy: string;
}

export interface Appointment {
  id: string;
  memberId: string;
  memberName: string;
  doctorId: string;
  doctorName: string;
  speciality: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  healthCenter: string;
}

export interface GuestUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  status: 'Active' | 'Inactive';
  remarks: string;
}

export interface HealthRecord {
  id: string;
  membershipId: string;
  memberName: string;
  membershipTypeName: string;
  healthCenter: string;
  isDependent: 'Yes' | 'No';
  dependentId: string;
  dependentName: string;
  dependentRelation: string;
  dateOfVisit: string;
  timeOfVisit: string;
  height: string;
  weight: string;
  bloodGroup: string;
  pastMedicalHistory: string;
  regularMedicine: string;
  drugAllergy: string;
  chiefComplaint: string;
  examinationFindings: string;
  prescription: string;
  clinicalNoting: string;
  referredToHospital: RecordReferral;
  approvedHospital: string;
  referralTemplate: string;
  createdBy: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  membershipId: string;
  memberName: string;
  amount: number;
  transactionDate: string;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}
