import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAssignment,
  createSession,
  createSubstitution,
  getClashes,
  getEntries,
  getSessions,
  getSubstitutions,
  getTimetables,
  publishTimetable,
  resolveClash,
  updateSession,
  type AssignmentFormValues,
  type ClashResolveValues,
  type SessionFormValues,
  type SubstitutionFormValues,
} from './api';
import type {
  Clash,
  Session,
  Substitution,
  Timetable,
  TimetableEntry,
} from './mocks';

const SESSIONS_QK = ['@ttm/sessions'];
const ENTRIES_QK = ['@ttm/entries'];
const TIMETABLES_QK = ['@ttm/timetables'];
const CLASHES_QK = ['@ttm/clashes'];
const SUBSTITUTIONS_QK = ['@ttm/substitutions'];

// ─── Sessions ───────────────────────────────────────────────────────────────

export function useSessionsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: SESSIONS_QK,
    queryFn: getSessions,
  });
  return { data, isLoading };
}

export function useCreateSessionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: SessionFormValues) => createSession(form),
    onSuccess(data) {
      const prev = qc.getQueryData<Session[]>(SESSIONS_QK) ?? [];
      qc.setQueryData(SESSIONS_QK, [data, ...prev]);
    },
  });
}

export function useUpdateSessionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; form: SessionFormValues }) =>
      updateSession(vars.id, vars.form),
    onSuccess(data) {
      const prev = qc.getQueryData<Session[]>(SESSIONS_QK) ?? [];
      qc.setQueryData(
        SESSIONS_QK,
        prev.map(s => (s.id === data.id ? data : s))
      );
    },
  });
}

// ─── Timetable Entries ──────────────────────────────────────────────────────

export function useEntriesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: ENTRIES_QK,
    queryFn: getEntries,
  });
  return { data, isLoading };
}

export function useCreateAssignmentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: AssignmentFormValues) => createAssignment(form),
    onSuccess(data) {
      const prev = qc.getQueryData<TimetableEntry[]>(ENTRIES_QK) ?? [];
      qc.setQueryData(ENTRIES_QK, [data, ...prev]);
    },
  });
}

// ─── Timetables ─────────────────────────────────────────────────────────────

export function useTimetablesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: TIMETABLES_QK,
    queryFn: getTimetables,
  });
  return { data, isLoading };
}

export function usePublishTimetableMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publishTimetable(id),
    onSuccess(data) {
      const prev = qc.getQueryData<Timetable[]>(TIMETABLES_QK) ?? [];
      qc.setQueryData(
        TIMETABLES_QK,
        prev.map(t => (t.id === data.id ? data : t))
      );
    },
  });
}

// ─── Clashes ────────────────────────────────────────────────────────────────

export function useClashesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: CLASHES_QK,
    queryFn: getClashes,
  });
  return { data, isLoading };
}

export function useResolveClashMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; form: ClashResolveValues }) =>
      resolveClash(vars.id, vars.form),
    onSuccess(data) {
      const prev = qc.getQueryData<Clash[]>(CLASHES_QK) ?? [];
      qc.setQueryData(
        CLASHES_QK,
        prev.map(c => (c.id === data.id ? data : c))
      );
    },
  });
}

// ─── Substitutions ──────────────────────────────────────────────────────────

export function useSubstitutionsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: SUBSTITUTIONS_QK,
    queryFn: getSubstitutions,
  });
  return { data, isLoading };
}

export function useCreateSubstitutionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: SubstitutionFormValues) => createSubstitution(form),
    onSuccess(data) {
      const prev = qc.getQueryData<Substitution[]>(SUBSTITUTIONS_QK) ?? [];
      qc.setQueryData(SUBSTITUTIONS_QK, [data, ...prev]);
    },
  });
}
