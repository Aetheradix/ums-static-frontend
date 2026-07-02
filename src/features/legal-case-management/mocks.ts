// ============================================================
//  Legal Case Management — Types & Mock Data
//  Static prototype data modeled on the Samarth eGov LCMS.
// ============================================================

export type CaseStatus = 'Pending' | 'In-favour' | 'Against' | 'Disposed';
export type HearingStatus = 'Scheduled' | 'Completed' | 'Adjourned';
export type PaymentStatus = 'Logged' | 'Verified' | 'Paid';
export type PaymentMode = 'Cheque' | 'Transfer' | 'Cash' | 'Online';
export type Attendance = 'Attended' | 'Not Attended';

export interface Court {
  id: number;
  name: string;
  code: string;
  type: 'District Court' | 'High Court' | 'Supreme Court' | 'Tribunal';
}

export interface CaseType {
  id: number;
  name: string;
}

export interface PartyType {
  id: number;
  name: string;
}

export interface Advocate {
  id: number;
  name: string;
  enrollmentNo: string;
  specialization: string;
}

export interface LegalCase {
  id: number;
  caseNumber: string;
  title: string;
  subject: string;
  brief: string;
  courtId: number;
  courtName: string;
  caseTypeId: number;
  caseTypeName: string;
  partyTypeId: number;
  partyTypeName: string;
  advocateId: number;
  advocateName: string;
  filingDate: string;
  counterAffidavitDate?: string;
  disposalDate?: string;
  status: CaseStatus;
  judgmentDoc?: string;
  remarks?: string;
}

export interface Hearing {
  id: number;
  caseId: number;
  caseNumber: string;
  hearingDate: string;
  courtName: string;
  attendance: Attendance;
  notes: string;
  nextHearingDate?: string;
  status: HearingStatus;
}

export interface Payment {
  id: number;
  caseId: number;
  caseNumber: string;
  advocateName: string;
  hearingDate: string;
  description: string;
  mode: PaymentMode;
  amount: number;
  txnId: string;
  txnDate: string;
  status: PaymentStatus;
}

// ─── Reference Masters ──────────────────────────────────────────────────────

export const courts: Court[] = [
  {
    id: 1,
    name: 'District Court, Indore',
    code: 'DC-IND',
    type: 'District Court',
  },
  {
    id: 2,
    name: 'High Court of MP, Indore Bench',
    code: 'HC-MP',
    type: 'High Court',
  },
  {
    id: 3,
    name: 'Supreme Court of India',
    code: 'SC-IND',
    type: 'Supreme Court',
  },
  {
    id: 4,
    name: 'Central Administrative Tribunal',
    code: 'CAT-JBP',
    type: 'Tribunal',
  },
  {
    id: 5,
    name: 'District Court, Bhopal',
    code: 'DC-BPL',
    type: 'District Court',
  },
];

export const caseTypes: CaseType[] = [
  { id: 1, name: 'Civil' },
  { id: 2, name: 'Criminal' },
  { id: 3, name: 'Writ Petition' },
  { id: 4, name: 'Service Matter' },
];

export const partyTypes: PartyType[] = [
  { id: 1, name: 'University (Petitioner)' },
  { id: 2, name: 'University (Respondent)' },
  { id: 3, name: 'Employee' },
  { id: 4, name: 'Vendor / Third Party' },
];

export const advocates: Advocate[] = [
  {
    id: 1,
    name: 'Adv. R. K. Sharma',
    enrollmentNo: 'MP/1204/2005',
    specialization: 'Service & Constitutional',
  },
  {
    id: 2,
    name: 'Adv. Meera Iyer',
    enrollmentNo: 'MP/3391/2011',
    specialization: 'Civil & Property',
  },
  {
    id: 3,
    name: 'Adv. S. P. Nair',
    enrollmentNo: 'MP/0876/1999',
    specialization: 'Criminal',
  },
  {
    id: 4,
    name: 'Adv. Anjali Verma',
    enrollmentNo: 'MP/5567/2016',
    specialization: 'Labour & Service',
  },
  {
    id: 5,
    name: 'Adv. Devendra Joshi',
    enrollmentNo: 'MP/2210/2008',
    specialization: 'Writ & PIL',
  },
];

