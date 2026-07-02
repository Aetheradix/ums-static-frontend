export type ApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Fee Pending'
  | 'Approved'
  | 'Rejected';

export type WorkflowActorRole = 'student' | 'admin' | 'system';

export interface ApplicationHistoryEvent {
  from: ApplicationStatus | 'DRAFT';
  to: ApplicationStatus;
  at: string;
  actorRole: WorkflowActorRole;
  reason?: string;
}

export interface SeedApplication {
  id: string;
  applicationNo: string;
  applicantName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  programmeId: number;
  programmeName: string;
  category: 'General' | 'OBC' | 'SC' | 'ST';
  admissionType: 'Entrance' | 'Merit';
  academicSession: string;
  submittedAt: string;
  status: ApplicationStatus;
  feePaid: boolean;
  feeAmount: number;
  entranceScore?: number;
  meritPercentage?: number;

  // Workflow audit trail (Plan A)
  history: ApplicationHistoryEvent[];
  rejectionReason?: string;
}

let MOCK_APPLICATIONS: SeedApplication[] = [
  {
    id: 'APP001',
    applicationNo: 'ADM-2024-0001',
    applicantName: 'Arjun Mehta',
    email: 'arjun.mehta@example.com',
    phone: '9876500001',
    gender: 'Male',
    dateOfBirth: '2003-04-15',
    programmeId: 1,
    programmeName: 'B.Tech Computer Science',
    category: 'General',
    admissionType: 'Entrance',
    academicSession: '2024-2025',
    submittedAt: '2024-06-10',
    status: 'Approved',
    feePaid: true,
    feeAmount: 25000,
    entranceScore: 87,
    history: [
      {
        from: 'DRAFT',
        to: 'Submitted',
        at: '2024-06-10',
        actorRole: 'student',
      },
      {
        from: 'Submitted',
        to: 'Under Review',
        at: '2024-06-12',
        actorRole: 'admin',
      },
      {
        from: 'Under Review',
        to: 'Fee Pending',
        at: '2024-06-14',
        actorRole: 'admin',
      },
      {
        from: 'Fee Pending',
        to: 'Approved',
        at: '2024-06-20',
        actorRole: 'admin',
      },
    ],
  },
  {
    id: 'APP002',
    applicationNo: 'ADM-2024-0002',
    applicantName: 'Sneha Gupta',
    email: 'sneha.gupta@example.com',
    phone: '9876500002',
    gender: 'Female',
    dateOfBirth: '2003-08-22',
    programmeId: 1,
    programmeName: 'B.Tech Computer Science',
    category: 'OBC',
    admissionType: 'Merit',
    academicSession: '2024-2025',
    submittedAt: '2024-06-11',
    status: 'Fee Pending',
    feePaid: false,
    feeAmount: 20000,
    meritPercentage: 92.4,
    history: [
      {
        from: 'DRAFT',
        to: 'Submitted',
        at: '2024-06-11',
        actorRole: 'student',
      },
      {
        from: 'Submitted',
        to: 'Under Review',
        at: '2024-06-13',
        actorRole: 'admin',
      },
      {
        from: 'Under Review',
        to: 'Fee Pending',
        at: '2024-06-15',
        actorRole: 'admin',
      },
    ],
  },
  {
    id: 'APP003',
    applicationNo: 'ADM-2024-0003',
    applicantName: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '9876500003',
    gender: 'Male',
    dateOfBirth: '2002-11-30',
    programmeId: 2,
    programmeName: 'MBA Finance',
    category: 'General',
    admissionType: 'Entrance',
    academicSession: '2024-2025',
    submittedAt: '2024-06-12',
    status: 'Under Review',
    feePaid: false,
    feeAmount: 35000,
    entranceScore: 74,
    history: [
      {
        from: 'DRAFT',
        to: 'Submitted',
        at: '2024-06-12',
        actorRole: 'student',
      },
      {
        from: 'Submitted',
        to: 'Under Review',
        at: '2024-06-13',
        actorRole: 'admin',
      },
    ],
  },
  {
    id: 'APP004',
    applicationNo: 'ADM-2024-0004',
    applicantName: 'Pooja Singh',
    email: 'pooja.singh@example.com',
    phone: '9876500004',
    gender: 'Female',
    dateOfBirth: '2003-01-05',
    programmeId: 3,
    programmeName: 'B.Sc Physics',
    category: 'SC',
    admissionType: 'Merit',
    academicSession: '2024-2025',
    submittedAt: '2024-06-13',
    status: 'Submitted',
    feePaid: false,
    feeAmount: 15000,
    meritPercentage: 88.0,
    history: [
      {
        from: 'DRAFT',
        to: 'Submitted',
        at: '2024-06-13',
        actorRole: 'student',
      },
    ],
  },
  {
    id: 'APP005',
    applicationNo: 'ADM-2024-0005',
    applicantName: 'Kiran Reddy',
    email: 'kiran.reddy@example.com',
    phone: '9876500005',
    gender: 'Male',
    dateOfBirth: '2003-07-18',
    programmeId: 1,
    programmeName: 'B.Tech Computer Science',
    category: 'General',
    admissionType: 'Entrance',
    academicSession: '2024-2025',
    submittedAt: '2024-06-13',
    status: 'Rejected',
    feePaid: false,
    feeAmount: 25000,
    entranceScore: 42,
    rejectionReason: 'Insufficient entrance score.',
    history: [
      {
        from: 'DRAFT',
        to: 'Submitted',
        at: '2024-06-13',
        actorRole: 'student',
      },
      {
        from: 'Submitted',
        to: 'Under Review',
        at: '2024-06-15',
        actorRole: 'admin',
      },
      {
        from: 'Under Review',
        to: 'Rejected',
        at: '2024-06-18',
        actorRole: 'admin',
        reason: 'Insufficient entrance score.',
      },
    ],
  },
  {
    id: 'APP006',
    applicationNo: 'ADM-2024-0006',
    applicantName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9876500006',
    gender: 'Female',
    dateOfBirth: '2002-03-25',
    programmeId: 2,
    programmeName: 'MBA Finance',
    category: 'General',
    admissionType: 'Merit',
    academicSession: '2024-2025',
    submittedAt: '2024-06-14',
    status: 'Approved',
    feePaid: true,
    feeAmount: 35000,
    meritPercentage: 95.2,
    history: [
      {
        from: 'DRAFT',
        to: 'Submitted',
        at: '2024-06-14',
        actorRole: 'student',
      },
      {
        from: 'Submitted',
        to: 'Under Review',
        at: '2024-06-16',
        actorRole: 'admin',
      },
      {
        from: 'Under Review',
        to: 'Fee Pending',
        at: '2024-06-18',
        actorRole: 'admin',
      },
      {
        from: 'Fee Pending',
        to: 'Approved',
        at: '2024-06-22',
        actorRole: 'admin',
      },
    ],
  },
  {
    id: 'APP007',
    applicationNo: 'ADM-2024-0007',
    applicantName: 'Vikram Yadav',
    email: 'vikram.yadav@example.com',
    phone: '9876500007',
    gender: 'Male',
    dateOfBirth: '2003-09-10',
    programmeId: 3,
    programmeName: 'B.Sc Physics',
    category: 'OBC',
    admissionType: 'Merit',
    academicSession: '2024-2025',
    submittedAt: '2024-06-15',
    status: 'Fee Pending',
    feePaid: false,
    feeAmount: 15000,
    meritPercentage: 78.5,
    history: [
      {
        from: 'DRAFT',
        to: 'Submitted',
        at: '2024-06-15',
        actorRole: 'student',
      },
      {
        from: 'Submitted',
        to: 'Under Review',
        at: '2024-06-16',
        actorRole: 'admin',
      },
      {
        from: 'Under Review',
        to: 'Fee Pending',
        at: '2024-06-18',
        actorRole: 'admin',
      },
    ],
  },
  {
    id: 'APP008',
    applicationNo: 'ADM-2024-0008',
    applicantName: 'Meera Joshi',
    email: 'meera.joshi@example.com',
    phone: '9876500008',
    gender: 'Female',
    dateOfBirth: '2003-05-20',
    programmeId: 1,
    programmeName: 'B.Tech Computer Science',
    category: 'ST',
    admissionType: 'Entrance',
    academicSession: '2024-2025',
    submittedAt: '2024-06-16',
    status: 'Under Review',
    feePaid: false,
    feeAmount: 20000,
    entranceScore: 81,
    history: [
      {
        from: 'DRAFT',
        to: 'Submitted',
        at: '2024-06-16',
        actorRole: 'student',
      },
      {
        from: 'Submitted',
        to: 'Under Review',
        at: '2024-06-17',
        actorRole: 'admin',
      },
    ],
  },
  {
    id: 'APP009',
    applicationNo: 'ADM-2024-0009',
    applicantName: 'Suresh Patil',
    email: 'suresh.patil@example.com',
    phone: '9876500009',
    gender: 'Male',
    dateOfBirth: '2002-12-12',
    programmeId: 2,
    programmeName: 'MBA Finance',
    category: 'SC',
    admissionType: 'Entrance',
    academicSession: '2024-2025',
    submittedAt: '2024-06-17',
    status: 'Submitted',
    feePaid: false,
    feeAmount: 30000,
    entranceScore: 68,
    history: [
      {
        from: 'DRAFT',
        to: 'Submitted',
        at: '2024-06-17',
        actorRole: 'student',
      },
    ],
  },
  {
    id: 'APP010',
    applicationNo: 'ADM-2024-0010',
    applicantName: 'Divya Nair',
    email: 'divya.nair@example.com',
    phone: '9876500010',
    gender: 'Female',
    dateOfBirth: '2003-02-28',
    programmeId: 3,
    programmeName: 'B.Sc Physics',
    category: 'General',
    admissionType: 'Merit',
    academicSession: '2024-2025',
    submittedAt: '2024-06-18',
    status: 'Approved',
    feePaid: true,
    feeAmount: 15000,
    meritPercentage: 91.0,
    history: [
      {
        from: 'DRAFT',
        to: 'Submitted',
        at: '2024-06-18',
        actorRole: 'student',
      },
      {
        from: 'Submitted',
        to: 'Under Review',
        at: '2024-06-19',
        actorRole: 'admin',
      },
      {
        from: 'Under Review',
        to: 'Fee Pending',
        at: '2024-06-20',
        actorRole: 'admin',
      },
      {
        from: 'Fee Pending',
        to: 'Approved',
        at: '2024-06-25',
        actorRole: 'admin',
      },
    ],
  },
];

