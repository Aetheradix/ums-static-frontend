import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './apis';

const QUERY_KEY = ['@examination'];

// ───── Exam Type ─────
export function useExamTypesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'exam-type'],
    queryFn: api.getExamTypes,
  });
}

export function useCreateExamTypeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createExamType,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'exam-type'] }),
  });
}

export function useUpdateExamTypeMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.ExamTypeForm) =>
      api.updateExamType(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'exam-type'] }),
  });
}

export function useExamTypeStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      api.patchExamTypeStatus(id, isActive),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'exam-type'] }),
  });
}

// ───── Exam Cycle ─────
export function useExamCyclesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'exam-cycle'],
    queryFn: api.getExamCycles,
  });
}

export function useCreateExamCycleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createExamCycle,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'exam-cycle'] }),
  });
}

export function useUpdateExamCycleMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.ExamCycleForm) =>
      api.updateExamCycle(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'exam-cycle'] }),
  });
}

// ───── Time Slot ─────
export function useTimeSlotsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'time-slot'],
    queryFn: api.getTimeSlots,
  });
}

export function useCreateTimeSlotMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createTimeSlot,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'time-slot'] }),
  });
}

export function useUpdateTimeSlotMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.TimeSlotForm) =>
      api.updateTimeSlot(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'time-slot'] }),
  });
}

// ───── Session Template ─────
export function useSessionTemplatesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'session-template'],
    queryFn: api.getSessionTemplates,
  });
}

export function useCreateSessionTemplateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createSessionTemplate,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'session-template'] }),
  });
}

export function useUpdateSessionTemplateMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.SessionTemplateForm) =>
      api.updateSessionTemplate(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'session-template'] }),
  });
}

// ───── Exam Center ─────
export function useExamCentersQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'center'],
    queryFn: api.getExamCenters,
  });
}

export function useCreateExamCenterMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createExamCenter,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'center'] }),
  });
}

export function useUpdateExamCenterMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.ExamCenterForm) =>
      api.updateExamCenter(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'center'] }),
  });
}

export function useExamCenterStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      api.patchExamCenterStatus(id, isActive),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'center'] }),
  });
}

// ───── Hall / Room ─────
export function useHallsQuery(centerId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'halls', centerId],
    queryFn: () => api.getHalls(centerId),
    enabled: !!centerId,
  });
}

export function useCreateHallMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createHall,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'halls'] }),
  });
}

export function useUpdateHallMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.HallForm) => api.updateHall(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'halls'] }),
  });
}

export function useHallStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      centerId: number;
      id: number;
      isActive: boolean;
    }) => api.patchHallStatus(id, isActive),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'halls'] }),
  });
}

// ───── Duty Type ─────
export function useDutyTypesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'duty-type'],
    queryFn: api.getDutyTypes,
  });
}

export function useCreateDutyTypeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createDutyType,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'duty-type'] }),
  });
}

export function useUpdateDutyTypeMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.DutyTypeForm) =>
      api.updateDutyType(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'duty-type'] }),
  });
}

export function useDutyTypeStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      api.patchDutyTypeStatus(id, isActive),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'duty-type'] }),
  });
}

// ───── Admit Card Template ─────
export function useAdmitCardTemplatesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'admit-card-template'],
    queryFn: api.getAdmitCardTemplates,
  });
}

// ───── Exam Fee ─────
export function useExamFeesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'fee'],
    queryFn: api.getExamFees,
  });
}

export function useCreateExamFeeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createExamFee,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'fee'] }),
  });
}

// ───── Late Fee ─────
export function useLateFeesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'late-fee'],
    queryFn: api.getLateFees,
  });
}

export function useCreateLateFeeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createLateFee,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'late-fee'] }),
  });
}

// ───── Exam Session ─────
export function useExamSessionsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'session'],
    queryFn: api.getExamSessions,
  });
}

export function useCreateExamSessionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createExamSession,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'session'] }),
  });
}

// ───── Session Programs ─────
export function useSessionProgramsQuery(sessionId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'session-program', sessionId],
    queryFn: () => api.getSessionPrograms(sessionId),
    enabled: !!sessionId,
  });
}

// ───── Student Applications ─────
export function useStudentApplicationsQuery(sessionId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'student-application', sessionId],
    queryFn: () => api.getStudentApplications(sessionId),
    enabled: !!sessionId,
  });
}