// ─── Cases ──────────────────────────────────────────────────────────────────

export const cases: LegalCase[] = [
  {
    id: 1,
    caseNumber: 'WP/2024/0142',
    title: 'Dr. A. Mehta vs. University (Promotion Denial)',
    subject: 'Challenge to denial of CAS promotion',
    brief:
      'Petitioner challenges non-grant of promotion under Career Advancement Scheme citing procedural lapse in the screening committee.',
    courtId: 2,
    courtName: 'High Court of MP, Indore Bench',
    caseTypeId: 3,
    caseTypeName: 'Writ Petition',
    partyTypeId: 2,
    partyTypeName: 'University (Respondent)',
    advocateId: 1,
    advocateName: 'Adv. R. K. Sharma',
    filingDate: '12 Jan 2024',
    counterAffidavitDate: '28 Feb 2024',
    status: 'Pending',
    remarks: 'Counter-affidavit filed; awaiting rejoinder.',
  },
  {
    id: 2,
    caseNumber: 'CS/2023/0891',
    title: 'University vs. M/s Buildwell Infra',
    subject: 'Recovery of liquidated damages on hostel project',
    brief:
      'Suit for recovery of Rs. 42 lakh liquidated damages for delayed completion of Boys Hostel Block-C.',
    courtId: 1,
    courtName: 'District Court, Indore',
    caseTypeId: 1,
    caseTypeName: 'Civil',
    partyTypeId: 1,
    partyTypeName: 'University (Petitioner)',
    advocateId: 2,
    advocateName: 'Adv. Meera Iyer',
    filingDate: '05 Sep 2023',
    counterAffidavitDate: '19 Oct 2023',
    status: 'In-favour',
    disposalDate: '22 Nov 2024',
    judgmentDoc: 'judgment_CS_2023_0891.pdf',
    remarks: 'Decree passed in favour of the University with costs.',
  },
  {
    id: 3,
    caseNumber: 'OA/2024/0056',
    title: 'S. Kulkarni vs. University (Pension Fixation)',
    subject: 'Incorrect pension fixation after superannuation',
    brief:
      'Original application seeking re-fixation of pension with arrears and interest.',
    courtId: 4,
    courtName: 'Central Administrative Tribunal',
    caseTypeId: 4,
    caseTypeName: 'Service Matter',
    partyTypeId: 2,
    partyTypeName: 'University (Respondent)',
    advocateId: 4,
    advocateName: 'Adv. Anjali Verma',
    filingDate: '18 Mar 2024',
    status: 'Pending',
    remarks: 'Reply to be filed within 4 weeks.',
  },
  {
    id: 4,
    caseNumber: 'WP/2023/0777',
    title: 'Students Union vs. University (Fee Hike)',
    subject: 'PIL against revised examination fee structure',
    brief:
      'Public interest litigation challenging the 2023 examination fee revision as arbitrary.',
    courtId: 2,
    courtName: 'High Court of MP, Indore Bench',
    caseTypeId: 3,
    caseTypeName: 'Writ Petition',
    partyTypeId: 2,
    partyTypeName: 'University (Respondent)',
    advocateId: 5,
    advocateName: 'Adv. Devendra Joshi',
    filingDate: '02 Aug 2023',
    counterAffidavitDate: '15 Sep 2023',
    status: 'Against',
    disposalDate: '30 Jul 2024',
    judgmentDoc: 'judgment_WP_2023_0777.pdf',
    remarks: 'Court directed rollback of the fee hike for the affected batch.',
  },
  {
    id: 5,
    caseNumber: 'CR/2024/0031',
    title: 'University vs. Unknown (Exam Paper Leak)',
    subject: 'FIR on alleged question-paper leak',
    brief:
      'Criminal complaint registered regarding leak of B.Com semester examination paper.',
    courtId: 1,
    courtName: 'District Court, Indore',
    caseTypeId: 2,
    caseTypeName: 'Criminal',
    partyTypeId: 1,
    partyTypeName: 'University (Petitioner)',
    advocateId: 3,
    advocateName: 'Adv. S. P. Nair',
    filingDate: '09 Feb 2024',
    status: 'Pending',
    remarks: 'Charge-sheet awaited from investigating officer.',
  },
  {
    id: 6,
    caseNumber: 'CS/2022/0623',
    title: 'M/s Aqua Systems vs. University',
    subject: 'Payment dispute for RO plant maintenance',
    brief:
      'Vendor suit claiming unpaid maintenance dues for campus RO water plants.',
    courtId: 5,
    courtName: 'District Court, Bhopal',
    caseTypeId: 1,
    caseTypeName: 'Civil',
    partyTypeId: 4,
    partyTypeName: 'Vendor / Third Party',
    advocateId: 2,
    advocateName: 'Adv. Meera Iyer',
    filingDate: '14 Jun 2022',
    counterAffidavitDate: '01 Aug 2022',
    status: 'Disposed',
    disposalDate: '11 Dec 2023',
    judgmentDoc: 'judgment_CS_2022_0623.pdf',
    remarks: 'Settled through mediation; matter disposed.',
  },
  {
    id: 7,
    caseNumber: 'OA/2023/0204',
    title: 'P. Raghavan vs. University (Seniority)',
    subject: 'Dispute over inter-se seniority of Assistant Professors',
    brief:
      'Applicant seeks re-drawal of the seniority list of Assistant Professors (Physics).',
    courtId: 4,
    courtName: 'Central Administrative Tribunal',
    caseTypeId: 4,
    caseTypeName: 'Service Matter',
    partyTypeId: 2,
    partyTypeName: 'University (Respondent)',
    advocateId: 1,
    advocateName: 'Adv. R. K. Sharma',
    filingDate: '21 Nov 2023',
    counterAffidavitDate: '09 Jan 2024',
    status: 'In-favour',
    disposalDate: '05 Sep 2024',
    judgmentDoc: 'judgment_OA_2023_0204.pdf',
    remarks: 'Tribunal upheld the University seniority list.',
  },
  {
    id: 8,
    caseNumber: 'WP/2024/0298',
    title: 'Contractual Staff Assn. vs. University',
    subject: 'Regularisation of contractual laboratory staff',
    brief:
      'Petition seeking regularisation of long-serving contractual lab technicians.',
    courtId: 2,
    courtName: 'High Court of MP, Indore Bench',
    caseTypeId: 3,
    caseTypeName: 'Writ Petition',
    partyTypeId: 2,
    partyTypeName: 'University (Respondent)',
    advocateId: 4,
    advocateName: 'Adv. Anjali Verma',
    filingDate: '30 Apr 2024',
    status: 'Pending',
    remarks: 'Notice issued; counter-affidavit under preparation.',
  },
  {
    id: 9,
    caseNumber: 'CS/2024/0115',
    title: 'University vs. Ex-Registrar (Asset Recovery)',
    subject: 'Recovery of unaccounted advance',
    brief:
      'Civil suit for recovery of an unadjusted advance drawn during tenure.',
    courtId: 1,
    courtName: 'District Court, Indore',
    caseTypeId: 1,
    caseTypeName: 'Civil',
    partyTypeId: 1,
    partyTypeName: 'University (Petitioner)',
    advocateId: 2,
    advocateName: 'Adv. Meera Iyer',
    filingDate: '17 Jan 2024',
    status: 'Pending',
    remarks: 'Summons served; written statement awaited.',
  },
  {
    id: 10,
    caseNumber: 'CR/2023/0058',
    title: 'University vs. Vendor (Fake Certificates)',
    subject: 'Criminal case on forged supply certificates',
    brief:
      'Complaint regarding forged ISI certificates submitted during a lab-equipment tender.',
    courtId: 5,
    courtName: 'District Court, Bhopal',
    caseTypeId: 2,
    caseTypeName: 'Criminal',
    partyTypeId: 1,
    partyTypeName: 'University (Petitioner)',
    advocateId: 3,
    advocateName: 'Adv. S. P. Nair',
    filingDate: '25 Jul 2023',
    counterAffidavitDate: '12 Sep 2023',
    status: 'Against',
    disposalDate: '18 Oct 2024',
    judgmentDoc: 'judgment_CR_2023_0058.pdf',
    remarks: 'Accused acquitted for want of corroborative evidence.',
  },
  {
    id: 11,
    caseNumber: 'WP/2024/0331',
    title: 'Dr. N. Bose vs. University (Disciplinary)',
    subject: 'Challenge to suspension pending inquiry',
    brief:
      'Petition challenging the suspension order issued pending a departmental inquiry.',
    courtId: 2,
    courtName: 'High Court of MP, Indore Bench',
    caseTypeId: 3,
    caseTypeName: 'Writ Petition',
    partyTypeId: 2,
    partyTypeName: 'University (Respondent)',
    advocateId: 1,
    advocateName: 'Adv. R. K. Sharma',
    filingDate: '08 May 2024',
    status: 'Pending',
    remarks: 'Interim stay on suspension granted; matter part-heard.',
  },
  {
    id: 12,
    caseNumber: 'SLP/2024/0009',
    title: 'University vs. Students Union (Fee SLP)',
    subject: 'Special leave petition against fee-hike judgment',
    brief:
      'SLP filed before the Supreme Court against the High Court order rolling back the fee revision.',
    courtId: 3,
    courtName: 'Supreme Court of India',
    caseTypeId: 3,
    caseTypeName: 'Writ Petition',
    partyTypeId: 1,
    partyTypeName: 'University (Petitioner)',
    advocateId: 5,
    advocateName: 'Adv. Devendra Joshi',
    filingDate: '15 Sep 2024',
    status: 'Pending',
    remarks: 'Listed for admission hearing.',
  },
];

