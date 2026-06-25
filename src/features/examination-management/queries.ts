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
