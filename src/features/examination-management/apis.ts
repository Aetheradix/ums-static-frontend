import { ApiService } from 'services';
import { examinationUrls as url } from './urls';

function unwrap<T>(res: Api.ApiResult<T>): T {
  return res.data as T;
}

// ───── Exam Type ─────
export function getExamTypes() {
  return ApiService.getList<Examination.ExamTypeItem>(url.examType.root);
}

export async function createExamType(form: Examination.ExamTypeForm) {
  return ApiService.post<Examination.ExamTypeItem>(url.examType.create, form);
}

export async function updateExamType(
  id: number,
  form: Examination.ExamTypeForm
) {
  return ApiService.put<Examination.ExamTypeItem>(url.examType.edit(id), form);
}

export async function patchExamTypeStatus(id: number, isActive: boolean) {
  return ApiService.patch(url.examType.edit(id), { isActive });
}

// ───── Exam Cycle ─────
export function getExamCycles() {
  return ApiService.getList<Examination.ExamCycleItem>(url.examCycle.root);
}

export async function createExamCycle(form: Examination.ExamCycleForm) {
  return ApiService.post<Examination.ExamCycleItem>(url.examCycle.create, form);
}

export async function updateExamCycle(
  id: number,
  form: Examination.ExamCycleForm
) {
  return ApiService.put<Examination.ExamCycleItem>(
    url.examCycle.edit(id),
    form
  );
}

// ───── Time Slot ─────
export function getTimeSlots() {
  return ApiService.getList<Examination.TimeSlotItem>(url.timeSlot.root);
}

export async function createTimeSlot(form: Examination.TimeSlotForm) {
  return ApiService.post<Examination.TimeSlotItem>(url.timeSlot.create, form);
}

export async function updateTimeSlot(
  id: number,
  form: Examination.TimeSlotForm
) {
  return ApiService.put<Examination.TimeSlotItem>(url.timeSlot.edit(id), form);
}

// ───── Session Template ─────
export function getSessionTemplates() {
  return ApiService.getList<Examination.SessionTemplateItem>(
    url.sessionTemplate.root
  );
}

// ───── Exam Center ─────
export function getExamCenters() {
  return ApiService.getList<Examination.ExamCenterItem>(url.center.root);
}

export async function createExamCenter(form: Examination.ExamCenterForm) {
  return ApiService.post<Examination.ExamCenterItem>(url.center.create, form);
}

export async function updateExamCenter(
  id: number,
  form: Examination.ExamCenterForm
) {
  return ApiService.put<Examination.ExamCenterItem>(url.center.edit(id), form);
}

export async function patchExamCenterStatus(id: number, isActive: boolean) {
  return ApiService.patch(url.center.edit(id), { isActive });
}

// ───── Hall / Room ─────
export function getHalls(centerId: number) {
  return ApiService.getList<Examination.HallItem>(url.hall.root(centerId));
}

export async function createHall(form: Examination.HallForm) {
  return ApiService.post<Examination.HallItem>(url.hall.create, form);
}

export async function updateHall(id: number, form: Examination.HallForm) {
  return ApiService.put<Examination.HallItem>(url.hall.edit(id), form);
}

export async function patchHallStatus(id: number, isActive: boolean) {
  return ApiService.patch(url.hall.edit(id), { isActive });
}

// ───── Duty Type ─────
export function getDutyTypes() {
  return ApiService.getList<Examination.DutyTypeItem>(url.dutyType.root);
}

export async function createDutyType(form: Examination.DutyTypeForm) {
  return ApiService.post<Examination.DutyTypeItem>(url.dutyType.create, form);
}

export async function updateDutyType(
  id: number,
  form: Examination.DutyTypeForm
) {
  return ApiService.put<Examination.DutyTypeItem>(url.dutyType.edit(id), form);
}

export async function patchDutyTypeStatus(id: number, isActive: boolean) {
  return ApiService.patch(url.dutyType.edit(id), { isActive });
}

// ───── Admit Card Template ─────
export function getAdmitCardTemplates() {
  return ApiService.getList<Examination.AdmitCardTemplateItem>(
    url.admitCardTemplate.root
  );
}

// ───── Exam Fee ─────
export function getExamFees() {
  return ApiService.getList<Examination.ExamFeeItem>(url.fee.root);
}

