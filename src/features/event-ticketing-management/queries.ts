import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEvent,
  createRegistration,
  getEvents,
  getRegistrations,
  updateEvent,
  type EventFormValues,
  type RegistrationFormValues,
} from './api';
import type { Event, Registration, RegistrationStatus } from './mocks';

const EVENTS_QK = ['@etm/events'];
const REGISTRATIONS_QK = ['@etm/registrations'];

// ─── Events ──────────────────────────────────────────────────────────────────

export function useEventsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: EVENTS_QK,
    queryFn: getEvents,
  });
  return { data, isLoading };
}

export function useCreateEventMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: EventFormValues) => createEvent(form),
    onSuccess(data) {
      const prev = qc.getQueryData<Event[]>(EVENTS_QK) ?? [];
      qc.setQueryData(EVENTS_QK, [data, ...prev]);
    },
  });
}

export function useUpdateEventMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; form: EventFormValues }) =>
      updateEvent(vars.id, vars.form),
    onSuccess(data) {
      const prev = qc.getQueryData<Event[]>(EVENTS_QK) ?? [];
      qc.setQueryData(
        EVENTS_QK,
        prev.map(e => (e.id === data.id ? data : e))
      );
    },
  });
}

// ─── Registrations ────────────────────────────────────────────────────────────

export function useRegistrationsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: REGISTRATIONS_QK,
    queryFn: getRegistrations,
  });
  return { data, isLoading };
}

export function useCreateRegistrationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: RegistrationFormValues) => createRegistration(form),
    onSuccess(data) {
      const prev = qc.getQueryData<Registration[]>(REGISTRATIONS_QK) ?? [];
      qc.setQueryData(REGISTRATIONS_QK, [data, ...prev]);
    },
  });
}

/** Optimistic status update used by the volunteer check-in flow. */
export function useUpdateRegistrationStatus() {
  const qc = useQueryClient();
  return (id: number, status: RegistrationStatus) => {
    const prev = qc.getQueryData<Registration[]>(REGISTRATIONS_QK) ?? [];
    qc.setQueryData(
      REGISTRATIONS_QK,
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };
}
