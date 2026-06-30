export const UserRole = {
  SERVICE_DESK_ADMIN: 'service-desk-admin',
  MODULE_ADMIN: 'module-admin',
  AGENT: 'agent',
  EMPLOYEE: 'employee',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const RoleLabel: Record<UserRole, string> = {
  'service-desk-admin': 'Service Desk Admin',
  'module-admin': 'Module Admin',
  agent: 'Agent',
  employee: 'Employee',
};

export interface ITSMUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  avatar?: string;
  assignedModules?: string[];
}

export const rolePermissions: Record<UserRole, string[]> = {
  'service-desk-admin': [
    'view-all-tickets',
    'create-ticket',
    'assign-ticket',
    'edit-ticket',
    'delete-ticket',
    'close-ticket',
    'reopen-ticket',
    'mark-spam',
    'internal-note',
    'view-reports',
    'view-activity-logs',
    'manage-settings',
    'manage-kb',
    'manage-agents',
    'manage-sla',
  ],
  'module-admin': [
    'view-module-tickets',
    'create-ticket',
    'assign-ticket',
    'edit-ticket',
    'close-ticket',
    'reopen-ticket',
    'internal-note',
    'view-module-reports',
    'manage-module-settings',
    'manage-module-kb',
  ],
  agent: [
    'view-assigned-tickets',
    'accept-ticket',
    'update-ticket',
    'add-reply',
    'internal-note',
    'resolve-ticket',
    'escalate-ticket',
  ],
  employee: ['view-own-tickets', 'create-ticket', 'add-reply', 'reopen-ticket'],
};

export const mockCurrentUser: ITSMUser = {
  id: 'USR-ADM-001',
  name: 'Dr. Arvind Mehta',
  email: 'arvind.mehta@stu.ac.in',
  department: 'IT Services',
  role: UserRole.SERVICE_DESK_ADMIN,
  assignedModules: [
    'Infrastructure & Servers',
    'Network & Wi-Fi',
    'Software & Licenses',
    'Workstation Hardware',
  ],
};

export const mockUsers: ITSMUser[] = [
  mockCurrentUser,
  {
    id: 'USR-MOD-001',
    name: 'Prof. Sunita Verma',
    email: 'sunita.verma@stu.ac.in',
    department: 'Academic Computing',
    role: UserRole.MODULE_ADMIN,
    assignedModules: ['Software & Licenses', 'Workstation Hardware'],
  },
  {
    id: 'USR-AGT-001',
    name: 'Er. Amit Patel',
    email: 'amit.patel@stu.ac.in',
    department: 'IT Services',
    role: UserRole.AGENT,
  },
  {
    id: 'USR-AGT-002',
    name: 'Er. Sandeep Kothari',
    email: 'sandeep.kothari@stu.ac.in',
    department: 'IT Services',
    role: UserRole.AGENT,
  },
  {
    id: 'USR-AGT-003',
    name: 'Ms. Priya Nair',
    email: 'priya.nair@stu.ac.in',
    department: 'IT Services',
    role: UserRole.AGENT,
  },
  {
    id: 'USR-EMP-001',
    name: 'Dr. Neha Sharma',
    email: 'neha.sharma@stu.ac.in',
    department: 'Computer Science',
    role: UserRole.EMPLOYEE,
  },
  {
    id: 'USR-EMP-002',
    name: 'Prof. H. S. Rawat',
    email: 'rawat.hs@stu.ac.in',
    department: 'Agricultural Engineering',
    role: UserRole.EMPLOYEE,
  },
  {
    id: 'USR-EMP-003',
    name: 'Dr. Preeti Deshmukh',
    email: 'preeti.d@stu.ac.in',
    department: 'Civil Engineering',
    role: UserRole.EMPLOYEE,
  },
  {
    id: 'USR-EMP-004',
    name: 'Prof. Rajesh Khanna',
    email: 'rajesh.khanna@stu.ac.in',
    department: 'Electronics & Communication',
    role: UserRole.EMPLOYEE,
  },
  {
    id: 'USR-EMP-005',
    name: 'Dr. Meera Joshi',
    email: 'meera.joshi@stu.ac.in',
    department: 'Library Sciences',
    role: UserRole.EMPLOYEE,
  },
];

export function getUserById(id: string): ITSMUser | undefined {
  return mockUsers.find(u => u.id === id);
}

export function getUserByName(name: string): ITSMUser | undefined {
  return mockUsers.find(u => u.name === name);
}