export async function createExamFee(form: Examination.ExamFeeForm) {
  return ApiService.post<Examination.ExamFeeItem>(url.fee.create, form);
}

// ───── Late Fee ─────
export function getLateFees() {
  return ApiService.getList<Examination.LateFeeItem>(url.lateFee.root);
}

export async function createLateFee(form: Examination.LateFeeForm) {
  return ApiService.post<Examination.LateFeeItem>(url.lateFee.create, form);
}

// ───── Exam Session ─────
export function getExamSessions() {
  return ApiService.getList<Examination.ExamSessionItem>(url.session.root);
}

export async function createExamSession(form: Examination.ExamSessionForm) {
  return ApiService.post<Examination.ExamSessionItem>(url.session.create, form);
}

// ───── Session Programs ─────
export function getSessionPrograms(sessionId: number) {
  return ApiService.getList<Examination.SessionProgramItem>(
    url.session.programs(sessionId)
  );
}

// ───── Student Applications ─────
export function getStudentApplications(sessionId: number) {
  return ApiService.getList<Examination.StudentApplicationItem>(
    url.session.applications(sessionId)
  );
}

// ───── Phase 3 Workflows ─────
export function getAttendanceRollCall(sessionId: number) {
  return ApiService.getList<Examination.AttendanceRollCallItem>(
    url.session.attendanceRollCall(sessionId)
  );
}

export async function saveAttendance(
  sessionId: number,
  data: { id: number; status: 'Present' | 'Absent' }[]
) {
  return ApiService.post(url.session.attendanceRollCall(sessionId), { data });
}

export function getEligibilityList(sessionId: number) {
  return ApiService.getList<Examination.EligibilityItem>(
    url.session.eligibilityList(sessionId)
  );
}

export async function updateEligibilityStatus(
  sessionId: number,
  data: { id: number; isEligible: boolean }[]
) {
  return ApiService.post(url.session.eligibilityList(sessionId), { data });
}

export function getGradeBoundaries(sessionId: number) {
  return ApiService.getList<Examination.GradeBoundaryItem>(
    url.session.gradeBoundaries(sessionId)
  );
}

// ─── Student ───
export function getStudentAdmitCard() {
  return ApiService.get<Examination.StudentAdmitCardData>(
    url.student.admitCard
  ).then(r => r.data);
}

export function getStudentSeatingPlan() {
  return ApiService.get<Examination.StudentSeatingPlanData>(
    url.student.seatingPlan
  ).then(r => r.data);
}

export async function saveGradeBoundaries(
  sessionId: number,
  data: Examination.GradeBoundaryItem[]
) {
  return ApiService.post(url.session.gradeBoundaries(sessionId), { data });
}

export async function triggerGradeCalculation(sessionId: number) {
  return ApiService.post(
    `${url.session.gradeBoundaries(sessionId)}/trigger`,
    {}
  );
}

// ───── Timetable ─────
export function getTimetable(sessionId: number) {
  return ApiService.getList<Examination.TimetableItem>(
    url.timetable.root(sessionId)
  );
}

export async function createTimetableEntry(
  sessionId: number,
  form: Examination.TimetableForm
) {
  return unwrap(
    await ApiService.post<Examination.TimetableItem>(
      url.timetable.root(sessionId),
      form
    )
  );
}

export async function updateTimetableEntry(
  sessionId: number,
  id: number,
  form: Examination.TimetableForm
) {
  return unwrap(
    await ApiService.put<Examination.TimetableItem>(
      url.timetable.edit(sessionId, id),
      form
    )
  );
}

// ───── Marks Entry ─────
export function getMarksEntries(sessionId: number) {
  return ApiService.getList<Examination.MarksEntryItem>(
    url.marks.root(sessionId)
  );
}

// ───── Results ─────
export function getResults(sessionId: number) {
  return ApiService.getList<Examination.ResultItem>(url.result.root(sessionId));
}

// ───── Revaluation ─────
export function getRevaluations() {
  return ApiService.getList<Examination.RevaluationApplicationItem>(
    url.revaluation.root
  );
}

// ───── Dashboard ─────
export async function getDashboardStats() {
  const res = await ApiService.get<Examination.DashboardStats>(url.dashboard);
  return res.data as Examination.DashboardStats;
}

