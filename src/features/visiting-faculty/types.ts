// ============================================================
//  Visiting Faculty Module — Types
//  Joining process (J1–J6) and payment process (P1–P4), per
//  "IUMS Visiting Faculty Module Flow V1". The mobile app adds
//  daily attendance + lecture/practical logs that feed the bill.
// ============================================================

export type ApplicationStatus =
  | 'Submitted'
  | 'Rejected'
  | 'In Scrutiny List'
  | 'Interview Scheduled'
  | 'Not Selected'
  | 'In Merit List'
  | 'Pending Approval'
  | 'Returned by Registrar & VC'
  | 'Joined';

export type LogStatus = 'Pending' | 'Verified' | 'Rejected';

export type BillStatus =
  | 'Prepared'
  | 'Sent to Finance'
  | 'Under Verification'
  | 'Pending Registrar & VC Approval'
  | 'Approved by Registrar & VC'
  | 'Paid'
  | 'Partially Paid'
  | 'Not Payable';

export type SessionType = 'Theory' | 'Practical';

export interface Department {
  code: string;
  name: string;
}

export interface Interview {
  date: string;
  time: string;
  venue: string;
  committee: string;
  result?: 'Finalised' | 'Not Selected';
  marks?: number;
  remarks?: string;
}

/** One application per selected UTD — the PAN ties them to one person. */
export interface Application {
  id: string;
  applicationNo: string;
  submittedOn: string;
  department: string;
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  qualifications: string[];
  designation: string;
  dateOfAppointment: string;
  pan: string;
  aadhar: string;
  session: string;
  semester: 'Odd' | 'Even';
  programs: string[];
  branches: string[];
  years: string[];
  subjects: string[];
  labs: string[];
  theoryHoursPerWeek: number;
  practicalHoursPerWeek: number;
  resume: string;
  qualificationDocument: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  verifiedOn?: string;
  interview?: Interview;
  meritRank?: number;
  forwardedOn?: string;
  headOfficeRemarks?: string;
  joinedOn?: string;
}

/** One teaching session entered from the mobile app. */
export interface TeachingSession {
  type: SessionType;
  subject: string;
  program: string;
  topic: string;
  time: string;
}

/** One faculty-day-department record, created from the mobile app. */
export interface DailyLog {
  id: string;
  uniqueId: string;
  department: string;
  date: string;
  checkIn: string;
  location: string;
  sessions: TeachingSession[];
  status: LogStatus;
  remarks?: string;
}

export interface Bill {
  id: string;
  billNo: string;
  billDate: string;
  department: string;
  uniqueId: string;
  facultyName: string;
  /** Billing period, `YYYY-MM`. */
  period: string;
  daysPresent: number;
  theoryCount: number;
  practicalCount: number;
  theoryRate: number;
  practicalRate: number;
  billAmount: number;
  hodCertified: boolean;
  status: BillStatus;
  payable?: number;
  notPayable?: number;
  paidOn?: string;
  transactionRef?: string;
  financeRemarks?: string;
  /** Set when the department's monthly total crossed the approval threshold. */
  sentForApprovalOn?: string;
  approvedOn?: string;
  approvedBy?: string;
  approvalRemarks?: string;
}

export interface RateMaster {
  theoryRate: number;
  practicalRate: number;
  limit: number;
  /** A UTD's monthly bill total above this needs Registrar & VC approval. */
  approvalThreshold: number;
}

/** A joined faculty — derived from Joined applications, keyed by Unique ID. */
export interface Faculty {
  uniqueId: string;
  fullName: string;
  pan: string;
  mobile: string;
  email: string;
  departments: string[];
  subjects: string[];
  labs: string[];
  joinedOn: string;
}
