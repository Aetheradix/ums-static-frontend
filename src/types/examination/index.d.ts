declare namespace Examination {
  // ─── Exam Type ───
  interface ExamTypeForm {
    code: string;
    name: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
  }
  type ExamTypeItem = Data.WithId<ExamTypeForm>;

  // ─── Exam Cycle ───
  interface ExamCycleForm {
    name: string;
    month: number;
    year: number;
    sortOrder: number;
    status: 'Published' | 'Draft';
  }
  type ExamCycleItem = Data.WithId<ExamCycleForm>;

  // ─── Time Slot ───
  interface TimeSlotForm {
    shiftName: string;
    reportingTime: string;
    startTime: string;
    endTime: string;
    status: 'Published' | 'Draft';
    sortOrder: number;
  }
  type TimeSlotItem = Data.WithId<TimeSlotForm>;

  // ─── Session Template ───
  interface SessionTemplateForm {
    code: string;
    applicableYear: number;
    applicableCycleId: number | '';
    applicableCycleName?: string;
    templateName: string;
    description?: string;
    isDefault: boolean;
    status: 'Published' | 'Draft';
  }
  type SessionTemplateItem = Data.WithId<SessionTemplateForm>;

  // ─── Exam Center ───
  interface ExamCenterForm {
    centerCode: string;
    centerName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    contactPerson?: string;
    contactPhone?: string;
    totalCapacity: number;
    isActive: boolean;
  }
  type ExamCenterItem = Data.WithId<ExamCenterForm>;

  // ─── Hall / Room ───
  interface HallForm {
    centerId: number;
    centerName?: string;
    hallCode: string;
    hallName: string;
    floor?: string;
    capacity: number;
    hallType?: string;
    isActive: boolean;
  }
  type HallItem = Data.WithId<HallForm>;

  // ─── Duty Type ───
  interface DutyTypeForm {
    code: string;
    name: string;
    description?: string;
    maxPerSession?: number;
    isActive: boolean;
  }
  type DutyTypeItem = Data.WithId<DutyTypeForm>;

  // ─── Admit Card Template ───
  interface AdmitCardTemplateForm {
    templateCode: string;
    templateName: string;
    applicableCycleId: number | '';
    applicableCycleName?: string;
    applicableFromYear: number;
    orientation: 'Portrait' | 'Landscape';
    isDefault: boolean;
    status: 'Published' | 'Draft';
  }
  type AdmitCardTemplateItem = Data.WithId<AdmitCardTemplateForm>;

  // ─── Fee Structure ───
  interface ExamFeeForm {
    programId: number;
    programName?: string;
    termNo: number;
    termType: 'Semester' | 'Year';
    applicableFromYear: number;
    applicableCycleId: number;
    applicableCycleName?: string;
    feeConfigJSON: string;
    status: 'Published' | 'Draft';
  }
  type ExamFeeItem = Data.WithId<ExamFeeForm>;

  // ─── Late Fee Rule ───
  interface LateFeeForm {
    programId: number;
    programName?: string;
    termNo: number;
    termType: 'Semester' | 'Year';
    applicableFromYear: number;
    applicableCycleId: number;
    applicableCycleName?: string;
    lateFeeConfigJSON: string;
    status: 'Published' | 'Draft';
  }
  type LateFeeItem = Data.WithId<LateFeeForm>;

  // ─── Examination Session ───
  interface ExamSessionForm {
    sessionType: 'Regular' | 'Supplementary';
    academicYearSessionId: number;
    academicYearSessionName?: string;
    examinationYear: number;
    cycleId: number;
    cycleName?: string;
    sessionName: string;
    status: 'Active' | 'Inactive';
  }
  type ExamSessionItem = Data.WithId<ExamSessionForm>;

  // ─── Session Program ───
  interface SessionProgramForm {
    examSessionId: number;
    programId: number;
    programName?: string;
    termNo: number;
    termType: 'Semester' | 'Year';
    startDate: string;
    endDate: string;
    lateFeeDate?: string;
    adminLastDate?: string;
    feedbackRequired: boolean;
    status: 'Active' | 'Inactive';
  }
  type SessionProgramItem = Data.WithId<SessionProgramForm>;

  // ─── Student Application (exam form) ───
  interface StudentApplicationForm {
    examSessionId: number;
    studentId: string;
    subjects: Array<{
      subjectId: number;
      subjectName: string;
      subjectCode: string;
    }>;
    feeExempted: boolean;
    lateFeeApplicable: boolean;
  }
  interface StudentApplicationItem {
    id: number;
    studentName: string;
    rollNumber: string;
    enrollmentNumber: string;
    programName: string;
    termNo: number;
    status: 'Draft' | 'Submitted' | 'Verified' | 'Approved' | 'Rejected';
    submittedAt?: string;
  }

  // ─── Timetable entry ───
  interface TimetableItem {
    id: number;
    subjectCode: string;
    subjectName: string;
    examDate: string;
    slotId: number;
    slotName: string;
    startTime: string;
    endTime: string;
    centerId: number;
    centerName: string;
  }
  interface TimetableForm {
    subjectCode: string;
    subjectName: string;
    examDate: string;
    slotId: number;
    startTime: string;
    endTime: string;
    centerId: number;
  }

  // ─── Marks entry ───
  interface MarksEntryItem {
    id: number;
    studentName: string;
    rollNumber: string;
    subjectCode: string;
    subjectName: string;
    theoryMarks?: number;
    practicalMarks?: number;
    iaMarks?: number;
    totalMarks: number;
    maxMarks: number;
    status: 'Pending' | 'Submitted' | 'Verified' | 'Approved';
  }

  // ─── Result ───
  interface ResultItem {
    id: number;
    studentName: string;
    rollNumber: string;
    subjectCode: string;
    subjectName: string;
    obtainedMarks: number;
    maxMarks: number;
    grade: string;
    gradePoint: number;
    result: 'Pass' | 'Fail';
  }

  // ─── Revaluation ───
  interface RevaluationApplicationItem {
    id: number;
    studentName: string;
    rollNumber: string;
    subjectName: string;
    revalType: 'Revaluation' | 'Re-totaling' | 'Photocopy';
    status:
      | 'Applied'
      | 'Fee Verified'
      | 'Under Review'
      | 'Completed'
      | 'Revised Published'
      | 'Rejected';
    appliedDate: string;
  }

  // ─── Dashboard Stats ───
  interface DashboardStats {
    totalSessions: number;
    activeSessions: number;
    totalStudents: number;
    formsSubmitted: number;
    marksEntryProgress: number;
    resultsPublished: number;
    centersActive?: number;
    pendingApprovals?: number;
    marksBreakdown?: {
      theoryEntered: number;
      practicalEntered: number;
      iaEntered: number;
      verified: number;
      approved: number;
    };
    sessionStats?: {
      active: number;
      upcoming: number;
      completed: number;
    };
    upcomingDeadlines?: Array<{
      title: string;
      date: string;
      daysLeft: number;
      priority: 'high' | 'medium' | 'low';
    }>;
    recentActivities?: Array<{
      text: string;
      time: string;
      type: string;
    }>;
    programDistribution?: Array<{
      program: string;
      students: number;
    }>;
  }

  // ─── Question Paper ───
  interface QuestionPaperItem {
    id: number;
    examType: string;
    subject: string;
    course: string;
    semester: string;
    year: string;
    status: 'Draft' | 'Approved';
  }
  interface QuestionPaperForm {
    examType: string;
    subject: string;
    course: string;
    semester: string;
    year: string;
    status: 'Draft' | 'Approved';
  }

  // ─── Question Paper Pattern ───
  interface QuestionPaperPatternItem {
    id: number;
    subject: string;
    totalMarks: number;
    mcq: number;
    short: number;
    long: number;
    status: 'Active' | 'Inactive';
  }
  interface QuestionPaperPatternForm {
    subject: string;
    totalMarks: number;
    mcq: number;
    short: number;
    long: number;
    status: 'Active' | 'Inactive';
  }

  // ─── Evaluator ───
  interface EvaluatorItem {
    id: number;
    name: string;
    email: string;
    role: string;
    qualification: string;
    subjects: number;
    status: 'Active' | 'Inactive';
  }
  interface EvaluatorForm {
    name: string;
    email: string;
    role: string;
    qualification: string;
    subjects: number;
    status: 'Active' | 'Inactive';
  }

  // ─── Sheet Distribution ───
  interface SheetDistributionItem {
    id: number;
    evaluator: string;
    subject: string;
    totalSheets: number;
    assignedDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }
  interface SheetDistributionForm {
    evaluator: string;
    subject: string;
    totalSheets: number;
    assignedDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }

  // ─── Supplementary Session ───
  interface SupplementarySessionItem {
    id: number;
    sessionName: string;
    maxSubjects: number;
    feePerSubject: number;
    status: 'Draft' | 'Active';
  }

  interface SupplementarySessionForm {
    sessionName: string;
    maxSubjects: number;
    feePerSubject: number;
    status: 'Draft' | 'Active';
  }

  // ─── Duplicate Marksheet Application ───
  interface DuplicateApplicationItem {
    id: number;
    studentName: string;
    rollNo: string;
    program: string;
    reason: 'Damaged' | 'Lost' | 'Name Correction' | 'Other';
    status: 'Pending' | 'Approved' | 'Generated';
    appliedDate: string;
  }

  // ─── Generated Duplicate Marksheet ───
  interface GeneratedDuplicateItem {
    id: number;
    rollNo: string;
    name: string;
    exam: string;
    generatedDate: string;
    status: 'Ready' | 'Downloaded';
  }

  // ─── Grade Card Generation ───
  interface GradeCardGenerationItem {
    id: number;
    sessionName: string;
    program: string;
    semester?: string;
    publishedDate: string;
    totalCards: number;
    generated: number;
    status: 'Pending' | 'Completed';
  }

  // ─── Result Publication ───
  interface ResultPublicationItem {
    id: number;
    sessionName: string;
    program: string;
    semester: string;
    totalStudents: number;
    processed: number;
    status: 'Processing Pending' | 'Ready for Publication' | 'Published';
  }

  // ─── Moderation Rule ───
  interface ModerationRuleForm {
    rule: string;
    type: 'FLAT_ADD' | 'PERCENTAGE' | 'NORMALIZE';
    target: string;
  }
  interface ModerationRuleItem {
    id: number;
    rule: string;
    type: string;
    target: string;
    status: 'Active' | 'Inactive';
  }

  // ─── Revaluation Evaluation ───
  interface RevaluationEvaluationItem {
    id: number;
    subject: string;
    rollNo: string;
    oldMarks: number;
    newMarks: number | null;
    status: 'Pending Evaluation' | 'Evaluated';
  }

  // ─── Student Portal Types ───
  interface StudentInfo {
    name: string;
    rollNumber: string;
    enrollmentNumber: string;
    program: string;
    semester: number;
    batch: string;
    photoUrl?: string;
  }

  interface UpcomingExam {
    id: number;
    subject: string;
    subjectCode: string;
    date: string;
    time: string;
    hall: string;
  }

  interface StudentTimetableItem {
    id: number;
    subjectCode: string;
    subjectName: string;
    examDate: string;
    startTime: string;
    endTime: string;
    hall: string;
  }

  interface StudentResultItem {
    subjectCode: string;
    subjectName: string;
    obtainedMarks: number;
    maxMarks: number;
    grade: string;
    gradePoint: number;
    result: 'Pass' | 'Fail';
  }

  interface StudentGradeCardItem {
    id: number;
    sessionName: string;
    sgpa: number;
    cgpa: number;
    status: 'Published' | 'Pending';
    publishedDate: string;
  }

  interface StudentRevaluationItem {
    id: number;
    subjectName: string;
    subjectCode: string;
    revalType: string;
    status: string;
    appliedDate: string;
    fee: number;
  }

  interface StudentDuplicateItem {
    id: number;
    examName: string;
    reason: string;
    status: string;
    appliedDate: string;
    fee: number;
  }

  interface TrackApplicationItem {
    id: number;
    type: 'Exam Form' | 'Revaluation' | 'Duplicate Marksheet' | 'Supplementary';
    referenceNo: string;
    sessionName: string;
    status: string;
    appliedDate: string;
    lastUpdated: string;
  }

  // ─── Enhanced Student Dashboard Types ───
  interface StudentDashboardStats {
    currentSgpa: number;
    cgpa: number;
    totalExamsRegistered: number;
    attendancePercentage: number;
    backlogs: number;
    pendingFees: number;
    rank: number;
    totalStudents: number;
  }

  interface SgpaTrendItem {
    semester: number;
    sgpa: number;
  }

  interface SubjectMarksItem {
    subject: string;
    obtained: number;
    max: number;
  }

  interface AttendanceDataPoint {
    label: string;
    value: number;
    color: string;
  }

  interface StudentNotification {
    id: number;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    date: string;
  }

  // ─── Phase 3 Workflow Types ───
  interface AttendanceRollCallItem {
    id: number;
    studentName: string;
    rollNumber: string;
    subjectCode: string;
    status: 'Present' | 'Absent';
  }

  interface EligibilityItem {
    id: number;
    studentName: string;
    rollNumber: string;
    attendancePercentage: number;
    feePaid: boolean;
    prerequisitesMet: boolean;
    isEligible: boolean;
  }

  interface GradeBoundaryItem {
    grade: string;
    minScore: number;
    maxScore: number;
    point: number;
  }

  // ─── Phase 5 Workflow Types ───
  interface ReportsDashboard {
    overview: {
      totalStudents: number;
      appeared: number;
      passed: number;
      passPercentage: number;
      avgSgpa: number;
      atRisk: number;
      attendanceRate: number;
    };
    topPerformers: {
      rank: number;
      name: string;
      usn: string;
      sgpa: number;
      cgpa: number;
      semester: number;
      program: string;
    }[];
    gradeDistribution: {
      grade: string;
      count: number;
      minScore: number;
      maxScore: number;
      color: string;
    }[];
    failureAnalysis: {
      subject: string;
      enrollment: number;
      failed: number;
      failRate: number;
    }[];
    sgpaTrend: {
      semester: number;
      avgSgpa: number;
      maxSgpa: number;
      minSgpa: number;
    }[];
    enrollmentData: {
      program: string;
      students: number;
      appeared: number;
      passed: number;
      change: number;
    }[];
    attendanceBreakdown: { range: string; count: number; color: string }[];
    subjectPassRates: {
      all: {
        subject: string;
        code: string;
        passRate: number;
        enrollment: number;
        avgScore: number;
      }[];
      cse: {
        subject: string;
        code: string;
        passRate: number;
        enrollment: number;
        avgScore: number;
      }[];
      ece: {
        subject: string;
        code: string;
        passRate: number;
        enrollment: number;
        avgScore: number;
      }[];
    };
    semesterOptions: string[];
    selectedSemester: string;
  }

  interface AdmitCardSubject {
    code: string;
    name: string;
    date: string;
    time: string;
    hall: string;
  }

  interface StudentAdmitCardData {
    studentData: {
      name: string;
      rollNo: string;
      enrollment: string;
      program: string;
      semester: string;
      session: string;
      exam: string;
    };
    examSubjects: AdmitCardSubject[];
  }

  interface SeatingPlanSeat {
    seat: string;
    status: 'allocated' | 'reserved' | 'available';
  }

  interface SeatingPlanHall {
    name: string;
    floor: string;
    capacity: number;
    type: string;
    seats: SeatingPlanSeat[];
  }

  interface StudentSeatingPlanData {
    seat: string;
    hall: string;
    floor: string;
    halls: SeatingPlanHall[];
  }
}
