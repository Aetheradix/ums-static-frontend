// ─────────────────────────────────────────────
// Open Book Examination Module — Mock Data
// All types defined inline — no external deps
// ─────────────────────────────────────────────

// ─── Enums / Literal Unions ───
export type UserRole = 'admin' | 'teacher' | 'student' | 'controller_of_exams';
export type ExamStatus =
  | 'draft'
  | 'published'
  | 'registration_open'
  | 'eligibility_lock'
  | 'admit_generated'
  | 'in_progress'
  | 'submission'
  | 'evaluation'
  | 'moderation'
  | 'result_draft'
  | 'result_published';
export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'fill_blanks'
  | 'short_answer'
  | 'long_answer'
  | 'case_study'
  | 'coding'
  | 'matching'
  | 'assertion_reason';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type CourseType = 'Core' | 'Elective' | 'Minor' | 'Skill';
export type BloomLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type MaterialStatus = 'pending' | 'approved' | 'rejected';
export type AttemptStatus = 'in_progress' | 'submitted' | 'timed_out';
export type RevaluationStatus =
  | 'pending'
  | 'under_review'
  | 'completed'
  | 'rejected';
export type NotifType =
  | 'exam_reminder'
  | 'resource_approved'
  | 'result_published'
  | 'revaluation_update';

// ─── Interfaces ───

