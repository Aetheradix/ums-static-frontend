import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCase,
  createHearing,
  createPayment,
  getCases,
  getHearings,
  getPayments,
  updateCase,
  type CaseFormValues,
  type HearingFormValues,
  type PaymentFormValues,
} from './api';
import type { Hearing, LegalCase, Payment } from './mocks';

const CASES_QK = ['@lcm/cases'];
const HEARINGS_QK = ['@lcm/hearings'];
const PAYMENTS_QK = ['@lcm/payments'];

// ─── Cases ──────────────────────────────────────────────────────────────────

export function useCasesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: CASES_QK,
    queryFn: getCases,
  });
  return { data, isLoading };
}

export function useCreateCaseMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: CaseFormValues) => createCase(form),
    onSuccess(data) {
      const prev = qc.getQueryData<LegalCase[]>(CASES_QK) ?? [];
      qc.setQueryData(CASES_QK, [data, ...prev]);
    },
  });
}

export function useUpdateCaseMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; form: CaseFormValues }) =>
      updateCase(vars.id, vars.form),
    onSuccess(data) {
      const prev = qc.getQueryData<LegalCase[]>(CASES_QK) ?? [];
      qc.setQueryData(
        CASES_QK,
        prev.map(c => (c.id === data.id ? data : c))
      );
    },
  });
}

// ─── Hearings ───────────────────────────────────────────────────────────────

export function useHearingsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: HEARINGS_QK,
    queryFn: getHearings,
  });
  return { data, isLoading };
}

export function useCreateHearingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: HearingFormValues) => createHearing(form),
    onSuccess(data) {
      const prev = qc.getQueryData<Hearing[]>(HEARINGS_QK) ?? [];
      qc.setQueryData(HEARINGS_QK, [data, ...prev]);
    },
  });
}

// ─── Payments ───────────────────────────────────────────────────────────────

export function usePaymentsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: PAYMENTS_QK,
    queryFn: getPayments,
  });
  return { data, isLoading };
}

export function useCreatePaymentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: PaymentFormValues) => createPayment(form),
    onSuccess(data) {
      const prev = qc.getQueryData<Payment[]>(PAYMENTS_QK) ?? [];
      qc.setQueryData(PAYMENTS_QK, [data, ...prev]);
    },
  });
}