// ───── Phase 3 Workflows ─────
export function useAttendanceRollCallQuery(sessionId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'attendance-roll-call', sessionId],
    queryFn: () => api.getAttendanceRollCall(sessionId),
    enabled: !!sessionId,
  });
}

export function useSaveAttendanceMutation(sessionId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; status: 'Present' | 'Absent' }[]) =>
      api.saveAttendance(sessionId, data),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: [...QUERY_KEY, 'attendance-roll-call', sessionId],
      }),
  });
}

export function useEligibilityListQuery(sessionId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'eligibility-list', sessionId],
    queryFn: () => api.getEligibilityList(sessionId),
    enabled: !!sessionId,
  });
}

export function useUpdateEligibilityStatusMutation(sessionId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; isEligible: boolean }[]) =>
      api.updateEligibilityStatus(sessionId, data),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: [...QUERY_KEY, 'eligibility-list', sessionId],
      }),
  });
}

export function useGradeBoundariesQuery(sessionId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'grade-boundaries', sessionId],
    queryFn: () => api.getGradeBoundaries(sessionId),
    enabled: !!sessionId,
  });
}

export function useSaveGradeBoundariesMutation(sessionId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Examination.GradeBoundaryItem[]) =>
      api.saveGradeBoundaries(sessionId, data),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: [...QUERY_KEY, 'grade-boundaries', sessionId],
      }),
  });
}

export function useTriggerGradeCalculationMutation(sessionId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.triggerGradeCalculation(sessionId),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: [...QUERY_KEY, 'result', sessionId],
      }),
  });
}

// ─── Student Queries ───
export function useStudentAdmitCardQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'student-admit-card'],
    queryFn: api.getStudentAdmitCard,
  });
}

export function useStudentSeatingPlanQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'student-seating-plan'],
    queryFn: api.getStudentSeatingPlan,
  });
}

// ───── Timetable ─────
export function useTimetableQuery(sessionId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'timetable', sessionId],
    queryFn: () => api.getTimetable(sessionId),
    enabled: !!sessionId,
  });
}

// ───── Marks Entry ─────
export function useMarksEntriesQuery(sessionId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'marks-entry', sessionId],
    queryFn: () => api.getMarksEntries(sessionId),
    enabled: !!sessionId,
  });
}

// ───── Results ─────
export function useResultsQuery(sessionId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'result', sessionId],
    queryFn: () => api.getResults(sessionId),
    enabled: !!sessionId,
  });
}

// ───── Revaluation ─────
export function useRevaluationsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'revaluation'],
    queryFn: api.getRevaluations,
  });
}

// ───── Dashboard ─────
export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'dashboard'],
    queryFn: api.getDashboardStats,
  });
}

// ───── Options ─────
export function useProgramOptionsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'program-options'],
    queryFn: api.getProgramOptions,
  });
}

export function useCycleOptionsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'cycle-options'],
    queryFn: api.getCycleOptions,
  });
}

// ───── Admit Card Template CUD ─────
export function useCreateAdmitCardTemplateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createAdmitCardTemplate,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'admit-card-template'] }),
  });
}

export function useUpdateAdmitCardTemplateMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.AdmitCardTemplateForm) =>
      api.updateAdmitCardTemplate(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'admit-card-template'] }),
  });
}

// ───── Exam Fee Update ─────
export function useUpdateExamFeeMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.ExamFeeForm) => api.updateExamFee(id, form),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'fee'] }),
  });
}

// ───── Late Fee Update ─────
export function useUpdateLateFeeMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.LateFeeForm) => api.updateLateFee(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'late-fee'] }),
  });
}

// ───── Exam Session Update ─────
export function useUpdateExamSessionMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.ExamSessionForm) =>
      api.updateExamSession(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'session'] }),
  });
}

// ───── Question Paper ─────
export function useQuestionPapersQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'question-paper'],
    queryFn: api.getQuestionPapers,
  });
}

export function useQuestionPaperPatternsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'question-paper-pattern'],
    queryFn: api.getQuestionPaperPatterns,
  });
}

// ───── Evaluator ─────
export function useEvaluatorsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'evaluator'],
    queryFn: api.getEvaluators,
  });
}

export function useSheetDistributionsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'sheet-distribution'],
    queryFn: api.getSheetDistributions,
  });
}