export interface AcademicSession {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Program {
  id: number;
  name: string;
  code: string;
  durationYears: number;
  departmentId: number;
  departmentName: string;
  isActive: boolean;
}

export interface Semester {
  id: number;
  programId: number;
  programName: string;
  semesterNumber: number;
  totalCredits: number;
  isActive: boolean;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  departmentId: number;
  departmentName: string;
  isActive: boolean;
}

export interface Course {
  id: number;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  semesterId: number;
  semesterNumber: number;
  programName: string;
  teacherId: number;
  teacherName: string;
  courseType: CourseType;
  credits: number;
  isActive: boolean;
}

export interface ExamType {
  id: number;
  name: string;
  weightage: number;
  isActive: boolean;
  isOpenBookAllowed: boolean;
}

export interface OpenBookPolicy {
  id: number;
  name: string;
  description: string;
  allowStudentUpload: boolean;
  autoApproval: boolean;
  secureViewerRequired: boolean;
  isActive: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: number;
  departmentName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Exam {
  id: number;
  title: string;
  courseId: number;
  courseName: string;
  subjectName: string;
  examTypeId: number;
  examTypeName: string;
  sessionId: number;
  sessionName: string;
  isOpenBook: boolean;
  policyId?: number;
  policyName?: string;
  durationMinutes: number;
  totalMarks: number;
  passMarks: number;
  attemptLimit: number;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  description: string;
  instructions: string;
  status: ExamStatus;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamRegistration {
  id: number;
  examId: number;
  examTitle: string;
  subjectName: string;
  studentId: number;
  studentName: string;
  rollNo: string;
  registeredAt: string;
  status: 'registered' | 'withdrawn';
}

export interface EligibilityResult {
  id: number;
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  rollNo: string;
  attendancePct: number;
  cgpa: number;
  feeCleared: boolean;
  backlogCount: number;
  overall: 'eligible' | 'ineligible';
  reason: string;
}

export interface AdmitCard {
  id: number;
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  rollNo: string;
  programName: string;
  date: string;
  time: string;
  venue: string;
  generatedAt: string;
}

export interface Question {
  id: number;
  subjectId: number;
  subjectName: string;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
  bloomLevel: BloomLevel;
  difficulty: Difficulty;
  coId?: number;
  topic: string;
  mediaUrls: string[];
  usageCount: number;
  status: 'active' | 'inactive';
  createdBy: number;
  createdByName: string;
  createdAt: string;
  version: number;
}

export interface PaperSection {
  name: string;
  questionIds: number[];
  marksPerQuestion: number;
  totalMarks: number;
}

export interface QuestionPaper {
  id: number;
  examId: number;
  examTitle: string;
  subjectName: string;
  totalMarks: number;
  sections: PaperSection[];
  bloomDistribution: Record<number, number>;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface QuestionPaperSet {
  id: number;
  paperId: number;
  setCode: string;
  questionIds: number[];
  totalMarks: number;
}

export interface StudyMaterial {
  id: number;
  examId: number;
  examTitle: string;
  uploadedBy: number;
  uploaderName: string;
  type: 'teacher' | 'student';
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  externalLink?: string;
  category: string;
  isRestricted: boolean;
  status: MaterialStatus;
  uploadedAt: string;
}

export interface MaterialApproval {
  id: number;
  materialId: number;
  materialTitle: string;
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  rollNo: string;
  status: MaterialStatus;
  reviewNote?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  submittedAt: string;
}

export interface ExamAttempt {
  id: number;
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  rollNo: string;
  startTime: string;
  endTime?: string;
  status: AttemptStatus;
  tabSwitchCount: number;
  autoSaveVersion: number;
  submittedAt?: string;
}

export interface StudentAnswer {
  id: number;
  attemptId: number;
  questionId: number;
  questionText: string;
  questionType: QuestionType;
  answerText?: string;
  marksObtained?: number;
  maxMarks: number;
  evaluatedBy?: number;
  evaluatedByName?: string;
  evaluatedAt?: string;
  remarks?: string;
  isFlagged: boolean;
}

export interface RubricCriterion {
  name: string;
  description: string;
  maxMarks: number;
}

export interface Rubric {
  id: number;
  name: string;
  questionId: number;
  criteria: RubricCriterion[];
  totalMarks: number;
}

export interface Evaluation {
  id: number;
  attemptId: number;
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  rollNo: string;
  totalMarks: number;
  marksAwarded: number;
  evaluatedBy?: number;
  evaluatedByName?: string;
  evaluatedAt?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ModerationRecord {
  id: number;
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  rollNo: string;
  flaggedBy: number;
  flaggedByName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: number;
  reviewedByName?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface Result {
  id: number;
  attemptId: number;
  examId: number;
  examTitle: string;
  subjectName: string;
  studentId: number;
  studentName: string;
  rollNo: string;
  totalMarksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  isPassed: boolean;
  publishedAt?: string;
  publishedBy?: string;
}

export interface RevaluationRequest {
  id: number;
  resultId: number;
  examId: number;
  examTitle: string;
  subjectName: string;
  studentId: number;
  studentName: string;
  rollNo: string;
  currentMarks: number;
  reason: string;
  status: RevaluationStatus;
  revisedMarks?: number;
  reviewedBy?: number;
  reviewedByName?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotifType;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  tableName: string;
  recordId: number;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  performedBy: number;
  performedByName: string;
  ipAddress: string;
  timestamp: string;
}

export interface SystemConfig {
  id: number;
  defaultPassPct: number;
  minAttendancePct: number;
  maxBacklogs: number;
  maxFileSizeMB: number;
  autoSaveIntervalSec: number;
  tabSwitchLimit: number;
  revaluationWindowDays: number;
  gracePeriodMinutes: number;
}

export interface DashboardStats {
  totalExams: number;
  activeExams: number;
  totalStudents: number;
  registeredStudents: number;
  submittedCount: number;
  pendingEvaluation: number;
  publishedResults: number;
  passRate: number;
}

// ─────────────────────────────────────────────
// Mock Data Arrays
// ─────────────────────────────────────────────

export const mockAcademicSessions: AcademicSession[] = [
  {
    id: 1,
    name: '2024-25',
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    isCurrent: false,
  },
  {
    id: 2,
    name: '2025-26',
    startDate: '2025-07-01',
    endDate: '2026-06-30',
    isCurrent: true,
  },
  {
    id: 3,
    name: '2026-27',
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    isCurrent: false,
  },
];

export const mockPrograms: Program[] = [
  {
    id: 1,
    name: 'B.Tech Computer Science',
    code: 'BTCS',
    durationYears: 4,
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
  },
  {
    id: 2,
    name: 'B.Tech Electronics',
    code: 'BTEC',
    durationYears: 4,
    departmentId: 2,
    departmentName: 'Electronics',
    isActive: true,
  },
  {
    id: 3,
    name: 'MBA',
    code: 'MBA',
    durationYears: 2,
    departmentId: 3,
    departmentName: 'Management',
    isActive: true,
  },
  {
    id: 4,
    name: 'B.Sc Mathematics',
    code: 'BSM',
    durationYears: 3,
    departmentId: 4,
    departmentName: 'Mathematics',
    isActive: true,
  },
  {
    id: 5,
    name: 'MCA',
    code: 'MCA',
    durationYears: 2,
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: false,
  },
];

export const mockSemesters: Semester[] = [
  {
    id: 1,
    programId: 1,
    programName: 'B.Tech Computer Science',
    semesterNumber: 1,
    totalCredits: 24,
    isActive: true,
  },
  {
    id: 2,
    programId: 1,
    programName: 'B.Tech Computer Science',
    semesterNumber: 2,
    totalCredits: 24,
    isActive: true,
  },
  {
    id: 3,
    programId: 1,
    programName: 'B.Tech Computer Science',
    semesterNumber: 3,
    totalCredits: 26,
    isActive: true,
  },
  {
    id: 4,
    programId: 1,
    programName: 'B.Tech Computer Science',
    semesterNumber: 4,
    totalCredits: 26,
    isActive: true,
  },
  {
    id: 5,
    programId: 1,
    programName: 'B.Tech Computer Science',
    semesterNumber: 5,
    totalCredits: 26,
    isActive: true,
  },
  {
    id: 6,
    programId: 1,
    programName: 'B.Tech Computer Science',
    semesterNumber: 6,
    totalCredits: 26,
    isActive: true,
  },
  {
    id: 7,
    programId: 1,
    programName: 'B.Tech Computer Science',
    semesterNumber: 7,
    totalCredits: 24,
    isActive: true,
  },
  {
    id: 8,
    programId: 1,
    programName: 'B.Tech Computer Science',
    semesterNumber: 8,
    totalCredits: 20,
    isActive: true,
  },
  {
    id: 9,
    programId: 2,
    programName: 'B.Tech Electronics',
    semesterNumber: 1,
    totalCredits: 24,
    isActive: true,
  },
  {
    id: 10,
    programId: 3,
    programName: 'MBA',
    semesterNumber: 1,
    totalCredits: 20,
    isActive: true,
  },
  {
    id: 11,
    programId: 3,
    programName: 'MBA',
    semesterNumber: 2,
    totalCredits: 20,
    isActive: true,
  },
  {
    id: 12,
    programId: 4,
    programName: 'B.Sc Mathematics',
    semesterNumber: 1,
    totalCredits: 22,
    isActive: true,
  },
];

export const mockSubjects: Subject[] = [
  {
    id: 1,
    name: 'Data Structures',
    code: 'CS201',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
  },
  {
    id: 2,
    name: 'Algorithms',
    code: 'CS202',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
  },
  {
    id: 3,
    name: 'Database Systems',
    code: 'CS301',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
  },
  {
    id: 4,
    name: 'Operating Systems',
    code: 'CS302',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
  },
  {
    id: 5,
    name: 'Computer Networks',
    code: 'CS401',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
  },
  {
    id: 6,
    name: 'Machine Learning',
    code: 'CS402',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
  },
  {
    id: 7,
    name: 'Software Engineering',
    code: 'CS403',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
  },
  {
    id: 8,
    name: 'Web Technologies',
    code: 'CS404',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
  },
  {
    id: 9,
    name: 'Digital Electronics',
    code: 'EC201',
    departmentId: 2,
    departmentName: 'Electronics',
    isActive: true,
  },
  {
    id: 10,
    name: 'Marketing Management',
    code: 'MBA101',
    departmentId: 3,
    departmentName: 'Management',
    isActive: true,
  },
];

export const mockCourses: Course[] = [
  {
    id: 1,
    subjectId: 1,
    subjectName: 'Data Structures',
    subjectCode: 'CS201',
    semesterId: 3,
    semesterNumber: 3,
    programName: 'B.Tech Computer Science',
    teacherId: 2,
    teacherName: 'Dr. Sharma',
    courseType: 'Core',
    credits: 4,
    isActive: true,
  },
  {
    id: 2,
    subjectId: 2,
    subjectName: 'Algorithms',
    subjectCode: 'CS202',
    semesterId: 4,
    semesterNumber: 4,
    programName: 'B.Tech Computer Science',
    teacherId: 2,
    teacherName: 'Dr. Sharma',
    courseType: 'Core',
    credits: 4,
    isActive: true,
  },
  {
    id: 3,
    subjectId: 3,
    subjectName: 'Database Systems',
    subjectCode: 'CS301',
    semesterId: 5,
    semesterNumber: 5,
    programName: 'B.Tech Computer Science',
    teacherId: 3,
    teacherName: 'Prof. Verma',
    courseType: 'Core',
    credits: 4,
    isActive: true,
  },
  {
    id: 4,
    subjectId: 4,
    subjectName: 'Operating Systems',
    subjectCode: 'CS302',
    semesterId: 5,
    semesterNumber: 5,
    programName: 'B.Tech Computer Science',
    teacherId: 3,
    teacherName: 'Prof. Verma',
    courseType: 'Core',
    credits: 3,
    isActive: true,
  },
  {
    id: 5,
    subjectId: 5,
    subjectName: 'Computer Networks',
    subjectCode: 'CS401',
    semesterId: 6,
    semesterNumber: 6,
    programName: 'B.Tech Computer Science',
    teacherId: 4,
    teacherName: 'Dr. Patel',
    courseType: 'Core',
    credits: 4,
    isActive: true,
  },
  {
    id: 6,
    subjectId: 6,
    subjectName: 'Machine Learning',
    subjectCode: 'CS402',
    semesterId: 6,
    semesterNumber: 6,
    programName: 'B.Tech Computer Science',
    teacherId: 4,
    teacherName: 'Dr. Patel',
    courseType: 'Elective',
    credits: 3,
    isActive: true,
  },
  {
    id: 7,
    subjectId: 7,
    subjectName: 'Software Engineering',
    subjectCode: 'CS403',
    semesterId: 7,
    semesterNumber: 7,
    programName: 'B.Tech Computer Science',
    teacherId: 2,
    teacherName: 'Dr. Sharma',
    courseType: 'Core',
    credits: 3,
    isActive: true,
  },
  {
    id: 8,
    subjectId: 8,
    subjectName: 'Web Technologies',
    subjectCode: 'CS404',
    semesterId: 7,
    semesterNumber: 7,
    programName: 'B.Tech Computer Science',
    teacherId: 5,
    teacherName: 'Ms. Gupta',
    courseType: 'Elective',
    credits: 3,
    isActive: true,
  },
  {
    id: 9,
    subjectId: 9,
    subjectName: 'Digital Electronics',
    subjectCode: 'EC201',
    semesterId: 9,
    semesterNumber: 1,
    programName: 'B.Tech Electronics',
    teacherId: 6,
    teacherName: 'Dr. Singh',
    courseType: 'Core',
    credits: 4,
    isActive: true,
  },
  {
    id: 10,
    subjectId: 10,
    subjectName: 'Marketing Management',
    subjectCode: 'MBA101',
    semesterId: 10,
    semesterNumber: 1,
    programName: 'MBA',
    teacherId: 7,
    teacherName: 'Prof. Jain',
    courseType: 'Core',
    credits: 3,
    isActive: true,
  },
];

export const mockExamTypes: ExamType[] = [
  {
    id: 1,
    name: 'Midterm',
    weightage: 30,
    isActive: true,
    isOpenBookAllowed: true,
  },
  {
    id: 2,
    name: 'Final',
    weightage: 50,
    isActive: true,
    isOpenBookAllowed: true,
  },
  {
    id: 3,
    name: 'Quiz',
    weightage: 10,
    isActive: true,
    isOpenBookAllowed: false,
  },
  {
    id: 4,
    name: 'Practical',
    weightage: 10,
    isActive: true,
    isOpenBookAllowed: false,
  },
  {
    id: 5,
    name: 'Viva',
    weightage: 10,
    isActive: true,
    isOpenBookAllowed: false,
  },
  {
    id: 6,
    name: 'Internal Assessment',
    weightage: 20,
    isActive: true,
    isOpenBookAllowed: true,
  },
];

export const mockPolicies: OpenBookPolicy[] = [
  {
    id: 1,
    name: 'Teacher Resources Only',
    description: 'Students can access only teacher-uploaded materials',
    allowStudentUpload: false,
    autoApproval: false,
    secureViewerRequired: true,
    isActive: true,
  },
  {
    id: 2,
    name: 'Teacher + Student Shared',
    description: 'Students can upload for sharing; teacher approves',
    allowStudentUpload: true,
    autoApproval: false,
    secureViewerRequired: true,
    isActive: true,
  },
  {
    id: 3,
    name: 'All Resources (Open)',
    description: 'No restrictions; all materials allowed',
    allowStudentUpload: true,
    autoApproval: true,
    secureViewerRequired: false,
    isActive: true,
  },
  {
    id: 4,
    name: 'Closed Book',
    description: 'No resources allowed during exam',
    allowStudentUpload: false,
    autoApproval: false,
    secureViewerRequired: false,
    isActive: true,
  },
];

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'Dr. Sharma',
    email: 'sharma@university.edu',
    role: 'teacher',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: 3,
    name: 'Prof. Verma',
    email: 'verma@university.edu',
    role: 'teacher',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: 4,
    name: 'Dr. Patel',
    email: 'patel@university.edu',
    role: 'teacher',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-02-01',
  },
  {
    id: 5,
    name: 'Ms. Gupta',
    email: 'gupta@university.edu',
    role: 'teacher',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-02-01',
  },
  {
    id: 6,
    name: 'Dr. Singh',
    email: 'singh@university.edu',
    role: 'teacher',
    departmentId: 2,
    departmentName: 'Electronics',
    isActive: true,
    createdAt: '2024-01-20',
  },
  {
    id: 7,
    name: 'Prof. Jain',
    email: 'jain@university.edu',
    role: 'teacher',
    departmentId: 3,
    departmentName: 'Management',
    isActive: true,
    createdAt: '2024-01-20',
  },
  {
    id: 8,
    name: 'Rohan Mehta',
    email: 'rohan@university.edu',
    role: 'student',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-07-01',
  },
  {
    id: 9,
    name: 'Priya Sharma',
    email: 'priya@university.edu',
    role: 'student',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-07-01',
  },
  {
    id: 10,
    name: 'Arjun Singh',
    email: 'arjun@university.edu',
    role: 'student',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-07-01',
  },
  {
    id: 11,
    name: 'Sneha Patel',
    email: 'sneha@university.edu',
    role: 'student',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-07-01',
  },
  {
    id: 12,
    name: 'Vikram Rao',
    email: 'vikram@university.edu',
    role: 'student',
    departmentId: 1,
    departmentName: 'Computer Science',
    isActive: true,
    createdAt: '2024-07-01',
  },
  {
    id: 13,
    name: 'Ananya Gupta',
    email: 'ananya@university.edu',
    role: 'student',
    departmentId: 2,
    departmentName: 'Electronics',
    isActive: true,
    createdAt: '2024-07-01',
  },
  {
    id: 14,
    name: 'Controller Kumar',
    email: 'controller@university.edu',
    role: 'controller_of_exams',
    isActive: true,
    createdAt: '2024-01-01',
  },
];

export const mockStudents = mockUsers.filter(u => u.role === 'student');

export const mockExams: Exam[] = [
  {
    id: 999,
    title: 'Advanced Web Development Midterm',
    courseId: 1,
    courseName: 'Web Development',
    subjectName: 'Web Development',
    examTypeId: 1,
    examTypeName: 'Midterm',
    sessionId: 2,
    sessionName: '2025-26',
    isOpenBook: true,
    policyId: 2,
    policyName: 'Teacher + Student Shared',
    durationMinutes: 120,
    totalMarks: 50,
    passMarks: 20,
    attemptLimit: 1,
    scheduledDate: '2026-03-15',
    startTime: '10:00',
    endTime: '12:00',
    gracePeriodMinutes: 5,
    description:
      'Comprehensive midterm exam covering advanced React concepts, server-side rendering, and API integrations.',
    instructions:
      'Please ensure your webcams are enabled. You may refer to the official React documentation.',
    status: 'draft',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-02-01',
    updatedAt: '2026-03-20',
  },
  {
    id: 1,
    title: 'Data Structures Midterm',
    courseId: 1,
    courseName: 'Data Structures',
    subjectName: 'Data Structures',
    examTypeId: 1,
    examTypeName: 'Midterm',
    sessionId: 2,
    sessionName: '2025-26',
    isOpenBook: true,
    policyId: 2,
    policyName: 'Teacher + Student Shared',
    durationMinutes: 120,
    totalMarks: 50,
    passMarks: 20,
    attemptLimit: 1,
    scheduledDate: '2026-03-15',
    startTime: '10:00',
    endTime: '12:00',
    gracePeriodMinutes: 5,
    description: 'Midterm examination for Data Structures course',
    instructions:
      'Answer all questions. Open book exam — refer to approved materials only.',
    status: 'result_published',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-02-01',
    updatedAt: '2026-03-20',
  },
  {
    id: 2,
    title: 'Algorithms Final Exam',
    courseId: 2,
    courseName: 'Algorithms',
    subjectName: 'Algorithms',
    examTypeId: 2,
    examTypeName: 'Final',
    sessionId: 2,
    sessionName: '2025-26',
    isOpenBook: true,
    policyId: 1,
    policyName: 'Teacher Resources Only',
    durationMinutes: 180,
    totalMarks: 100,
    passMarks: 40,
    attemptLimit: 1,
    scheduledDate: '2026-05-20',
    startTime: '09:00',
    endTime: '12:00',
    gracePeriodMinutes: 10,
    description: 'Final examination for Algorithms',
    instructions: 'Answer any 5 of 8 questions. Open book.',
    status: 'evaluation',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-03-01',
    updatedAt: '2026-05-21',
  },
  {
    id: 3,
    title: 'Database Systems Quiz 1',
    courseId: 3,
    courseName: 'Database Systems',
    subjectName: 'Database Systems',
    examTypeId: 3,
    examTypeName: 'Quiz',
    sessionId: 2,
    sessionName: '2025-26',
    isOpenBook: false,
    durationMinutes: 30,
    totalMarks: 20,
    passMarks: 8,
    attemptLimit: 2,
    scheduledDate: '2026-04-10',
    startTime: '11:00',
    endTime: '11:30',
    gracePeriodMinutes: 0,
    description: 'Quiz on SQL and Normalization',
    instructions: 'MCQ based. No resources allowed.',
    status: 'result_published',
    createdBy: 3,
    createdByName: 'Prof. Verma',
    createdAt: '2026-03-15',
    updatedAt: '2026-04-11',
  },
  {
    id: 4,
    title: 'Operating Systems Midterm',
    courseId: 4,
    courseName: 'Operating Systems',
    subjectName: 'Operating Systems',
    examTypeId: 1,
    examTypeName: 'Midterm',
    sessionId: 2,
    sessionName: '2025-26',
    isOpenBook: true,
    policyId: 1,
    policyName: 'Teacher Resources Only',
    durationMinutes: 120,
    totalMarks: 50,
    passMarks: 20,
    attemptLimit: 1,
    scheduledDate: '2026-07-10',
    startTime: '14:00',
    endTime: '16:00',
    gracePeriodMinutes: 5,
    description: 'Midterm exam for OS',
    instructions: 'Answer all questions.',
    status: 'in_progress',
    createdBy: 3,
    createdByName: 'Prof. Verma',
    createdAt: '2026-06-01',
    updatedAt: '2026-06-01',
  },
  {
    id: 5,
    title: 'Computer Networks Practical',
    courseId: 5,
    courseName: 'Computer Networks',
    subjectName: 'Computer Networks',
    examTypeId: 4,
    examTypeName: 'Practical',
    sessionId: 2,
    sessionName: '2025-26',
    isOpenBook: false,
    durationMinutes: 60,
    totalMarks: 30,
    passMarks: 12,
    attemptLimit: 1,
    scheduledDate: '2026-06-25',
    startTime: '09:00',
    endTime: '10:00',
    gracePeriodMinutes: 0,
    description: 'Network configuration practical',
    instructions: 'Perform the tasks on the provided network setup.',
    status: 'published',
    createdBy: 4,
    createdByName: 'Dr. Patel',
    createdAt: '2026-05-15',
    updatedAt: '2026-05-15',
  },
  {
    id: 6,
    title: 'Machine Learning Open Book Exam',
    courseId: 6,
    courseName: 'Machine Learning',
    subjectName: 'Machine Learning',
    examTypeId: 2,
    examTypeName: 'Final',
    sessionId: 2,
    sessionName: '2025-26',
    isOpenBook: true,
    policyId: 3,
    policyName: 'All Resources (Open)',
    durationMinutes: 180,
    totalMarks: 100,
    passMarks: 40,
    attemptLimit: 1,
    scheduledDate: '2026-08-15',
    startTime: '10:00',
    endTime: '13:00',
    gracePeriodMinutes: 10,
    description: 'Open book final exam for ML',
    instructions: 'Case study based. All resources allowed.',
    status: 'registration_open',
    createdBy: 4,
    createdByName: 'Dr. Patel',
    createdAt: '2026-06-10',
    updatedAt: '2026-06-10',
  },
  {
    id: 7,
    title: 'Software Engineering Viva',
    courseId: 7,
    courseName: 'Software Engineering',
    subjectName: 'Software Engineering',
    examTypeId: 5,
    examTypeName: 'Viva',
    sessionId: 2,
    sessionName: '2025-26',
    isOpenBook: false,
    durationMinutes: 15,
    totalMarks: 20,
    passMarks: 8,
    attemptLimit: 1,
    scheduledDate: '2026-07-05',
    startTime: '09:00',
    endTime: '17:00',
    gracePeriodMinutes: 0,
    description: 'Oral viva examination',
    instructions: 'Slots will be allocated individually.',
    status: 'draft',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
  },
];

export const mockRegistrations: ExamRegistration[] = [
  {
    id: 1,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    subjectName: 'Data Structures',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    registeredAt: '2026-02-20',
    status: 'registered',
  },
  {
    id: 2,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    subjectName: 'Data Structures',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    registeredAt: '2026-02-20',
    status: 'registered',
  },
  {
    id: 3,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    subjectName: 'Data Structures',
    studentId: 10,
    studentName: 'Arjun Singh',
    rollNo: '2024003',
    registeredAt: '2026-02-21',
    status: 'registered',
  },
  {
    id: 4,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    subjectName: 'Data Structures',
    studentId: 11,
    studentName: 'Sneha Patel',
    rollNo: '2024004',
    registeredAt: '2026-02-21',
    status: 'registered',
  },
  {
    id: 5,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    subjectName: 'Data Structures',
    studentId: 12,
    studentName: 'Vikram Rao',
    rollNo: '2024005',
    registeredAt: '2026-02-22',
    status: 'withdrawn',
  },
  {
    id: 6,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    subjectName: 'Algorithms',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    registeredAt: '2026-04-01',
    status: 'registered',
  },
  {
    id: 7,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    subjectName: 'Algorithms',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    registeredAt: '2026-04-01',
    status: 'registered',
  },
  {
    id: 8,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    subjectName: 'Algorithms',
    studentId: 10,
    studentName: 'Arjun Singh',
    rollNo: '2024003',
    registeredAt: '2026-04-02',
    status: 'registered',
  },
  {
    id: 9,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    subjectName: 'Algorithms',
    studentId: 11,
    studentName: 'Sneha Patel',
    rollNo: '2024004',
    registeredAt: '2026-04-02',
    status: 'registered',
  },
  {
    id: 10,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    subjectName: 'Algorithms',
    studentId: 12,
    studentName: 'Vikram Rao',
    rollNo: '2024005',
    registeredAt: '2026-04-03',
    status: 'registered',
  },
  {
    id: 11,
    examId: 6,
    examTitle: 'Machine Learning Open Book Exam',
    subjectName: 'Machine Learning',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    registeredAt: '2026-06-15',
    status: 'registered',
  },
  {
    id: 13,
    examId: 4,
    examTitle: 'Operating Systems Midterm',
    subjectName: 'Operating Systems',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    registeredAt: '2026-06-25',
    status: 'registered',
  },
  {
    id: 14,
    examId: 4,
    examTitle: 'Operating Systems Midterm',
    subjectName: 'Operating Systems',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    registeredAt: '2026-06-25',
    status: 'registered',
  },
  {
    id: 12,
    examId: 6,
    examTitle: 'Machine Learning Open Book Exam',
    subjectName: 'Machine Learning',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    registeredAt: '2026-06-15',
    status: 'registered',
  },
];

export const mockEligibilityResults: EligibilityResult[] = [
  {
    id: 1,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    attendancePct: 85,
    cgpa: 8.5,
    feeCleared: true,
    backlogCount: 0,
    overall: 'eligible',
    reason: '',
  },
  {
    id: 2,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    attendancePct: 92,
    cgpa: 9.2,
    feeCleared: true,
    backlogCount: 0,
    overall: 'eligible',
    reason: '',
  },
  {
    id: 3,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 10,
    studentName: 'Arjun Singh',
    rollNo: '2024003',
    attendancePct: 68,
    cgpa: 7.0,
    feeCleared: true,
    backlogCount: 1,
    overall: 'ineligible',
    reason: 'Attendance below 75%',
  },
  {
    id: 4,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 11,
    studentName: 'Sneha Patel',
    rollNo: '2024004',
    attendancePct: 78,
    cgpa: 8.8,
    feeCleared: false,
    backlogCount: 0,
    overall: 'ineligible',
    reason: 'Fee not cleared',
  },
  {
    id: 5,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 12,
    studentName: 'Vikram Rao',
    rollNo: '2024005',
    attendancePct: 90,
    cgpa: 6.5,
    feeCleared: true,
    backlogCount: 3,
    overall: 'ineligible',
    reason: 'Exceeded max backlogs (4 allowed)',
  },
];

export const mockAdmitCards: AdmitCard[] = [
  {
    id: 1,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    programName: 'B.Tech Computer Science',
    date: '2026-03-15',
    time: '10:00 - 12:00',
    venue: 'Room 101, Block A',
    generatedAt: '2026-03-01',
  },
  {
    id: 2,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    programName: 'B.Tech Computer Science',
    date: '2026-03-15',
    time: '10:00 - 12:00',
    venue: 'Room 101, Block A',
    generatedAt: '2026-03-01',
  },
  {
    id: 3,
    examId: 4,
    examTitle: 'Operating Systems Midterm',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    programName: 'B.Tech Computer Science',
    date: '2026-06-25',
    time: '14:00 - 16:00',
    venue: 'Online Platform',
    generatedAt: '2026-06-20',
  },
  {
    id: 4,
    examId: 4,
    examTitle: 'Operating Systems Midterm',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    programName: 'B.Tech Computer Science',
    date: '2026-06-25',
    time: '14:00 - 16:00',
    venue: 'Online Platform',
    generatedAt: '2026-06-20',
  },
];

export const mockQuestions: Question[] = [
  {
    id: 1,
    subjectId: 1,
    subjectName: 'Data Structures',
    type: 'mcq',
    questionText:
      'What is the time complexity of inserting an element at the beginning of a linked list?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correctAnswer: '0',
    marks: 2,
    bloomLevel: 1,
    difficulty: 'easy',
    topic: 'Linked Lists',
    mediaUrls: [],
    usageCount: 5,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-01-15',
    version: 1,
  },
  {
    id: 2,
    subjectId: 1,
    subjectName: 'Data Structures',
    type: 'mcq',
    questionText: 'Which data structure uses FIFO principle?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    correctAnswer: '1',
    marks: 2,
    bloomLevel: 1,
    difficulty: 'easy',
    topic: 'Queues',
    mediaUrls: [],
    usageCount: 8,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-01-15',
    version: 1,
  },
  {
    id: 3,
    subjectId: 1,
    subjectName: 'Data Structures',
    type: 'short_answer',
    questionText:
      'Explain the difference between a stack and a queue with real-world examples.',
    marks: 5,
    bloomLevel: 2,
    difficulty: 'medium',
    topic: 'Stacks & Queues',
    mediaUrls: [],
    usageCount: 3,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-01-20',
    version: 1,
  },
  {
    id: 4,
    subjectId: 1,
    subjectName: 'Data Structures',
    type: 'long_answer',
    questionText:
      "Write an algorithm to detect a cycle in a linked list. Explain Floyd's cycle detection algorithm with a diagram.",
    marks: 10,
    bloomLevel: 3,
    difficulty: 'hard',
    topic: 'Linked Lists',
    mediaUrls: [],
    usageCount: 2,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-01-25',
    version: 1,
  },
  {
    id: 5,
    subjectId: 1,
    subjectName: 'Data Structures',
    type: 'coding',
    questionText: 'Implement a function to reverse a linked list in Python.',
    marks: 8,
    bloomLevel: 3,
    difficulty: 'medium',
    topic: 'Linked Lists',
    mediaUrls: ['code/python/sample.py'],
    usageCount: 4,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-02-01',
    version: 1,
  },
  {
    id: 6,
    subjectId: 2,
    subjectName: 'Algorithms',
    type: 'mcq',
    questionText: 'What is the worst-case time complexity of Merge Sort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctAnswer: '1',
    marks: 2,
    bloomLevel: 1,
    difficulty: 'easy',
    topic: 'Sorting',
    mediaUrls: [],
    usageCount: 10,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-02-10',
    version: 1,
  },
  {
    id: 7,
    subjectId: 2,
    subjectName: 'Algorithms',
    type: 'mcq',
    questionText:
      'Which algorithm is used to find the shortest path in an unweighted graph?',
    options: ['Dijkstra', 'BFS', 'DFS', 'Bellman-Ford'],
    correctAnswer: '1',
    marks: 2,
    bloomLevel: 2,
    difficulty: 'medium',
    topic: 'Graph Algorithms',
    mediaUrls: [],
    usageCount: 6,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-02-10',
    version: 1,
  },
  {
    id: 8,
    subjectId: 2,
    subjectName: 'Algorithms',
    type: 'case_study',
    questionText:
      'A social network wants to recommend friends. Given a graph where nodes are users and edges represent friendships:\n\na) Which graph traversal would you use to find friends-of-friends up to depth 3?\nb) What is the time complexity of your approach?\nc) How would you scale this to 1 billion users?',
    marks: 15,
    bloomLevel: 5,
    difficulty: 'hard',
    topic: 'Graph Algorithms',
    mediaUrls: [],
    usageCount: 1,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-02-15',
    version: 1,
  },
  {
    id: 9,
    subjectId: 2,
    subjectName: 'Algorithms',
    type: 'long_answer',
    questionText:
      'Compare and contrast Dynamic Programming and Divide-and-Conquer strategies. Provide two problems for each approach.',
    marks: 10,
    bloomLevel: 4,
    difficulty: 'medium',
    topic: 'Algorithm Paradigms',
    mediaUrls: [],
    usageCount: 3,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-02-20',
    version: 1,
  },
  {
    id: 10,
    subjectId: 2,
    subjectName: 'Algorithms',
    type: 'true_false',
    questionText:
      'A hash table with chaining has a worst-case lookup time of O(n).',
    marks: 1,
    bloomLevel: 2,
    difficulty: 'easy',
    topic: 'Hashing',
    mediaUrls: [],
    usageCount: 7,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-02-20',
    version: 1,
  },
  {
    id: 11,
    subjectId: 1,
    subjectName: 'Data Structures',
    type: 'mcq',
    questionText: 'What is the height of a balanced binary tree with n nodes?',
    options: ['O(log n)', 'O(n)', 'O(√n)', 'O(1)'],
    correctAnswer: '0',
    marks: 2,
    bloomLevel: 2,
    difficulty: 'medium',
    topic: 'Trees',
    mediaUrls: [],
    usageCount: 4,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-02-01',
    version: 1,
  },
  {
    id: 12,
    subjectId: 1,
    subjectName: 'Data Structures',
    type: 'coding',
    questionText:
      'Write a function to check if a binary tree is a valid Binary Search Tree.',
    marks: 10,
    bloomLevel: 4,
    difficulty: 'hard',
    topic: 'Trees',
    mediaUrls: [],
    usageCount: 2,
    status: 'active',
    createdBy: 2,
    createdByName: 'Dr. Sharma',
    createdAt: '2026-02-05',
    version: 1,
  },
  {
    id: 13,
    subjectId: 3,
    subjectName: 'Database Systems',
    type: 'mcq',
    questionText: 'Which normal form eliminates transitive dependencies?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswer: '2',
    marks: 2,
    bloomLevel: 2,
    difficulty: 'medium',
    topic: 'Normalization',
    mediaUrls: [],
    usageCount: 5,
    status: 'active',
    createdBy: 3,
    createdByName: 'Prof. Verma',
    createdAt: '2026-03-01',
    version: 1,
  },
  {
    id: 14,
    subjectId: 3,
    subjectName: 'Database Systems',
    type: 'short_answer',
    questionText:
      'Write an SQL query to find the second highest salary from an Employee table.',
    marks: 5,
    bloomLevel: 3,
    difficulty: 'medium',
    topic: 'SQL',
    mediaUrls: [],
    usageCount: 6,
    status: 'active',
    createdBy: 3,
    createdByName: 'Prof. Verma',
    createdAt: '2026-03-05',
    version: 1,
  },
  {
    id: 15,
    subjectId: 3,
    subjectName: 'Database Systems',
    type: 'coding',
    questionText:
      'Create a stored procedure to transfer funds between two bank accounts with transaction handling.',
    marks: 12,
    bloomLevel: 4,
    difficulty: 'hard',
    topic: 'PL/SQL',
    mediaUrls: [],
    usageCount: 1,
    status: 'active',
    createdBy: 3,
    createdByName: 'Prof. Verma',
    createdAt: '2026-03-10',
    version: 1,
  },
  {
    id: 16,
    subjectId: 6,
    subjectName: 'Machine Learning',
    type: 'case_study',
    questionText:
      'You are given a dataset of customer purchases with 100 features and 50,000 samples:\n\na) Which dimensionality reduction technique would you use and why?\nb) How would you handle missing values?\nc) Which classification algorithm would you choose for predicting customer churn?\nd) How would you evaluate model performance?',
    marks: 20,
    bloomLevel: 5,
    difficulty: 'expert',
    topic: 'Classification',
    mediaUrls: [],
    usageCount: 0,
    status: 'active',
    createdBy: 4,
    createdByName: 'Dr. Patel',
    createdAt: '2026-04-01',
    version: 1,
  },
  {
    id: 17,
    subjectId: 6,
    subjectName: 'Machine Learning',
    type: 'mcq',
    questionText:
      'Which of the following is NOT a supervised learning algorithm?',
    options: ['Linear Regression', 'K-Means', 'Decision Tree', 'SVM'],
    correctAnswer: '1',
    marks: 2,
    bloomLevel: 1,
    difficulty: 'easy',
    topic: 'ML Basics',
    mediaUrls: [],
    usageCount: 3,
    status: 'active',
    createdBy: 4,
    createdByName: 'Dr. Patel',
    createdAt: '2026-04-05',
    version: 1,
  },
  {
    id: 18,
    subjectId: 6,
    subjectName: 'Machine Learning',
    type: 'assertion_reason',
    questionText:
      'Assertion (A): SVM with RBF kernel can learn non-linear decision boundaries.\nReason (R): RBF kernel maps data to a higher-dimensional space.',
    marks: 3,
    bloomLevel: 3,
    difficulty: 'medium',
    topic: 'SVM',
    mediaUrls: [],
    usageCount: 1,
    status: 'active',
    createdBy: 4,
    createdByName: 'Dr. Patel',
    createdAt: '2026-04-10',
    version: 1,
  },
];

export const mockQuestionPapers: QuestionPaper[] = [
  {
    id: 1,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    subjectName: 'Data Structures',
    totalMarks: 50,
    sections: [
      {
        name: 'Part A - Multiple Choice',
        questionIds: [1, 2, 11],
        marksPerQuestion: 2,
        totalMarks: 6,
      },
      {
        name: 'Part B - Short Answer',
        questionIds: [3],
        marksPerQuestion: 5,
        totalMarks: 5,
      },
      {
        name: 'Part C - Long Answer',
        questionIds: [4, 5],
        marksPerQuestion: 8,
        totalMarks: 16,
      },
    ],
    bloomDistribution: { 1: 12, 2: 20, 3: 40, 4: 28, 5: 0, 6: 0 },
    status: 'published',
    createdAt: '2026-03-01',
  },
  {
    id: 2,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    subjectName: 'Algorithms',
    totalMarks: 100,
    sections: [
      {
        name: 'Section A - MCQ & True/False',
        questionIds: [6, 7, 10],
        marksPerQuestion: 2,
        totalMarks: 6,
      },
      {
        name: 'Section B - Long Answer',
        questionIds: [9],
        marksPerQuestion: 10,
        totalMarks: 10,
      },
      {
        name: 'Section C - Case Study',
        questionIds: [8],
        marksPerQuestion: 15,
        totalMarks: 15,
      },
    ],
    bloomDistribution: { 1: 15, 2: 25, 3: 30, 4: 20, 5: 10, 6: 0 },
    status: 'published',
    createdAt: '2026-04-15',
  },
];

export const mockQuestionPaperSets: QuestionPaperSet[] = [
  {
    id: 1,
    paperId: 1,
    setCode: 'A',
    questionIds: [1, 2, 11, 3, 4, 5],
    totalMarks: 27,
  },
  {
    id: 2,
    paperId: 1,
    setCode: 'B',
    questionIds: [2, 11, 1, 3, 5, 4],
    totalMarks: 27,
  },
  {
    id: 3,
    paperId: 2,
    setCode: 'A',
    questionIds: [6, 7, 10, 9, 8],
    totalMarks: 31,
  },
];

export const mockStudyMaterials: StudyMaterial[] = [
  {
    id: 1,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    uploadedBy: 2,
    uploaderName: 'Dr. Sharma',
    type: 'teacher',
    title: 'DS Textbook Chapter 3-5',
    fileUrl: '/materials/ds-ch3-5.pdf',
    fileType: 'pdf',
    fileSize: 2500,
    category: 'Textbook',
    isRestricted: true,
    status: 'approved',
    uploadedAt: '2026-02-15',
  },
  {
    id: 2,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    uploadedBy: 2,
    uploaderName: 'Dr. Sharma',
    type: 'teacher',
    title: 'Linked List Cheatsheet',
    fileUrl: '/materials/ll-cheatsheet.pdf',
    fileType: 'pdf',
    fileSize: 500,
    category: 'Notes',
    isRestricted: false,
    status: 'approved',
    uploadedAt: '2026-02-20',
  },
  {
    id: 3,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    uploadedBy: 8,
    uploaderName: 'Rohan Mehta',
    type: 'student',
    title: 'My Tree Notes',
    fileUrl: '/materials/rohan-trees.pdf',
    fileType: 'pdf',
    fileSize: 800,
    category: 'Notes',
    isRestricted: false,
    status: 'approved',
    uploadedAt: '2026-02-25',
  },
  {
    id: 4,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    uploadedBy: 9,
    uploaderName: 'Priya Sharma',
    type: 'student',
    title: 'Graph Summary',
    fileUrl: '/materials/priya-graphs.pdf',
    fileType: 'pdf',
    fileSize: 600,
    category: 'Notes',
    isRestricted: false,
    status: 'pending',
    uploadedAt: '2026-03-01',
  },
  {
    id: 5,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    uploadedBy: 2,
    uploaderName: 'Dr. Sharma',
    type: 'teacher',
    title: 'Algorithm Design Manual Ch 4-7',
    fileUrl: '/materials/alg-ch4-7.pdf',
    fileType: 'pdf',
    fileSize: 3200,
    category: 'Textbook',
    isRestricted: true,
    status: 'approved',
    uploadedAt: '2026-04-01',
  },
  {
    id: 6,
    examId: 6,
    examTitle: 'Machine Learning Open Book Exam',
    uploadedBy: 4,
    uploaderName: 'Dr. Patel',
    type: 'teacher',
    title: 'ML Reference Notes',
    fileUrl: '/materials/ml-notes.pdf',
    fileType: 'pdf',
    fileSize: 1800,
    category: 'Notes',
    isRestricted: false,
    status: 'approved',
    uploadedAt: '2026-06-01',
  },
  {
    id: 7,
    examId: 6,
    examTitle: 'Machine Learning Open Book Exam',
    uploadedBy: 4,
    uploaderName: 'Dr. Patel',
    type: 'teacher',
    title: 'Scikit-learn Documentation',
    fileUrl: 'https://scikit-learn.org/stable/',
    externalLink: 'https://scikit-learn.org/stable/',
    fileType: 'link',
    fileSize: 0,
    category: 'Reference',
    isRestricted: false,
    status: 'approved',
    uploadedAt: '2026-06-01',
  },
];

export const mockMaterialApprovals: MaterialApproval[] = [
  {
    id: 1,
    materialId: 3,
    materialTitle: 'My Tree Notes',
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    status: 'approved',
    reviewNote: 'Good notes, approved.',
    reviewedBy: 2,
    reviewedAt: '2026-02-26',
    submittedAt: '2026-02-25',
  },
  {
    id: 2,
    materialId: 4,
    materialTitle: 'Graph Summary',
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    status: 'pending',
    submittedAt: '2026-03-01',
  },
];

export const mockAttempts: ExamAttempt[] = [
  {
    id: 1,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    startTime: '2026-03-15T10:00:00',
    endTime: '2026-03-15T11:45:00',
    status: 'submitted',
    tabSwitchCount: 0,
    autoSaveVersion: 12,
    submittedAt: '2026-03-15T11:45:00',
  },
  {
    id: 2,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    startTime: '2026-03-15T10:00:00',
    endTime: '2026-03-15T11:50:00',
    status: 'submitted',
    tabSwitchCount: 1,
    autoSaveVersion: 15,
    submittedAt: '2026-03-15T11:50:00',
  },
  {
    id: 3,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 10,
    studentName: 'Arjun Singh',
    rollNo: '2024003',
    startTime: '2026-03-15T10:00:00',
    status: 'in_progress',
    tabSwitchCount: 2,
    autoSaveVersion: 8,
  },
  {
    id: 4,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    startTime: '2026-05-20T09:00:00',
    status: 'in_progress',
    tabSwitchCount: 0,
    autoSaveVersion: 5,
  },
  {
    id: 5,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    startTime: '2026-05-20T09:00:00',
    status: 'in_progress',
    tabSwitchCount: 0,
    autoSaveVersion: 3,
  },
  {
    id: 6,
    examId: 4,
    examTitle: 'Operating Systems Midterm',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    startTime: '2026-06-25T14:00:00',
    status: 'in_progress',
    tabSwitchCount: 1,
    autoSaveVersion: 2,
  },
];

export const mockStudentAnswers: StudentAnswer[] = [
  {
    id: 1,
    attemptId: 1,
    questionId: 1,
    questionText: 'What is the time complexity of inserting...?',
    questionType: 'mcq',
    answerText: '0',
    marksObtained: 2,
    maxMarks: 2,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-03-18',
    remarks: 'Correct',
    isFlagged: false,
  },
  {
    id: 2,
    attemptId: 1,
    questionId: 2,
    questionText: 'Which data structure uses FIFO principle?',
    questionType: 'mcq',
    answerText: '1',
    marksObtained: 2,
    maxMarks: 2,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-03-18',
    remarks: 'Correct',
    isFlagged: false,
  },
  {
    id: 3,
    attemptId: 1,
    questionId: 3,
    questionText: 'Explain the difference between a stack and a queue...',
    questionType: 'short_answer',
    answerText:
      'A stack follows LIFO (Last In First Out) principle, like a pile of plates. A queue follows FIFO (First In First Out) principle, like a line at a ticket counter. Real-world example: Stack - browser back button, Queue - printer queue.',
    marksObtained: 4,
    maxMarks: 5,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-03-18',
    remarks: 'Good explanation, missing one real-world example',
    isFlagged: false,
  },
  {
    id: 4,
    attemptId: 1,
    questionId: 4,
    questionText: 'Write an algorithm to detect a cycle in a linked list...',
    questionType: 'long_answer',
    answerText:
      "Floyd's cycle detection algorithm uses two pointers - slow and fast. Slow moves one step, fast moves two steps. If they meet, there is a cycle.",
    marksObtained: 7,
    maxMarks: 10,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-03-19',
    remarks: 'Correct approach, diagram missing',
    isFlagged: false,
  },
  {
    id: 5,
    attemptId: 1,
    questionId: 5,
    questionText: 'Implement a function to reverse a linked list in Python.',
    questionType: 'coding',
    answerText:
      'def reverse(head):\n    prev = None\n    curr = head\n    while curr:\n        next = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next\n    return prev',
    marksObtained: 7,
    maxMarks: 8,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-03-19',
    remarks: 'Correct iterative solution, edge cases not handled',
    isFlagged: false,
  },
  {
    id: 6,
    attemptId: 2,
    questionId: 1,
    questionText: 'What is the time complexity of inserting...?',
    questionType: 'mcq',
    answerText: '0',
    marksObtained: 2,
    maxMarks: 2,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-03-18',
    remarks: 'Correct',
    isFlagged: false,
  },
  {
    id: 7,
    attemptId: 2,
    questionId: 2,
    questionText: 'Which data structure uses FIFO principle?',
    questionType: 'mcq',
    answerText: '1',
    marksObtained: 2,
    maxMarks: 2,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-03-18',
    remarks: 'Correct',
    isFlagged: false,
  },
  {
    id: 8,
    attemptId: 2,
    questionId: 3,
    questionText: 'Explain the difference between a stack and a queue...',
    questionType: 'short_answer',
    answerText:
      'Stack is LIFO. Queue is FIFO. Example: Stack - undo operation, Queue - CPU scheduling.',
    marksObtained: 5,
    maxMarks: 5,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-03-18',
    remarks: 'Excellent answer with examples',
    isFlagged: false,
  },
];

export const mockRubrics: Rubric[] = [
  {
    id: 1,
    name: 'Algorithm Explanation',
    questionId: 4,
    criteria: [
      {
        name: 'Algorithm Logic',
        description: 'Correctness of the algorithm described',
        maxMarks: 4,
      },
      {
        name: 'Complexity Analysis',
        description: 'Time and space complexity mentioned',
        maxMarks: 2,
      },
      {
        name: 'Diagram',
        description: 'Visual representation of the algorithm',
        maxMarks: 2,
      },
      {
        name: 'Clarity',
        description: 'Clear explanation and examples',
        maxMarks: 2,
      },
    ],
    totalMarks: 10,
  },
  {
    id: 2,
    name: 'Coding Solution',
    questionId: 5,
    criteria: [
      {
        name: 'Correctness',
        description: 'Solution produces correct output for all cases',
        maxMarks: 4,
      },
      {
        name: 'Efficiency',
        description: 'Optimal time and space complexity',
        maxMarks: 2,
      },
      {
        name: 'Code Quality',
        description: 'Readable, well-structured code',
        maxMarks: 1,
      },
      {
        name: 'Edge Cases',
        description: 'Handles null, empty, single element cases',
        maxMarks: 1,
      },
    ],
    totalMarks: 8,
  },
];

export const mockEvaluations: Evaluation[] = [
  {
    id: 1,
    attemptId: 1,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    totalMarks: 27,
    marksAwarded: 22,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-03-19',
    status: 'completed',
  },
  {
    id: 2,
    attemptId: 2,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    totalMarks: 27,
    marksAwarded: 25,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-03-19',
    status: 'completed',
  },
  {
    id: 3,
    attemptId: 3,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 10,
    studentName: 'Arjun Singh',
    rollNo: '2024003',
    totalMarks: 27,
    marksAwarded: 0,
    status: 'pending',
  },
  {
    id: 4,
    attemptId: 4,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    totalMarks: 50,
    marksAwarded: 0,
    status: 'pending',
  },
  {
    id: 5,
    attemptId: 5,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    totalMarks: 50,
    marksAwarded: 45,
    evaluatedBy: 2,
    evaluatedByName: 'Dr. Sharma',
    evaluatedAt: '2026-06-25',
    status: 'completed',
  },
  {
    id: 6,
    attemptId: 6,
    examId: 2,
    examTitle: 'Algorithms Final Exam',
    studentId: 10,
    studentName: 'Arjun Singh',
    rollNo: '2024003',
    totalMarks: 50,
    marksAwarded: 0,
    evaluatedBy: 3,
    evaluatedByName: 'Prof. Gupta',
    evaluatedAt: '2026-06-26',
    status: 'in_progress',
  },
];

export const mockModerationRecords: ModerationRecord[] = [
  {
    id: 1,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    flaggedBy: 2,
    flaggedByName: 'Dr. Sharma',
    reason: 'Answer pattern unusually similar to another student',
    status: 'pending',
  },
];

export const mockResults: Result[] = [
  {
    id: 1,
    attemptId: 1,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    subjectName: 'Data Structures',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    totalMarksObtained: 22,
    totalMarks: 27,
    percentage: 81.48,
    grade: 'A',
    gradePoint: 8,
    isPassed: true,
    publishedAt: '2026-03-25',
    publishedBy: 'Admin User',
  },
  {
    id: 2,
    attemptId: 2,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    subjectName: 'Data Structures',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    totalMarksObtained: 25,
    totalMarks: 27,
    percentage: 92.59,
    grade: 'O',
    gradePoint: 10,
    isPassed: true,
    publishedAt: '2026-03-25',
    publishedBy: 'Admin User',
  },
  {
    id: 3,
    attemptId: 3,
    examId: 3,
    examTitle: 'Database Systems Quiz 1',
    subjectName: 'Database Systems',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    totalMarksObtained: 16,
    totalMarks: 20,
    percentage: 80,
    grade: 'A',
    gradePoint: 8,
    isPassed: true,
    publishedAt: '2026-04-12',
    publishedBy: 'Admin User',
  },
  {
    id: 4,
    attemptId: 4,
    examId: 3,
    examTitle: 'Database Systems Quiz 1',
    subjectName: 'Database Systems',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    totalMarksObtained: 18,
    totalMarks: 20,
    percentage: 90,
    grade: 'O',
    gradePoint: 10,
    isPassed: true,
    publishedAt: '2026-04-12',
    publishedBy: 'Admin User',
  },
];

export const mockRevaluationRequests: RevaluationRequest[] = [
  {
    id: 1,
    resultId: 1,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    subjectName: 'Data Structures',
    studentId: 8,
    studentName: 'Rohan Mehta',
    rollNo: '2024001',
    currentMarks: 22,
    reason:
      'Question 4 was partially correct but received low marks. I provided the correct algorithm description.',
    status: 'under_review',
    createdAt: '2026-03-28',
  },
  {
    id: 2,
    resultId: 2,
    examId: 1,
    examTitle: 'Data Structures Midterm',
    subjectName: 'Data Structures',
    studentId: 9,
    studentName: 'Priya Sharma',
    rollNo: '2024002',
    currentMarks: 25,
    reason:
      'Requesting recheck for Question 5 - my code handles edge cases correctly.',
    status: 'pending',
    createdAt: '2026-04-01',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: 8,
    title: 'Exam Reminder',
    message: 'Data Structures Midterm is tomorrow at 10:00 AM.',
    type: 'exam_reminder',
    isRead: true,
    createdAt: '2026-03-14',
  },
  {
    id: 2,
    userId: 8,
    title: 'Resource Approved',
    message:
      'Your notes "My Tree Notes" have been approved for Data Structures Midterm.',
    type: 'resource_approved',
    isRead: true,
    createdAt: '2026-02-26',
  },
  {
    id: 3,
    userId: 8,
    title: 'Result Published',
    message: 'Your result for Data Structures Midterm is now available.',
    type: 'result_published',
    isRead: false,
    createdAt: '2026-03-25',
  },
  {
    id: 4,
    userId: 8,
    title: 'Revaluation Update',
    message:
      'Your revaluation request for Data Structures Midterm is under review.',
    type: 'revaluation_update',
    isRead: false,
    createdAt: '2026-03-29',
  },
  {
    id: 5,
    userId: 9,
    title: 'Exam Reminder',
    message: 'Data Structures Midterm is tomorrow at 10:00 AM.',
    type: 'exam_reminder',
    isRead: true,
    createdAt: '2026-03-14',
  },
  {
    id: 6,
    userId: 9,
    title: 'Result Published',
    message: 'Your result for Data Structures Midterm is now available.',
    type: 'result_published',
    isRead: false,
    createdAt: '2026-03-25',
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    tableName: 'exams',
    recordId: 1,
    action: 'INSERT',
    newValues: { title: 'Data Structures Midterm' },
    performedBy: 2,
    performedByName: 'Dr. Sharma',
    ipAddress: '192.168.1.10',
    timestamp: '2026-02-01T10:00:00',
  },
  {
    id: 2,
    tableName: 'exams',
    recordId: 1,
    action: 'UPDATE',
    oldValues: { status: 'draft' },
    newValues: { status: 'published' },
    performedBy: 2,
    performedByName: 'Dr. Sharma',
    ipAddress: '192.168.1.10',
    timestamp: '2026-02-15T14:30:00',
  },
  {
    id: 3,
    tableName: 'results',
    recordId: 1,
    action: 'INSERT',
    newValues: { studentId: 8, totalMarksObtained: 22 },
    performedBy: 1,
    performedByName: 'Admin User',
    ipAddress: '192.168.1.5',
    timestamp: '2026-03-25T09:00:00',
  },
  {
    id: 4,
    tableName: 'question_bank',
    recordId: 16,
    action: 'INSERT',
    newValues: { type: 'case_study', subjectId: 6 },
    performedBy: 4,
    performedByName: 'Dr. Patel',
    ipAddress: '192.168.1.20',
    timestamp: '2026-04-01T11:00:00',
  },
  {
    id: 5,
    tableName: 'revaluation_requests',
    recordId: 1,
    action: 'INSERT',
    newValues: { studentId: 8, reason: 'Question 4...' },
    performedBy: 8,
    performedByName: 'Rohan Mehta',
    ipAddress: '192.168.1.15',
    timestamp: '2026-03-28T16:00:00',
  },
];

export const mockSystemConfig: SystemConfig = {
  id: 1,
  defaultPassPct: 40,
  minAttendancePct: 75,
  maxBacklogs: 4,
  maxFileSizeMB: 10,
  autoSaveIntervalSec: 30,
  tabSwitchLimit: 3,
  revaluationWindowDays: 10,
  gracePeriodMinutes: 5,
};

export const mockDashboardStats: DashboardStats = {
  totalExams: 7,
  activeExams: 2,
  totalStudents: 5,
  registeredStudents: 12,
  submittedCount: 2,
  pendingEvaluation: 1,
  publishedResults: 2,
  passRate: 85,
};

// ─── Helper: Get student by ID ───
export function getStudentById(id: number) {
  return mockUsers.find(u => u.id === id && u.role === 'student');
}

// ─── Helper: Get teacher by ID ───
export function getTeacherById(id: number) {
  return mockUsers.find(u => u.id === id && u.role === 'teacher');
}

// ─── Helper: Get exam by ID ───
export function getExamById(id: number) {
  return mockExams.find(e => e.id === id);
}

// ─── Helper: Filter questions by subject ───
export function getQuestionsBySubject(subjectId: number) {
  return mockQuestions.filter(q => q.subjectId === subjectId);
}

// ─── Helper: Get attempts for an exam ───
export function getAttemptsByExam(examId: number) {
  return mockAttempts.filter(a => a.examId === examId);
}
