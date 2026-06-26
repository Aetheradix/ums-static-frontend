// ─── INITIAL EMPLOYEES ──────────────────────────────────────────────
export const INITIAL_EMPLOYEES: CareerAdvancement.Employee[] = [
  {
    id: 'EMP001',
    name: 'Dr. Ramesh Kumar',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    email: 'ramesh.kumar@university.edu',
    phone: '+91-9876543210',
  },
  {
    id: 'EMP002',
    name: 'Prof. Sunita Verma',
    designation: 'Associate Professor',
    department: 'Mathematics',
    email: 'sunita.verma@university.edu',
    phone: '+91-9876543211',
  },
  {
    id: 'EMP003',
    name: 'Dr. Ajay Singh',
    designation: 'Assistant Professor',
    department: 'Physics',
    email: 'ajay.singh@university.edu',
    phone: '+91-9876543212',
  },
  {
    id: 'EMP004',
    name: 'Prof. Meena Patel',
    designation: 'Professor',
    department: 'Chemistry',
    email: 'meena.patel@university.edu',
    phone: '+91-9876543213',
  },
  {
    id: 'EMP005',
    name: 'Dr. Vikram Rao',
    designation: 'Assistant Professor',
    department: 'English',
    email: 'vikram.rao@university.edu',
    phone: '+91-9876543214',
  },
];

// ─── INITIAL APAR APPLICATIONS ──────────────────────────────────────
export const INITIAL_APAR_APPLICATIONS: CareerAdvancement.CASAPARApplication[] =
  [
    {
      id: 'APAR-2025-0001',
      employeeId: 'EMP001',
      employeeName: 'Dr. Ramesh Kumar',
      designation: 'Assistant Professor',
      department: 'Computer Science',
      session: 'APAR 2024-25',
      stage: 'Stage 1→2',
      status: 'Pending',
      submittedOn: '12 Jan 2025',
      lastUpdated: '12 Jan 2025',
    },
    {
      id: 'APAR-2025-0002',
      employeeId: 'EMP002',
      employeeName: 'Prof. Sunita Verma',
      designation: 'Associate Professor',
      department: 'Mathematics',
      session: 'APAR 2024-25',
      stage: 'Stage 2→3',
      status: 'Forwarded',
      submittedOn: '10 Jan 2025',
      lastUpdated: '14 Jan 2025',
      currentHandler: 'Reporting Officer',
    },
    {
      id: 'APAR-2025-0003',
      employeeId: 'EMP003',
      employeeName: 'Dr. Ajay Singh',
      designation: 'Assistant Professor',
      department: 'Physics',
      session: 'APAR 2024-25',
      stage: 'Stage 1→2',
      status: 'Completed',
      submittedOn: '08 Jan 2025',
      lastUpdated: '16 Jan 2025',
    },
  ];

// ─── INITIAL PBAS APPLICATIONS ──────────────────────────────────────
export const INITIAL_PBAS_APPLICATIONS: CareerAdvancement.CASPBASApplication[] =
  [
    {
      id: 'PBAS-2025-0001',
      employeeId: 'EMP004',
      employeeName: 'Prof. Meena Patel',
      designation: 'Professor',
      department: 'Chemistry',
      session: 'PBAS 2024-25',
      type: 'PBAS',
      stage: 'Stage 3→4',
      status: 'Under Review',
      submittedOn: '15 Jan 2025',
      lastUpdated: '18 Jan 2025',
      currentHandler: 'HOD',
      totalAPIScore: 165,
    },
    {
      id: 'CAS-2025-0001',
      employeeId: 'EMP005',
      employeeName: 'Dr. Vikram Rao',
      designation: 'Assistant Professor',
      department: 'English',
      session: 'CAS 2024-25',
      type: 'CAS',
      stage: 'Stage 2→3',
      status: 'Pending',
      submittedOn: '20 Jan 2025',
      lastUpdated: '20 Jan 2025',
      totalAPIScore: 140,
    },
  ];

// ─── INITIAL SESSIONS ───────────────────────────────────────────────
export const INITIAL_SESSIONS: CareerAdvancement.CASSession[] = [
  {
    id: 1,
    name: 'APAR 2024-25',
    type: 'APAR',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    applicationStatus: 'OPEN',
    sessionFrom: '2024-04-01',
    sessionTo: '2025-03-31',
    status: 'Active',
  },
  {
    id: 2,
    name: 'PBAS 2024-25',
    type: 'PBAS',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    applicationStatus: 'OPEN',
    sessionFrom: '2023-04-01',
    sessionTo: '2024-03-31',
    status: 'Active',
  },
  {
    id: 3,
    name: 'CAS 2023-24',
    type: 'CAS',
    startDate: '2023-04-01',
    endDate: '2024-03-31',
    applicationStatus: 'CLOSE',
    sessionFrom: '2022-04-01',
    sessionTo: '2023-03-31',
    status: 'In-active',
  },
];

// ─── DROPDOWN OPTIONS ───────────────────────────────────────────────
export const DEPARTMENT_OPTIONS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
  'History',
  'Economics',
  'Biology',
  'Commerce',
];

export const CATEGORY_OPTIONS = ['General', 'OBC', 'SC', 'ST', 'EWS'];

export const GROUP_OPTIONS = ['Group A', 'Group B', 'Group C', 'Group D'];

export const EMPLOYMENT_TYPE_OPTIONS = [
  'Permanent',
  'Temporary',
  'Officiating',
];

export const STAGE_OPTIONS = [
  'Stage 1 → Stage 2',
  'Stage 2 → Stage 3',
  'Stage 3 → Stage 4',
  'Stage 4 → Stage 5',
];

export const QUALIFICATION_OPTIONS = [
  'Ph.D.',
  'M.Phil.',
  'Post Graduate',
  'Under Graduate',
];

export const RATING_OPTIONS = [
  'Outstanding',
  'Very Good',
  'Good',
  'Average',
  'Below Average',
];

export const SESSION_TYPE_OPTIONS = ['APAR', 'PBAS', 'CAS'];

export const APPLICATION_STATUS_OPTIONS = ['OPEN', 'CLOSE'];

export const STATUS_OPTIONS = ['Active', 'In-active'];