// ───── Supplementary ─────
export function useSupplementarySetupsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'supplementary'],
    queryFn: api.getSupplementarySetups,
  });
}

export function useCreateSupplementarySessionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createSupplementarySession,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'supplementary'] }),
  });
}

export function useUpdateSupplementarySessionMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.SupplementarySessionForm) =>
      api.updateSupplementarySession(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'supplementary'] }),
  });
}

// ───── Duplicate Marksheet ─────
export function useDuplicateApplicationsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'duplicate-applications'],
    queryFn: api.getDuplicateApplications,
  });
}

export function useGeneratedDuplicatesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'duplicate-generate'],
    queryFn: api.getGeneratedDuplicates,
  });
}

// ───── Grade Card ─────
export function useGradeCardGenerationsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'grade-card'],
    queryFn: api.getGradeCardGenerations,
  });
}

// ───── Result Publication ─────
export function useResultPublicationsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'result-publication'],
    queryFn: api.getResultPublications,
  });
}

// ───── Moderation ─────
export function useModerationRulesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'moderation'],
    queryFn: api.getModerationRules,
  });
}

export function useCreateModerationRuleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createModerationRule,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'moderation'] }),
  });
}

export function useUpdateModerationRuleMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.ModerationRuleForm) =>
      api.updateModerationRule(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'moderation'] }),
  });
}

// ───── Revaluation Evaluation ─────
export function useRevaluationEvaluationsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'revaluation-evaluation'],
    queryFn: api.getRevaluationEvaluations,
  });
}

// ───── Reports Dashboard ─────
export function useReportsDashboardQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'reports-dashboard'],
    queryFn: api.getReportsDashboard,
  });
}

// ───── Student Portal ─────
export function useStudentDashboardQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'student-dashboard'],
    queryFn: api.getStudentDashboard,
  });
}

export function useStudentTimetableQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'student-timetable'],
    queryFn: api.getStudentTimetable,
  });
}

export function useStudentResultsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'student-results'],
    queryFn: api.getStudentResults,
  });
}

export function useStudentGradeCardsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'student-grade-cards'],
    queryFn: api.getStudentGradeCards,
  });
}

export function useStudentRevaluationsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'student-revaluation'],
    queryFn: api.getStudentRevaluations,
  });
}

export function useStudentDuplicateMarksheetsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'student-duplicate'],
    queryFn: api.getStudentDuplicateMarksheets,
  });
}

export function useStudentTrackApplicationsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'student-track'],
    queryFn: api.getStudentTrackApplications,
  });
}

// ───── Question Paper Mutations ─────
export function useCreateQuestionPaperMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createQuestionPaper,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'question-paper'] }),
  });
}

export function useUpdateQuestionPaperMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.QuestionPaperForm) =>
      api.updateQuestionPaper(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'question-paper'] }),
  });
}

export function useCreateQuestionPaperPatternMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createQuestionPaperPattern,
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: [...QUERY_KEY, 'question-paper-pattern'],
      }),
  });
}

export function useUpdateQuestionPaperPatternMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.QuestionPaperPatternForm) =>
      api.updateQuestionPaperPattern(id, form),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: [...QUERY_KEY, 'question-paper-pattern'],
      }),
  });
}

// ───── Evaluator Mutations ─────
export function useCreateEvaluatorMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createEvaluator,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'evaluator'] }),
  });
}

export function useUpdateEvaluatorMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.EvaluatorForm) =>
      api.updateEvaluator(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'evaluator'] }),
  });
}

export function useCreateSheetDistributionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createSheetDistribution,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'sheet-distribution'] }),
  });
}

export function useUpdateSheetDistributionMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.SheetDistributionForm) =>
      api.updateSheetDistribution(id, form),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'sheet-distribution'] }),
  });
}

// ───── Timetable Mutations ─────
export function useCreateTimetableEntryMutation(sessionId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.TimetableForm) =>
      api.createTimetableEntry(sessionId, form),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: [...QUERY_KEY, 'timetable', sessionId],
      }),
  });
}

export function useUpdateTimetableEntryMutation(sessionId: number, id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: Examination.TimetableForm) =>
      api.updateTimetableEntry(sessionId, id, form),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: [...QUERY_KEY, 'timetable', sessionId],
      }),
  });
}
