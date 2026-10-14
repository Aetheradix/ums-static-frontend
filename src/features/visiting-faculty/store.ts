import { create } from 'zustand';
import {
  DEFAULT_RATES,
  SEED_APPLICATIONS,
  SEED_BILLS,
  SEED_LOGS,
} from './data';
import type {
  Application,
  Bill,
  DailyLog,
  Faculty,
  Interview,
  RateMaster,
  TeachingSession,
} from './types';
import {
  billAmountOf,
  countSessions,
  deptBatch,
  simulateBatchPayment,
  limitCheck,
  makeUniqueId,
  periodOf,
  todayIso,
} from './utils';

/** What the public form submits — everything the workflow adds is omitted. */
export type ApplicationForm = Omit<
  Application,
  | 'id'
  | 'applicationNo'
  | 'submittedOn'
  | 'department'
  | 'status'
  | 'rejectionReason'
  | 'verifiedOn'
  | 'interview'
  | 'meritRank'
  | 'forwardedOn'
  | 'headOfficeRemarks'
  | 'joinedOn'
>;

interface VisitingFacultyState {
  applications: Application[];
  logs: DailyLog[];
  bills: Bill[];
  rates: RateMaster;
  /** The UTD the department login is acting for (auth is mocked). */
  currentDept: string;

  setCurrentDept: (code: string) => void;
  setRates: (rates: RateMaster) => void;

  // Joining process
  submitApplication: (
    form: ApplicationForm,
    departments: string[]
  ) => Application[];
  verifyApplication: (id: string) => void;
  rejectApplication: (id: string, reason: string) => void;
  scheduleInterview: (ids: string[], interview: Interview) => void;
  recordInterviewResult: (
    id: string,
    result: 'Finalised' | 'Not Selected',
    marks: number | undefined,
    remarks: string
  ) => void;
  forwardMeritList: (ids: string[]) => void;
  approveByHeadOffice: (ids: string[]) => void;
  returnByHeadOffice: (id: string, remarks: string) => void;

  // Mobile app
  markAttendance: (
    uniqueId: string,
    department: string,
    date: string,
    checkIn: string
  ) => void;
  addSession: (
    uniqueId: string,
    department: string,
    date: string,
    session: TeachingSession
  ) => void;

  // Payment process
  verifyLogs: (ids: string[]) => void;
  rejectLog: (id: string, remarks: string) => void;
  prepareBill: (
    department: string,
    faculty: Faculty,
    period: string
  ) => Bill | string;
  sendBillToFinance: (id: string) => void;
  takeUpBill: (id: string) => void;
  releasePayment: (id: string, transactionRef: string, remarks: string) => void;
  forwardBatchForApproval: (department: string, period: string) => void;
  approveBatch: (department: string, period: string, remarks: string) => void;
  returnBatch: (department: string, period: string, remarks: string) => void;
  releaseBatch: (
    department: string,
    period: string,
    transactionRef: string
  ) => { count: number; paid: number; notPayable: number };
}

let seq = 1000;
const nextId = (prefix: string) => `${prefix}-${++seq}`;

