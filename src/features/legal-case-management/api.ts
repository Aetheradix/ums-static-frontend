// ─── Legal Case Management — mock API layer ─────────────────────────────────
import {
  advocates,
  caseTypes,
  cases as CASES,
  courts,
  hearings as HEARINGS,
  partyTypes,
  payments as PAYMENTS,
  type CaseStatus,
  type Hearing,
  type LegalCase,
  type Payment,
} from './mocks';

export interface CaseFormValues {
  caseNumber: string;
  title: string;
  subject: string;
  brief: string;
  courtId: number;
  caseTypeId: number;
  partyTypeId: number;
  advocateId: number;
  filingDate: string;
  counterAffidavitDate?: string;
  disposalDate?: string;
  status: CaseStatus;
  judgmentDoc?: string;
  remarks?: string;
}

export interface HearingFormValues {
  caseId: number;
  hearingDate: string;
  attendance: Hearing['attendance'];
  notes: string;
  nextHearingDate?: string;
  status: Hearing['status'];
}

export interface PaymentFormValues {
  caseId: number;
  advocateId: number;
  hearingDate: string;
  description: string;
  mode: Payment['mode'];
  amount: number;
  txnId: string;
  txnDate: string;
  status: Payment['status'];
}

const nameOf = <T extends { id: number; name: string }>(
  list: T[],
  id: number
) => list.find(x => x.id === id)?.name ?? '';

// ─── Cases ──────────────────────────────────────────────────────────────────

export async function getCases(): Promise<LegalCase[]> {
  return Promise.resolve([...CASES]);
}

export async function createCase(form: CaseFormValues): Promise<LegalCase> {
  const newId = Date.now();
  return Promise.resolve({
    ...form,
    id: newId,
    courtName: nameOf(courts, form.courtId),
    caseTypeName: nameOf(caseTypes, form.caseTypeId),
    partyTypeName: nameOf(partyTypes, form.partyTypeId),
    advocateName: nameOf(advocates, form.advocateId),
  });
}

export async function updateCase(
  id: number,
  form: CaseFormValues
): Promise<LegalCase> {
  return Promise.resolve({
    ...form,
    id,
    courtName: nameOf(courts, form.courtId),
    caseTypeName: nameOf(caseTypes, form.caseTypeId),
    partyTypeName: nameOf(partyTypes, form.partyTypeId),
    advocateName: nameOf(advocates, form.advocateId),
  });
}

// ─── Hearings ───────────────────────────────────────────────────────────────

export async function getHearings(): Promise<Hearing[]> {
  return Promise.resolve([...HEARINGS]);
}

export async function createHearing(form: HearingFormValues): Promise<Hearing> {
  const parentCase = CASES.find(c => c.id === form.caseId);
  return Promise.resolve({
    id: Date.now(),
    caseId: form.caseId,
    caseNumber: parentCase?.caseNumber ?? '',
    hearingDate: form.hearingDate,
    courtName: parentCase?.courtName ?? '',
    attendance: form.attendance,
    notes: form.notes,
    nextHearingDate: form.nextHearingDate,
    status: form.status,
  });
}

// ─── Payments ───────────────────────────────────────────────────────────────

export async function getPayments(): Promise<Payment[]> {
  return Promise.resolve([...PAYMENTS]);
}

export async function createPayment(form: PaymentFormValues): Promise<Payment> {
  const parentCase = CASES.find(c => c.id === form.caseId);
  return Promise.resolve({
    id: Date.now(),
    caseId: form.caseId,
    caseNumber: parentCase?.caseNumber ?? '',
    advocateName: nameOf(advocates, form.advocateId),
    hearingDate: form.hearingDate,
    description: form.description,
    mode: form.mode,
    amount: form.amount,
    txnId: form.txnId,
    txnDate: form.txnDate,
    status: form.status,
  });
}
