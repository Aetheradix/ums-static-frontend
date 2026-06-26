export interface StudentProfile {
  enrollmentNo: string;
  applicationNo: string;
  applicationDate: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  bloodGroup: string;
  caste: string;
  casteCategory: string;
  nationality: string;
  religion: string;
  aadharNo: string;
  panNo: string;
  ethnicity: string;
  residencyStatus: string;

  fatherName: string;
  fatherOccupation: string;
  fatherDesignation: string;
  fatherAnnualIncome: number;
  fatherContactNumber: string;

  motherName: string;
  motherOccupation: string;
  motherDesignation: string;
  motherAnnualIncome: number;
  motherContactNumber: string;

  currentAddress: AddressInfo;
  permanentAddress: AddressInfo;

  programme: string;
  degreeLevel: string;
  specialisation: string;
  programmeMode: string;
  academicSession: string;

  priorEducations: PriorEducationView[];

  documents: StudentDocument[];

  admissionDetails: AdmissionDetails;

  applicationStatus: ApplicationStatusInfo;

  feeSummary: FeeSummary;

  timeline: TimelineEvent[];
}

export interface AddressInfo {
  addressType: string;
  country: string;
  state: string;
  district: string;
  tehsil: string;
  block: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  zipcode: string;
}

export interface PriorEducationView {
  educationLevel: string;
  institutionName: string;
  boardOrUniversity: string;
  passingYear: number;
  percentage: number | null;
  cgpa: number | null;
  subjectsOrStream: string;
  documentType: string;
  documentName: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
  status: 'Verified' | 'Pending' | 'Rejected';
}

export interface AdmissionDetails {
  admissionDate: string;
  admissionQuota: string;
  enrollmentNo: string;
  rollNo: string;
  batchYear: string;
  semester: string;
  campus: string;
  scheme: string;
}

export interface ApplicationStatusInfo {
  currentStatus: string;
  statusColor: 'pending' | 'approved' | 'rejected' | 'neutral';
  remarks: string;
  lastUpdated: string;
}

export interface FeeSummary {
  totalFee: number;
  paidFee: number;
  pendingFee: number;
  dueDate: string;
  lastPaymentDate: string;
  lastPaymentAmount: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'current' | 'pending';
}