// ─── Hearings ───────────────────────────────────────────────────────────────

export const hearings: Hearing[] = [
  {
    id: 1,
    caseId: 1,
    caseNumber: 'WP/2024/0142',
    hearingDate: '14 Mar 2024',
    courtName: 'High Court of MP, Indore Bench',
    attendance: 'Attended',
    notes: 'Rejoinder time sought by petitioner.',
    nextHearingDate: '18 Jul 2026',
    status: 'Adjourned',
  },
  {
    id: 2,
    caseId: 1,
    caseNumber: 'WP/2024/0142',
    hearingDate: '02 May 2024',
    courtName: 'High Court of MP, Indore Bench',
    attendance: 'Attended',
    notes: 'Arguments on maintainability heard.',
    nextHearingDate: '20 Jul 2026',
    status: 'Scheduled',
  },
  {
    id: 3,
    caseId: 3,
    caseNumber: 'OA/2024/0056',
    hearingDate: '10 Apr 2024',
    courtName: 'Central Administrative Tribunal',
    attendance: 'Attended',
    notes: 'Reply time granted to respondent.',
    nextHearingDate: '16 Jul 2026',
    status: 'Scheduled',
  },
  {
    id: 4,
    caseId: 5,
    caseNumber: 'CR/2024/0031',
    hearingDate: '01 Mar 2024',
    courtName: 'District Court, Indore',
    attendance: 'Not Attended',
    notes: 'IO absent; charge-sheet awaited.',
    nextHearingDate: '22 Jul 2026',
    status: 'Adjourned',
  },
  {
    id: 5,
    caseId: 2,
    caseNumber: 'CS/2023/0891',
    hearingDate: '15 Nov 2024',
    courtName: 'District Court, Indore',
    attendance: 'Attended',
    notes: 'Final arguments concluded; judgment reserved.',
    status: 'Completed',
  },
  {
    id: 6,
    caseId: 11,
    caseNumber: 'WP/2024/0331',
    hearingDate: '20 May 2024',
    courtName: 'High Court of MP, Indore Bench',
    attendance: 'Attended',
    notes: 'Interim stay granted on suspension.',
    nextHearingDate: '17 Jul 2026',
    status: 'Scheduled',
  },
  {
    id: 7,
    caseId: 8,
    caseNumber: 'WP/2024/0298',
    hearingDate: '12 Jun 2024',
    courtName: 'High Court of MP, Indore Bench',
    attendance: 'Attended',
    notes: 'Notice returnable; counter to be filed.',
    nextHearingDate: '24 Jul 2026',
    status: 'Scheduled',
  },
];