// ───── Reports Dashboard ─────
export function getReportsDashboard() {
  return ApiService.get<Examination.ReportsDashboard>(
    url.reportsDashboard
  ).then(r => r.data);
}

// ───── Options (dropdown data) ─────
export function getProgramOptions() {
  return ApiService.getList<Data.DataItem<number>>(url.programOptions);
}

export function getCycleOptions() {
  return ApiService.getList<Data.DataItem<number>>(url.cycleOptions);
}

// ───── Session Template CUD ─────
export async function createSessionTemplate(
  form: Examination.SessionTemplateForm
) {
  return unwrap(
    await ApiService.post<Examination.SessionTemplateItem>(
      url.sessionTemplate.create,
      form
    )
  );
}

export async function updateSessionTemplate(
  id: number,
  form: Examination.SessionTemplateForm
) {
  return unwrap(
    await ApiService.put<Examination.SessionTemplateItem>(
      url.sessionTemplate.edit(id),
      form
    )
  );
}

// ───── Admit Card Template CUD ─────
export async function createAdmitCardTemplate(
  form: Examination.AdmitCardTemplateForm
) {
  return unwrap(
    await ApiService.post<Examination.AdmitCardTemplateItem>(
      url.admitCardTemplate.create,
      form
    )
  );
}

export async function updateAdmitCardTemplate(
  id: number,
  form: Examination.AdmitCardTemplateForm
) {
  return unwrap(
    await ApiService.put<Examination.AdmitCardTemplateItem>(
      url.admitCardTemplate.edit(id),
      form
    )
  );
}

// ───── Exam Fee Update ─────
export async function updateExamFee(id: number, form: Examination.ExamFeeForm) {
  return unwrap(
    await ApiService.put<Examination.ExamFeeItem>(url.fee.edit(id), form)
  );
}

// ───── Late Fee Update ─────
export async function updateLateFee(id: number, form: Examination.LateFeeForm) {
  return unwrap(
    await ApiService.put<Examination.LateFeeItem>(url.lateFee.edit(id), form)
  );
}

// ───── Exam Session Update ─────
export async function updateExamSession(
  id: number,
  form: Examination.ExamSessionForm
) {
  return unwrap(
    await ApiService.put<Examination.ExamSessionItem>(
      url.session.edit(id),
      form
    )
  );
}

// ───── Question Paper ─────
export function getQuestionPapers() {
  return ApiService.getList<Examination.QuestionPaperItem>(
    url.questionPaper.root
  );
}

export async function createQuestionPaper(form: Examination.QuestionPaperForm) {
  return unwrap(
    await ApiService.post<Examination.QuestionPaperItem>(
      url.questionPaper.create,
      form
    )
  );
}

export async function updateQuestionPaper(
  id: number,
  form: Examination.QuestionPaperForm
) {
  return unwrap(
    await ApiService.put<Examination.QuestionPaperItem>(
      url.questionPaper.edit(id),
      form
    )
  );
}

export function getQuestionPaperPatterns() {
  return ApiService.getList<Examination.QuestionPaperPatternItem>(
    url.questionPaper.patterns
  );
}

export async function createQuestionPaperPattern(
  form: Examination.QuestionPaperPatternForm
) {
  return unwrap(
    await ApiService.post<Examination.QuestionPaperPatternItem>(
      url.questionPaper.patterns,
      form
    )
  );
}

export async function updateQuestionPaperPattern(
  id: number,
  form: Examination.QuestionPaperPatternForm
) {
  return unwrap(
    await ApiService.put<Examination.QuestionPaperPatternItem>(
      url.questionPaper.patternEdit(id),
      form
    )
  );
}

// ───── Evaluator ─────
export function getEvaluators() {
  return ApiService.getList<Examination.EvaluatorItem>(url.evaluator.root);
}

export async function createEvaluator(form: Examination.EvaluatorForm) {
  return unwrap(
    await ApiService.post<Examination.EvaluatorItem>(url.evaluator.create, form)
  );
}

export async function updateEvaluator(
  id: number,
  form: Examination.EvaluatorForm
) {
  return unwrap(
    await ApiService.put<Examination.EvaluatorItem>(
      url.evaluator.edit(id),
      form
    )
  );
}

export function getSheetDistributions() {
  return ApiService.getList<Examination.SheetDistributionItem>(
    url.evaluator.sheetDistribution
  );
}

