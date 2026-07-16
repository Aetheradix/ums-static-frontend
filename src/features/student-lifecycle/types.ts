/**
 * ============================================================================
 * Domain models — DAVV IET Student Lifecycle
 * ============================================================================
 */

export type Role = 'student' | 'faculty' | 'admin';

export type BranchCode =
  | 'CSE'
  | 'IT'
  | 'ETC'
  | 'ME'
  | 'CE'
  | 'EI'
  | 'CSBS'
  | 'IPE'
  | 'EEE';

export interface Branch {
  code: BranchCode;
  name: string;
  intake: number;
}

export type StudentCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

export type AdmissionQuota =
  | 'Home State (MP)'
  | 'Other State'
  | 'NRI / Management';

export type CourseCategory =
  | 'Core'
  | 'Program Elective'
  | 'Open Elective'
  | 'Skill Enhancement'
  | 'Ability Enhancement'
  | 'Laboratory'
  | 'Project';

export interface Course {
  code: string;
  title: string;
  credits: number;
  category: CourseCategory;
  branch: BranchCode | 'ALL';
  semester: number;
  courseOutcomes?: string[];
  syllabusUrl?: string;
}

export type LetterGrade = 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F';

export type CourseResultStatus = 'Pass' | 'Fail' | 'Pending' | 'Backlog';

export interface CourseResult {
  courseCode: string;
  title: string;
  credits: number;
  internal: number | null;
  external: number | null;
  grade: LetterGrade | null;
  gradePoint: number | null;
  status: CourseResultStatus;
}

export interface SemesterRecord {
  semester: number;
  session: string;
  courses: CourseResult[];
  sgpa?: number | null;
}

export interface AttendanceRecord {
  courseCode: string;
  title: string;
  attended: number;
  held: number;
}

export interface InternalAssessment {
  courseCode: string;
  title: string;
  mst1: number | null;
  mst2: number | null;
  assignment: number | null;
  quiz: number | null;
  total: number | null;
  locked: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type:
    | 'exam'
    | 'registration'
    | 'result'
    | 'fee'
    | 'holiday'
    | 'class'
    | 'form';
  detail?: string;
}

export interface Guardian {
  name: string;
  relation: 'Father' | 'Mother' | 'Guardian';
  phone: string;
  occupation?: string;
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AdmissionInfo {
  allotmentNo: string;
  jeeRank?: number;
  counsellingRound: number;
  documents: { name: string; verified: boolean }[];
  admissionConfirmed: boolean;
  feePaid: boolean;
}

export type ScholarshipStatus =
  | 'Not Applied'
  | 'Applied'
  | 'Sanctioned'
  | 'Disbursed';

export interface Scholarship {
  scheme: string;
  status: ScholarshipStatus;
}

export type FeeHead =
  | 'Tuition'
  | 'Examination'
  | 'Hostel'
  | 'Fine'
  | 'Registration';
export type FeeStatus = 'Paid' | 'Due' | 'Partial';

export interface FeeRecord {
  id: string;
  semester: number;
  head: FeeHead;
  amount: number;
  status: FeeStatus;
  dueDate?: string;
  paidOn?: string;
  receiptNo?: string;
}

export interface Student {
  enrollmentNo: string;
  rollNo: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  branch: BranchCode;
  section: string;
  admissionYear: number;
  currentSemester: number;
  category: StudentCategory;
  quota: AdmissionQuota;
  aadhaarLast4: string;
  address: Address;
  guardians: Guardian[];
  photoColor: string;
  admission: AdmissionInfo;
  scholarship: Scholarship;
  semesters: SemesterRecord[];
  attendance: AttendanceRecord[];
  internals: InternalAssessment[];
  fees: FeeRecord[];
}

export interface FacultyCourseLoad {
  courseCode: string;
  title: string;
  branch: BranchCode;
  semester: number;
  section: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: BranchCode;
  designation: string;
  email: string;
  photoColor: string;
  coursesTaught: FacultyCourseLoad[];
  advisorOf: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  role: Role;
  adminRole: AdminRole;
  email: string;
  photoColor: string;
  active: boolean;
}

export type NotificationKind =
  | 'deadline'
  | 'result'
  | 'warning'
  | 'fee'
  | 'exam'
  | 'info';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  date: string;
  read: boolean;
  href?: string;
}

export type CertificateType =
  | 'Bonafide'
  | 'Character'
  | 'No-Dues'
  | 'Migration'
  | 'Transcript'
  | 'Duplicate Marksheet'
  | 'Provisional'
  | 'Degree';

export type CertificateStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Ready for Collection'
  | 'Issued';

export interface CertificateRequest {
  id: string;
  type: CertificateType;
  requestedOn: string;
  status: CertificateStatus;
  copies: number;
  purpose: string;
  delivery: 'Collect at Counter' | 'Speed Post';
}

export interface ExamRegistration {
  semester: number;
  windowOpen: string;
  windowClose: string;
  registeredCourses: string[];
  submitted: boolean;
  hallTicketNo?: string;
}

export type AdminRole = 'super' | 'registrar' | 'exam' | 'accounts' | 'dept';

export type Permission =
  | 'students.view'
  | 'students.manage'
  | 'students.import'
  | 'faculty.manage'
  | 'fees.view'
  | 'fees.manage'
  | 'masters.edit'
  | 'announcements.send'
  | 'settings.edit'
  | 'roles.edit'
  | 'reports.view';

export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking' | 'Counter';

export interface FeePayment {
  feeId: string;
  enrollmentNo: string;
  amount: number;
  method: PaymentMethod;
  transactionId: string;
  receiptNo: string;
  paidOn: string;
}

export interface ImportedStudentRow {
  enrollmentNo: string;
  name: string;
  dob: string;
  branch: string;
  section: string;
  category: string;
  email: string;
  phone: string;
}
