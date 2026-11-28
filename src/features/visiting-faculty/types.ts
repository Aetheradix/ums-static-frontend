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
  | 'Forwarded to UTD'
  | 'Pending Approval'
  | 'Returned by Registrar & VC'
  | 'Joined';

export type LogStatus = 'Pending' | 'Verified' | 'Rejected';

export type BillStatus =
  | 'Prepared'
  | 'Sent to UTD'
  | 'Returned by UTD'
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
  /** Total teaching / professional experience, in years. */
  experienceYears: number;
  applicationType?: 'New Registration' | 'Re-apply';
  reapplyFor?: 'Another Subject' | 'Another UTD Department';
  /** Experience as visiting faculty at DAVV — re-apply only. */
  davvExperienceYears?: number;
  pan: string;
  aadhar: string;
  session: string;
  semester: 'Odd' | 'Even';
  programs: string[];
  branches: string[];
  /** Semesters taught, in Roman numerals (I–VI). */
  semesters: string[];
  subjects: string[];
  labs: string[];
  theoryHoursPerWeek: number;
  practicalHoursPerWeek: number;
  resume: string;
  qualificationDocument: string;
  panCardDocument: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  verifiedOn?: string;
  interview?: Interview;
  meritRank?: number;
  /** Date the HOD forwarded the merit list to the UTD Department. */
  hodForwardedOn?: string;
  /** Remarks when the UTD Department returns a candidate to the HOD. */
  utdRemarks?: string;
  forwardedOn?: string;
  headOfficeRemarks?: string;
  /** Date of Registrar & VC approval. */
  joinedOn?: string;
  /**
   * Actual joining date, entered once by the department after approval.
   * Final — it cannot be changed afterwards.
   */
  joiningDate?: string;
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
  /** Branch whose HOD verified attendance and prepared the bill. */
  branch?: string;
  sentToUtdOn?: string;
  utdForwardedOn?: string;
  utdRemarks?: string;
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
  /** One entry per UTD the faculty is approved in. */
  appointments: {
    appId: string;
    department: string;
    branch: string;
    approvedOn?: string;
    joiningDate?: string;
  }[];
}

/** A subject or lab of one branch, maintained by that branch's HOD. */
export interface SubjectMaster {
  id: string;
  department: string;
  branch: string;
  code: string;
  name: string;
  /** Theory = subject (Subject 1–4 in the form); Practical = lab (Lab 1–8). */
  type: SessionType;
  program: string;
  semester: string;
}

/** How many visiting faculty a branch needs for a subject in a term. */
export interface FacultyRequirement {
  id: string;
  department: string;
  branch: string;
  session: string;
  /** Odd = July–Dec, Even = Jan–June. */
  semesterPeriod: 'Odd' | 'Even';
  program: string;
  semester: string;
  subjectCode: string;
  facultyRequired: number;
  hoursPerWeek: number;
  remarks?: string;
  createdOn: string;
}