export const useVisitingFacultyStore = create<VisitingFacultyState>(
  (set, get) => ({
    applications: SEED_APPLICATIONS,
    logs: SEED_LOGS,
    bills: SEED_BILLS,
    rates: DEFAULT_RATES,
    currentDept: 'IET',

    setCurrentDept: code => set({ currentDept: code }),
    setRates: rates => set({ rates }),

    submitApplication: (form, departments) => {
      const submittedOn = todayIso();
      const created = departments.map<Application>(department => ({
        ...form,
        id: nextId('app'),
        applicationNo: `VF26-${department}-${String(++seq).padStart(4, '0')}`,
        submittedOn,
        department,
        status: 'Submitted',
      }));
      set(s => ({ applications: [...created, ...s.applications] }));
      return created;
    },

    verifyApplication: id =>
      patchApp(set, id, {
        status: 'In Scrutiny List',
        verifiedOn: todayIso(),
      }),

    rejectApplication: (id, reason) =>
      patchApp(set, id, { status: 'Rejected', rejectionReason: reason }),

    scheduleInterview: (ids, interview) =>
      set(s => ({
        applications: s.applications.map(a =>
          ids.includes(a.id)
            ? { ...a, status: 'Interview Scheduled', interview }
            : a
        ),
      })),

    recordInterviewResult: (id, result, marks, remarks) =>
      set(s => ({
        applications: s.applications.map(a =>
          a.id === id && a.interview
            ? {
                ...a,
                status:
                  result === 'Finalised' ? 'In Merit List' : 'Not Selected',
                interview: { ...a.interview, result, marks, remarks },
              }
            : a
        ),
      })),

    forwardMeritList: ids => {
      const forwardedOn = todayIso();
      const ranked = get()
        .applications.filter(a => ids.includes(a.id))
        .sort((a, b) => (b.interview?.marks ?? 0) - (a.interview?.marks ?? 0))
        .map(a => a.id);
      set(s => ({
        applications: s.applications.map(a =>
          ids.includes(a.id)
            ? {
                ...a,
                status: 'Pending Approval',
                forwardedOn,
                meritRank: ranked.indexOf(a.id) + 1,
                headOfficeRemarks: undefined,
              }
            : a
        ),
      }));
    },

    approveByHeadOffice: ids =>
      set(s => ({
        applications: s.applications.map(a =>
          ids.includes(a.id)
            ? { ...a, status: 'Joined', joinedOn: todayIso() }
            : a
        ),
      })),

    returnByHeadOffice: (id, remarks) =>
      patchApp(set, id, {
        status: 'Returned by Registrar & VC',
        headOfficeRemarks: remarks,
      }),

    markAttendance: (uniqueId, department, date, checkIn) => {
      const exists = get().logs.some(
        l =>
          l.uniqueId === uniqueId &&
          l.department === department &&
          l.date === date
      );
      if (exists) return;
      set(s => ({
        logs: [
          {
            id: nextId('log'),
            uniqueId,
            department,
            date,
            checkIn,
            location: `${department} campus, DAVV — geo-verified`,
            sessions: [],
            status: 'Pending',
          },
          ...s.logs,
        ],
      }));
    },

    addSession: (uniqueId, department, date, session) =>
      set(s => ({
        logs: s.logs.map(l =>
          l.uniqueId === uniqueId &&
          l.department === department &&
          l.date === date
            ? { ...l, sessions: [...l.sessions, session], status: 'Pending' }
            : l
        ),
      })),

    verifyLogs: ids =>
      set(s => ({
        logs: s.logs.map(l =>
          ids.includes(l.id)
            ? { ...l, status: 'Verified', remarks: undefined }
            : l
        ),
      })),

    rejectLog: (id, remarks) =>
      set(s => ({
        logs: s.logs.map(l =>
          l.id === id ? { ...l, status: 'Rejected', remarks } : l
        ),
      })),

    prepareBill: (department, faculty, period) => {
      const { bills, logs, rates } = get();
      const duplicate = bills.some(
        b =>
          b.department === department &&
          b.uniqueId === faculty.uniqueId &&
          b.period === period
      );
      if (duplicate)
        return 'A bill for this faculty and period already exists for this department.';
      const periodLogs = logs.filter(
        l =>
          l.uniqueId === faculty.uniqueId &&
          l.department === department &&
          periodOf(l.date) === period
      );
      if (periodLogs.some(l => l.status === 'Pending'))
        return 'Verify every mobile-app entry of the period before preparing the bill.';
      const verified = periodLogs.filter(l => l.status === 'Verified');
      if (!verified.length)
        return 'No verified attendance for this faculty in the period.';
      const { days, theory, practical } = countSessions(verified);
      const created: Bill = {
        id: nextId('bill'),
        billNo: `VFB/${department}/${period}/${String(++seq).slice(-3)}`,
        billDate: todayIso(),
        department,
        uniqueId: faculty.uniqueId,
        facultyName: faculty.fullName,
        period,
        daysPresent: days,
        theoryCount: theory,
        practicalCount: practical,
        theoryRate: rates.theoryRate,
        practicalRate: rates.practicalRate,
        billAmount: billAmountOf(theory, practical, rates),
        hodCertified: true,
        status: 'Prepared',
      };
      set(s => ({ bills: [created, ...s.bills] }));
      return created;
    },

    sendBillToFinance: id => patchBill(set, id, { status: 'Sent to Finance' }),

    takeUpBill: id =>
      set(s => ({
        bills: s.bills.map(b =>
          b.id === id && b.status === 'Sent to Finance'
            ? { ...b, status: 'Under Verification' }
            : b
        ),
      })),

    releasePayment: (id, transactionRef, remarks) => {
      const { bills, rates } = get();
      const target = bills.find(b => b.id === id);
      if (!target) return;
      // A UTD total above the threshold is paid only after Registrar & VC approval.
      if (!deptBatch(target.department, target.period, bills, rates).approved)
        return;
      const { payable, notPayable } = limitCheck(target, bills, rates);
      const status: Bill['status'] =
        payable === 0
          ? 'Not Payable'
          : notPayable > 0
            ? 'Partially Paid'
            : 'Paid';
      patchBill(set, id, {
        status,
        payable,
        notPayable,
        paidOn: todayIso(),
        transactionRef: payable > 0 ? transactionRef : undefined,
        financeRemarks: remarks || undefined,
      });
    },

    forwardBatchForApproval: (department, period) =>
      patchBatch(
        set,
        department,
        period,
        ['Sent to Finance', 'Under Verification'],
        {
          status: 'Pending Registrar & VC Approval',
          sentForApprovalOn: todayIso(),
          approvalRemarks: undefined,
        }
      ),

    approveBatch: (department, period, remarks) =>
      patchBatch(set, department, period, ['Pending Registrar & VC Approval'], {
        status: 'Approved by Registrar & VC',
        approvedOn: todayIso(),
        approvedBy: 'Registrar & VC Sir',
        approvalRemarks: remarks || undefined,
      }),

    returnBatch: (department, period, remarks) =>
      patchBatch(set, department, period, ['Pending Registrar & VC Approval'], {
        status: 'Under Verification',
        approvalRemarks: remarks,
      }),

    releaseBatch: (department, period, transactionRef) => {
      const { bills, rates } = get();
      const batch = deptBatch(department, period, bills, rates);
      if (!batch.approved) return { count: 0, paid: 0, notPayable: 0 };
      const results = simulateBatchPayment(batch.items, bills, rates);
      const paidOn = todayIso();
      set(s => ({
        bills: s.bills.map(b => {
          const r = results.find(x => x.bill.id === b.id);
          if (!r) return b;
          return {
            ...b,
            payable: r.payable,
            notPayable: r.notPayable,
            paidOn,
            status:
              r.payable === 0
                ? 'Not Payable'
                : r.notPayable > 0
                  ? 'Partially Paid'
                  : 'Paid',
            transactionRef: r.payable > 0 ? transactionRef : undefined,
          };
        }),
      }));
      return {
        count: results.length,
        paid: results.reduce((s, r) => s + r.payable, 0),
        notPayable: results.reduce((s, r) => s + r.notPayable, 0),
      };
    },
  })
);