export async function createSheetDistribution(
  form: Examination.SheetDistributionForm
) {
  return unwrap(
    await ApiService.post<Examination.SheetDistributionItem>(
      url.evaluator.sheetDistribution,
      form
    )
  );
}

export async function updateSheetDistribution(
  id: number,
  form: Examination.SheetDistributionForm
) {
  return unwrap(
    await ApiService.put<Examination.SheetDistributionItem>(
      url.evaluator.sheetDistributionEdit(id),
      form
    )
  );
}

// ───── Supplementary ─────
export function getSupplementarySetups() {
  return ApiService.getList<Examination.SupplementarySessionItem>(
    url.supplementary.root
  );
}

export async function getSupplementarySession(id: number) {
  const list = await getSupplementarySetups();
  return list.find(x => x.id === id) ?? null;
}

export async function createSupplementarySession(
  form: Examination.SupplementarySessionForm
) {
  return unwrap(
    await ApiService.post<Examination.SupplementarySessionItem>(
      url.supplementary.create,
      form
    )
  );
}

export async function updateSupplementarySession(
  id: number,
  form: Examination.SupplementarySessionForm
) {
  return unwrap(
    await ApiService.put<Examination.SupplementarySessionItem>(
      url.supplementary.edit(id),
      form
    )
  );
}

// ───── Duplicate Marksheet ─────
export function getDuplicateApplications() {
  return ApiService.getList<Examination.DuplicateApplicationItem>(
    url.duplicateMarksheet.applications
  );
}

export function getGeneratedDuplicates() {
  return ApiService.getList<Examination.GeneratedDuplicateItem>(
    url.duplicateMarksheet.generate
  );
}

// ───── Grade Card ─────
export function getGradeCardGenerations() {
  return ApiService.getList<Examination.GradeCardGenerationItem>(
    url.gradeCard.root
  );
}

// ───── Result Publication ─────
export function getResultPublications() {
  return ApiService.getList<Examination.ResultPublicationItem>(
    url.resultPublication.root
  );
}

// ───── Moderation ─────
export function getModerationRules() {
  return ApiService.getList<Examination.ModerationRuleItem>(
    url.moderation.root
  );
}

export async function createModerationRule(
  form: Examination.ModerationRuleForm
) {
  return unwrap(
    await ApiService.post<Examination.ModerationRuleItem>(
      url.moderation.create,
      form
    )
  );
}

export async function updateModerationRule(
  id: number,
  form: Examination.ModerationRuleForm
) {
  return unwrap(
    await ApiService.put<Examination.ModerationRuleItem>(
      url.moderation.edit(id),
      form
    )
  );
}

// ───── Revaluation Evaluation ─────
export function getRevaluationEvaluations() {
  return ApiService.getList<Examination.RevaluationEvaluationItem>(
    url.revaluationEvaluation.root
  );
}

// ───── Student Portal ─────
export function getStudentDashboard() {
  return ApiService.get<{
    info: Examination.StudentInfo;
    stats: Examination.StudentDashboardStats;
    sgpaTrend: Examination.SgpaTrendItem[];
    subjectMarks: Examination.SubjectMarksItem[];
    attendanceBreakdown: Examination.AttendanceDataPoint[];
    upcomingExams: Examination.UpcomingExam[];
    notifications: Examination.StudentNotification[];
  }>(url.student.dashboard).then(r => r.data);
}

export function getStudentTimetable() {
  return ApiService.getList<Examination.StudentTimetableItem>(
    url.student.timetable
  );
}

export function getStudentResults() {
  return ApiService.get<{
    sgpa: number;
    cgpa: number;
    semester: number;
    subjects: Examination.StudentResultItem[];
  }>(url.student.results).then(r => r.data);
}

export function getStudentGradeCards() {
  return ApiService.getList<Examination.StudentGradeCardItem>(
    url.student.gradeCards
  );
}

export function getStudentRevaluations() {
  return ApiService.getList<Examination.StudentRevaluationItem>(
    url.student.revaluation
  );
}

export function getStudentDuplicateMarksheets() {
  return ApiService.getList<Examination.StudentDuplicateItem>(
    url.student.duplicateMarksheet
  );
}

export function getStudentTrackApplications() {
  return ApiService.getList<Examination.TrackApplicationItem>(
    url.student.trackApplications
  );
}
