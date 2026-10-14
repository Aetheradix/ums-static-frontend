import type {
  ApplicationStatus,
  Bill,
  BillStatus,
  DailyLog,
  LogStatus,
  RateMaster,
} from './types';

type BadgeVariant =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'neutral'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'muted';

const TITLES = /^(dr|prof|mr|mrs|ms|miss|shri|smt|er)\.?\s+/i;

/**
 * Unique ID = first 4 letters of the name + last 4 characters of the PAN.
 * Titles (Dr., Prof., Mr., …), spaces and dots are dropped first, so
 * "Dr. Rahul Sharma" + "ABCPS1234F" → "RAHU234F".
 */
export function makeUniqueId(fullName: string, pan: string): string {
  let name = fullName.trim();
  while (TITLES.test(name)) name = name.replace(TITLES, '');
  const letters = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return `${letters.slice(0, 4)}${pan.trim().toUpperCase().slice(-4)}`;
}

export const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Jul–Dec is the odd semester, Jan–Jun the even one. */
export function currentSemester(date = new Date()): 'Odd' | 'Even' {
  return date.getMonth() >= 6 ? 'Odd' : 'Even';
}

export function currentSession(date = new Date()): string {
  const y = date.getFullYear();
  return date.getMonth() >= 6 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

export const inr = (n: number) =>
  `₹${Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

/** Local `YYYY-MM-DD` — `toISOString()` would shift IST dates back a day. */
export const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const todayIso = () => toIso(new Date());

export const fromIso = (iso?: string) => {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

/** `2026-09` → `September 2026`. */
export const periodLabel = (period: string) => {
  const [y, m] = period.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
};

export const periodOf = (iso: string) => iso.slice(0, 7);

export function countSessions(logs: DailyLog[]) {
  let theory = 0;
  let practical = 0;
  for (const log of logs) {
    for (const s of log.sessions) {
      if (s.type === 'Theory') theory++;
      else practical++;
    }
  }
  return { days: logs.length, theory, practical };
}

export const billAmountOf = (
  theory: number,
  practical: number,
  rates: RateMaster
) => theory * rates.theoryRate + practical * rates.practicalRate;

/**
 * The ₹30,000 rule. Payable = lower of the bill and what is left under the
 * limit after everything already paid to the same Unique ID for the period,
 * from every UTD.
 */
export function limitCheck(bill: Bill, allBills: Bill[], rates: RateMaster) {
  const sameIdPeriod = allBills.filter(
    b => b.uniqueId === bill.uniqueId && b.period === bill.period
  );
  const alreadyPaid = sameIdPeriod
    .filter(b => b.id !== bill.id && b.payable !== undefined && b.paidOn)
    .reduce((sum, b) => sum + (b.payable ?? 0), 0);
  const balance = Math.max(rates.limit - alreadyPaid, 0);
  const payable = Math.min(bill.billAmount, balance);
  return {
    related: sameIdPeriod,
    alreadyPaid,
    balance,
    payable,
    notPayable: bill.billAmount - payable,
  };
}

export function applicationVariant(status: ApplicationStatus): BadgeVariant {
  switch (status) {
    case 'Joined':
      return 'success';
    case 'Rejected':
    case 'Not Selected':
      return 'danger';
    case 'Returned by Registrar & VC':
      return 'warning';
    case 'In Merit List':
    case 'Pending Approval':
      return 'info';
    case 'In Scrutiny List':
    case 'Interview Scheduled':
      return 'approved';
    default:
      return 'pending';
  }
}

export function logVariant(status: LogStatus): BadgeVariant {
  if (status === 'Verified') return 'success';
  if (status === 'Rejected') return 'danger';
  return 'pending';
}

export function billVariant(status: BillStatus): BadgeVariant {
  switch (status) {
    case 'Paid':
      return 'success';
    case 'Partially Paid':
      return 'warning';
    case 'Not Payable':
      return 'danger';
    case 'Sent to Finance':
    case 'Under Verification':
      return 'info';
    case 'Pending Registrar & VC Approval':
      return 'warning';
    case 'Approved by Registrar & VC':
      return 'approved';
    default:
      return 'pending';
  }
}

/** Adds the derived Unique ID as a field so grids can show and search it. */
export const withUniqueId = <T extends { fullName: string; pan: string }>(
  rows: T[]
) => rows.map(r => ({ ...r, uniqueId: makeUniqueId(r.fullName, r.pan) }));

/**
 * Pays the unpaid bills of a batch one after another, so each bill sees
 * what the earlier ones already paid to the same Unique ID.
 */
export function simulateBatchPayment(
  items: Bill[],
  allBills: Bill[],
  rates: RateMaster
) {
  let working = [...allBills];
  const today = todayIso();
  return items
    .filter(b => !b.paidOn)
    .map(b => {
      const { payable, notPayable } = limitCheck(b, working, rates);
      working = working.map(w =>
        w.id === b.id ? { ...w, payable, notPayable, paidOn: today } : w
      );
      return { bill: b, payable, notPayable };
    });
}

/** Bills that have reached Finance — the ones counted in a department total. */
export const AT_FINANCE: BillStatus[] = [
  'Sent to Finance',
  'Under Verification',
  'Pending Registrar & VC Approval',
  'Approved by Registrar & VC',
  'Paid',
  'Partially Paid',
  'Not Payable',
];

/** Statuses Finance still has to act on. */
export const FINANCE_PENDING: BillStatus[] = [
  'Sent to Finance',
  'Under Verification',
  'Approved by Registrar & VC',
];

/**
 * A UTD's bills for one month, taken together. If their total crosses the
 * approval threshold (₹50,000), Finance must get Registrar & VC approval
 * for the batch before releasing any payment from it.
 */
export function deptBatch(
  department: string,
  period: string,
  bills: Bill[],
  rates: RateMaster
) {
  const items = bills.filter(
    b =>
      b.department === department &&
      b.period === period &&
      AT_FINANCE.includes(b.status)
  );
  const total = items.reduce((s, b) => s + b.billAmount, 0);
  const needsApproval = total > rates.approvalThreshold;
  const unpaid = items.filter(b => !b.paidOn);
  const awaiting = unpaid.some(
    b => b.status === 'Pending Registrar & VC Approval'
  );
  const approved =
    !needsApproval ||
    unpaid.every(b => b.status === 'Approved by Registrar & VC');
  return { items, total, needsApproval, awaiting, approved };
}