type SetState = (
  fn: (s: VisitingFacultyState) => Partial<VisitingFacultyState>
) => void;

function patchBatch(
  set: SetState,
  department: string,
  period: string,
  from: Bill['status'][],
  patch: Partial<Bill>
) {
  set(s => ({
    bills: s.bills.map(b =>
      b.department === department &&
      b.period === period &&
      from.includes(b.status)
        ? { ...b, ...patch }
        : b
    ),
  }));
}

function patchApp(set: SetState, id: string, patch: Partial<Application>) {
  set(s => ({
    applications: s.applications.map(a =>
      a.id === id ? { ...a, ...patch } : a
    ),
  }));
}

function patchBill(set: SetState, id: string, patch: Partial<Bill>) {
  set(s => ({
    bills: s.bills.map(b => (b.id === id ? { ...b, ...patch } : b)),
  }));
}

/** Joined faculty, one row per Unique ID with every UTD they teach in. */
export function deriveFaculty(applications: Application[]): Faculty[] {
  const map = new Map<string, Faculty>();
  for (const a of applications) {
    if (a.status !== 'Joined') continue;
    const uniqueId = makeUniqueId(a.fullName, a.pan);
    const existing = map.get(uniqueId);
    if (existing) {
      existing.departments.push(a.department);
      existing.subjects.push(...a.subjects.filter(Boolean));
      existing.labs.push(...a.labs.filter(Boolean));
      if (a.joinedOn && a.joinedOn < existing.joinedOn)
        existing.joinedOn = a.joinedOn;
    } else {
      map.set(uniqueId, {
        uniqueId,
        fullName: a.fullName,
        pan: a.pan,
        mobile: a.mobile,
        email: a.email,
        departments: [a.department],
        subjects: a.subjects.filter(Boolean),
        labs: a.labs.filter(Boolean),
        joinedOn: a.joinedOn ?? a.submittedOn,
      });
    }
  }
  return [...map.values()];
}

/** PANs that already belong to a joined faculty — for the duplicate check. */
export function joinedPans(applications: Application[]) {
  return new Set(
    applications.filter(a => a.status === 'Joined').map(a => a.pan)
  );
}
