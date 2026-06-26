let nextId = 6;

let roles: UserManagement.UserRoleList[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    isActive: true,
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Administrative access to manage university data',
    isActive: true,
  },
  {
    id: '3',
    name: 'Registrar',
    description: 'Academic records and student management',
    isActive: true,
  },
  {
    id: '4',
    name: 'Faculty',
    description: 'Teaching staff portal access',
    isActive: true,
  },
  {
    id: '5',
    name: 'Student',
    description: 'Student self-service portal access',
    isActive: false,
  },
];

export async function getUserRole(
  id: string
): Promise<UserManagement.UserRoleList> {
  return roles.find(r => r.id === id)!;
}

export async function getUserRoles(): Promise<UserManagement.UserRoleList[]> {
  return [...roles];
}

export async function createUserRole(data: UserManagement.UserRoleForm) {
  const newRole: UserManagement.UserRoleList = {
    id: String(nextId++),
    ...data,
  };
  roles = [...roles, newRole];
  return newRole;
}

export async function updateUserRole(
  id: string,
  data: UserManagement.UserRoleForm
): Promise<boolean> {
  roles = roles.map(r => (r.id === id ? { ...r, ...data } : r));
  return true;
}
