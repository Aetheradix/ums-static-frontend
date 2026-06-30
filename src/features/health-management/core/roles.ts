export const UserRole = {
  HEALTH_ADMIN: 'health_admin',
  HEALTH_VIEW: 'health_view',
  HEALTH_HEAD: 'health-head',
  HEALTH_SUPER_HEAD: 'health-super-head',
  EMPLOYEE_HEALTH: 'employee-health',
  HEALTH_DOCTOR: 'health_doctor',
  HEALTH_PHARMACIST: 'health_pharmacist',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const RoleLabel: Record<UserRole, string> = {
  health_admin: 'Health Admin',
  health_view: 'Health Viewer',
  'health-head': 'Health Head',
  'health-super-head': 'Health Super Head',
  'employee-health': 'Employee',
  health_doctor: 'Doctor',
  health_pharmacist: 'Pharmacist',
};

export const rolePermissions: Record<UserRole, string[]> = {
  health_admin: [
    'settings.view',
    'settings.manage',
    'membership.view',
    'membership.create',
    'membership.edit',
    'membership.delete',
    'record.view',
    'record.create',
    'record.edit',
    'doctor.view',
    'doctor.manage',
    'stock.view',
    'stock.create',
    'stock.edit',
    'prescription.view',
    'prescription.create',
    'dispensary.view',
    'dispensary.create',
    'appointment.view',
    'appointment.manage',
    'guest.view',
    'guest.create',
    'guest.edit',
    'subscription.view',
    'report.view',
    'log.view',
  ],
  health_view: [
    'settings.view',
    'membership.view',
    'record.view',
    'doctor.view',
    'stock.view',
    'prescription.view',
    'dispensary.view',
    'appointment.view',
    'guest.view',
    'subscription.view',
    'report.view',
    'log.view',
  ],
  'health-head': [
    'membership.view',
    'membership.create',
    'record.view',
    'record.create',
    'doctor.view',
    'stock.view',
    'prescription.view',
    'dispensary.view',
    'appointment.view',
    'report.view',
    'log.view',
  ],
  'health-super-head': [
    'membership.view',
    'record.view',
    'doctor.view',
    'stock.view',
    'prescription.view',
    'dispensary.view',
    'appointment.view',
    'report.view',
    'log.view',
  ],
  'employee-health': [
    'membership.view',
    'record.view',
    'appointment.view',
    'prescription.view',
  ],
  health_doctor: [
    'record.view',
    'record.create',
    'record.edit',
    'prescription.view',
    'prescription.create',
    'doctor.view',
    'appointment.view',
    'appointment.edit',
    'dispensary.view',
  ],
  health_pharmacist: [
    'stock.view',
    'stock.create',
    'stock.edit',
    'dispensary.view',
    'dispensary.create',
    'prescription.view',
  ],
};

export interface HmsUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  healthCenter: string;
  doctorId?: string;
}

export const mockCurrentUser: HmsUser = {
  id: 'USR-HMS-001',
  name: 'Dr. Admin Sharma',
  email: 'admin.sharma@university.edu.in',
  role: 'health_admin',
  department: 'Health Services',
  healthCenter: 'Campus Health Center',
};

export const mockUsers: HmsUser[] = [
  mockCurrentUser,
  {
    id: 'USR-HMS-002',
    name: 'Dr. Priya Mehta',
    email: 'priya.mehta@university.edu.in',
    role: 'health_doctor',
    department: 'Health Services',
    healthCenter: 'Campus Health Center',
    doctorId: 'DOC-001',
  },
  {
    id: 'USR-HMS-003',
    name: 'Mr. Rajesh Kumar',
    email: 'rajesh.kumar@university.edu.in',
    role: 'health_pharmacist',
    department: 'Pharmacy',
    healthCenter: 'Campus Health Center',
  },
  {
    id: 'USR-HMS-004',
    name: 'Ms. Anjali Desai',
    email: 'anjali.desai@university.edu.in',
    role: 'health-head',
    department: 'Health Services',
    healthCenter: 'Campus Health Center',
  },
  {
    id: 'USR-HMS-005',
    name: 'Mr. Vikram Singh',
    email: 'vikram.singh@university.edu.in',
    role: 'health-super-head',
    department: 'Administration',
    healthCenter: 'University Hospital',
  },
  {
    id: 'USR-HMS-006',
    name: 'Mr. Rohan Gupta',
    email: 'rohan.gupta@university.edu.in',
    role: 'health_view',
    department: 'Administration',
    healthCenter: 'Campus Health Center',
  },
  {
    id: 'USR-EMP-001',
    name: 'Mr. Amit Verma',
    email: 'amit.verma@university.edu.in',
    role: 'employee-health',
    department: 'Computer Science',
    healthCenter: 'Campus Health Center',
  },
];

export function getUserById(id: string): HmsUser | undefined {
  return mockUsers.find(u => u.id === id);
}

export function getUserByName(name: string): HmsUser | undefined {
  return mockUsers.find(u => u.name === name);
}
