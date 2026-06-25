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
    applicableCycleId: number;
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
    applicableCycleId: number;
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
  }
}