// ─── Advocate Payments ──────────────────────────────────────────────────────

export const payments: Payment[] = [
  {
    id: 1,
    caseId: 1,
    caseNumber: 'WP/2024/0142',
    advocateName: 'Adv. R. K. Sharma',
    hearingDate: '14 Mar 2024',
    description: 'Appearance & drafting of counter-affidavit',
    mode: 'Transfer',
    amount: 25000,
    txnId: 'NEFT-8841203',
    txnDate: '20 Mar 2024',
    status: 'Paid',
  },
  {
    id: 2,
    caseId: 1,
    caseNumber: 'WP/2024/0142',
    advocateName: 'Adv. R. K. Sharma',
    hearingDate: '02 May 2024',
    description: 'Appearance fee',
    mode: 'Transfer',
    amount: 15000,
    txnId: 'NEFT-8890114',
    txnDate: '08 May 2024',
    status: 'Verified',
  },
  {
    id: 3,
    caseId: 2,
    caseNumber: 'CS/2023/0891',
    advocateName: 'Adv. Meera Iyer',
    hearingDate: '15 Nov 2024',
    description: 'Final arguments & judgment appearance',
    mode: 'Cheque',
    amount: 40000,
    txnId: 'CHQ-556201',
    txnDate: '25 Nov 2024',
    status: 'Paid',
  },
  {
    id: 4,
    caseId: 3,
    caseNumber: 'OA/2024/0056',
    advocateName: 'Adv. Anjali Verma',
    hearingDate: '10 Apr 2024',
    description: 'Consultation & OA reply drafting',
    mode: 'Online',
    amount: 18000,
    txnId: 'UPI-2204119',
    txnDate: '15 Apr 2024',
    status: 'Logged',
  },
  {
    id: 5,
    caseId: 11,
    caseNumber: 'WP/2024/0331',
    advocateName: 'Adv. R. K. Sharma',
    hearingDate: '20 May 2024',
    description: 'Stay application & appearance',
    mode: 'Transfer',
    amount: 30000,
    txnId: 'NEFT-8912780',
    txnDate: '27 May 2024',
    status: 'Verified',
  },
];

// ─── Status → StatusBadge variant mappers ───────────────────────────────────

export function caseStatusVariant(
  status: CaseStatus
): 'warning' | 'success' | 'danger' | 'muted' {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'In-favour':
      return 'success';
    case 'Against':
      return 'danger';
    case 'Disposed':
      return 'muted';
  }
}

export function hearingStatusVariant(
  status: HearingStatus
): 'info' | 'success' | 'warning' {
  switch (status) {
    case 'Scheduled':
      return 'info';
    case 'Completed':
      return 'success';
    case 'Adjourned':
      return 'warning';
  }
}

export function paymentStatusVariant(
  status: PaymentStatus
): 'warning' | 'info' | 'success' {
  switch (status) {
    case 'Logged':
      return 'warning';
    case 'Verified':
      return 'info';
    case 'Paid':
      return 'success';
  }
}
