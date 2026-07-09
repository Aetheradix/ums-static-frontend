import { create } from 'zustand';
import type {
  AppNotification,
  Branch,
  CalendarEvent,
  CertificateRequest,
  ExamRegistration,
  FeePayment,
  ImportedStudentRow,
  AdminRole,
} from '../types';
import { NOTIFICATIONS, SEED_CERTIFICATE_REQUESTS } from '../data';
import { DEFAULT_MATRIX } from '../data/domain';

export interface InternalOverride {
  mst2: number | null;
  quiz: number | null;
}

export function overrideKey(courseCode: string, enrollmentNo: string): string {
  return `${courseCode}:${enrollmentNo}`;
}

interface LifecycleState {
  // Current session states
  currentStudentNo: string;
  setCurrentStudent: (no: string) => void;
  currentAdminRole: AdminRole;
  setCurrentAdminRole: (role: AdminRole) => void;
  currentFacultyId: string;
  setCurrentFacultyId: (id: string) => void;

  // Demo overrides (in-memory only, resets on refresh)
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  certificates: CertificateRequest[];
  addCertificate: (
    req: Pick<CertificateRequest, 'type' | 'copies' | 'purpose' | 'delivery'>
  ) => void;

  examRegistrations: Record<string, ExamRegistration>;
  submitExamForm: (
    enrollmentNo: string,
    reg: Omit<ExamRegistration, 'submitted' | 'hallTicketNo'>
  ) => string;

  internalOverrides: Record<string, InternalOverride>;
  saveInternalMarks: (
    courseCode: string,
    enrollmentNo: string,
    override: InternalOverride
  ) => void;

  paidFees: Record<string, FeePayment>;
  recordPayments: (payments: FeePayment[]) => void;

  importedStudents: ImportedStudentRow[];
  importStudents: (rows: ImportedStudentRow[]) => void;

  deactivatedUserIds: string[];
  toggleUserActive: (id: string) => void;

  broadcast: (input: {
    title: string;
    message: string;
    kind: AppNotification['kind'];
    href?: string;
  }) => void;

  extraEvents: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  extraBranches: Branch[];
  addBranch: (branch: Branch) => void;

  // Access Control Matrix
  permissionMatrix: Record<string, string[]>;
  togglePermission: (role: string, perm: string) => void;
  resetPermissionMatrix: () => void;

  // Portal Settings
  instituteName: string;
  currentSemester: number;
  session: string;
  attendanceThreshold: number;
  feeStructure: {
    tuition: number;
    exam: number;
    hostel: number;
  };
  studentFeatures: {
    fees: boolean;
    services: boolean;
    notifications: boolean;
  };
  accentColor: string;
  updateSettings: (
    settings: Partial<Omit<LifecycleState, 'feeStructure' | 'studentFeatures'>>
  ) => void;
  updateFeeStructure: (fees: Partial<LifecycleState['feeStructure']>) => void;
  toggleStudentFeature: (key: 'fees' | 'services' | 'notifications') => void;
}

export const useLifecycleStore = create<LifecycleState>(set => ({
  currentStudentNo: 'DE24CS0042', // Aarav Sharma (Good Standing)
  setCurrentStudent: no => set({ currentStudentNo: no }),
  currentAdminRole: 'super',
  setCurrentAdminRole: role => set({ currentAdminRole: role }),
  currentFacultyId: 'IET-CS-014', // Dr. Neha Agarwal
  setCurrentFacultyId: id => set({ currentFacultyId: id }),

  notifications: NOTIFICATIONS.map(n => ({ ...n })),
  markNotificationRead: id =>
    set(s => ({
      notifications: s.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set(s => ({
      notifications: s.notifications.map(n => ({ ...n, read: true })),
    })),

  certificates: SEED_CERTIFICATE_REQUESTS.map(c => ({ ...c })),
  addCertificate: req =>
    set(s => ({
      certificates: [
        {
          ...req,
          id: `cert-${Date.now()}`,
          requestedOn: new Date().toISOString(),
          status: 'Submitted',
        },
        ...s.certificates,
      ],
    })),

  examRegistrations: {},
  submitExamForm: (enrollmentNo, reg) => {
    const hallTicketNo = `HT/2026/${enrollmentNo.slice(-4)}`;
    set(s => ({
      examRegistrations: {
        ...s.examRegistrations,
        [enrollmentNo]: { ...reg, submitted: true, hallTicketNo },
      },
    }));
    return hallTicketNo;
  },

  internalOverrides: {},
  saveInternalMarks: (courseCode, enrollmentNo, override) =>
    set(s => ({
      internalOverrides: {
        ...s.internalOverrides,
        [overrideKey(courseCode, enrollmentNo)]: override,
      },
    })),

  paidFees: {},
  recordPayments: payments =>
    set(s => {
      const next = { ...s.paidFees };
      payments.forEach(p => {
        next[p.feeId] = p;
      });
      return { paidFees: next };
    }),

  importedStudents: [],
  importStudents: rows =>
    set(s => ({ importedStudents: [...rows, ...s.importedStudents] })),

  deactivatedUserIds: [],
  toggleUserActive: id =>
    set(s => ({
      deactivatedUserIds: s.deactivatedUserIds.includes(id)
        ? s.deactivatedUserIds.filter(x => x !== id)
        : [...s.deactivatedUserIds, id],
    })),

  broadcast: input =>
    set(s => ({
      notifications: [
        {
          id: `bc-${Date.now()}`,
          read: false,
          date: new Date().toISOString(),
          ...input,
        },
        ...s.notifications,
      ],
    })),

  extraEvents: [],
  addEvent: event => set(s => ({ extraEvents: [event, ...s.extraEvents] })),
  extraBranches: [],
  addBranch: branch =>
    set(s => ({ extraBranches: [...s.extraBranches, branch] })),

  // Permissions Matrix
  permissionMatrix: JSON.parse(JSON.stringify(DEFAULT_MATRIX)),
  togglePermission: (role, perm) =>
    set(s => {
      const current = s.permissionMatrix[role] ?? [];
      const updated = current.includes(perm)
        ? current.filter(x => x !== perm)
        : [...current, perm];
      return {
        permissionMatrix: {
          ...s.permissionMatrix,
          [role]: updated,
        },
      };
    }),
  resetPermissionMatrix: () =>
    set({ permissionMatrix: JSON.parse(JSON.stringify(DEFAULT_MATRIX)) }),

  // Portal Settings
  instituteName: 'IET DAVV',
  currentSemester: 5,
  session: 'July–Dec 2026',
  attendanceThreshold: 75,
  feeStructure: {
    tuition: 45000,
    exam: 2500,
    hostel: 18000,
  },
  studentFeatures: {
    fees: true,
    services: true,
    notifications: true,
  },
  accentColor: 'indigo',
  updateSettings: settings => set(s => ({ ...s, ...settings })),
  updateFeeStructure: fees =>
    set(s => ({
      feeStructure: {
        ...s.feeStructure,
        ...fees,
      },
    })),
  toggleStudentFeature: key =>
    set(s => ({
      studentFeatures: {
        ...s.studentFeatures,
        [key]: !s.studentFeatures[key],
      },
    })),
}));
