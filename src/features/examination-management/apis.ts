import { ApiService } from 'services';
import { examinationUrls as url } from './urls';

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
export async function getHalls(centerId: number) {
  const all = await ApiService.getList<Examination.HallItem>(
    url.hall.root(centerId)
  );
  return all.filter(h => h.centerId === centerId);
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

// ───── Timetable ─────
export function getTimetable(sessionId: number) {
  return ApiService.getList<Examination.TimetableItem>(
    url.timetable.root(sessionId)
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

// ───── Options (dropdown data) ─────
export function getProgramOptions() {
  return ApiService.getList<Data.DataItem<number>>(url.programOptions);
}

export function getCycleOptions() {
  return ApiService.getList<Data.DataItem<number>>(url.cycleOptions);
}