function canTransition(from: ApplicationStatus, to: ApplicationStatus) {
  // Plan A transition guardrails
  if (from === to) return false;

  if (from === 'Approved') return false; // terminal

  if (from === 'Submitted' && to === 'Under Review') return true;
  if (from === 'Under Review' && to === 'Fee Pending') return true;
  if (from === 'Fee Pending' && to === 'Approved') return true;

  // Any non-terminal state can be rejected
  if (to === 'Rejected') return true;

  return false;
}

function nowIso() {
  // readable ISO; keeps mock simple
  return new Date().toISOString();
}

export const ApplicationSeedService = {
  getAll: async () => Promise.resolve([...MOCK_APPLICATIONS]),

  getById: async (id: string) =>
    Promise.resolve(MOCK_APPLICATIONS.find(a => a.id === id) ?? null),

  updateStatus: async (
    id: string,
    status: ApplicationStatus,
    actorRole: WorkflowActorRole = 'admin',
    reason?: string
  ) => {
    const app = MOCK_APPLICATIONS.find(a => a.id === id);
    if (!app) return Promise.resolve(null);

    if (!canTransition(app.status, status)) {
      throw new Error(
        `Invalid transition from "${app.status}" to "${status}".`
      );
    }

    const event: ApplicationHistoryEvent = {
      from: app.status,
      to: status,
      at: nowIso(),
      actorRole,
      reason: status === 'Rejected' ? reason : undefined,
    };

    MOCK_APPLICATIONS = MOCK_APPLICATIONS.map(a => {
      if (a.id !== id) return a;

      return {
        ...a,
        status,
        rejectionReason: status === 'Rejected' ? reason : a.rejectionReason,
        history: [...(a.history ?? []), event],
      };
    });

    return Promise.resolve(MOCK_APPLICATIONS.find(a => a.id === id) ?? null);
  },

  approveAll: async (ids: string[]) => {
    // Bulk approval should respect transition rules too.
    // For simplicity, we only allow approving those currently in Fee Pending.
    MOCK_APPLICATIONS = MOCK_APPLICATIONS.map(a => {
      if (!ids.includes(a.id)) return a;

      if (a.status !== 'Fee Pending') return a;

      return {
        ...a,
        status: 'Approved',
        history: [
          ...(a.history ?? []),
          {
            from: a.status,
            to: 'Approved',
            at: nowIso(),
            actorRole: 'admin',
          },
        ],
      };
    });
    return Promise.resolve(true);
  },

  getMyApplication: async () =>
    // Returns the first application as the "logged-in student's" application
    Promise.resolve(MOCK_APPLICATIONS[1]),
};
