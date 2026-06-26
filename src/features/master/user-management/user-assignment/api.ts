let assignments: UserManagement.UserAssignmentList[] = [
  {
    userId: '1',
    userName: 'admin',
    roleName: 'Super Admin',
    domain: 'GLOBAL',
  },
  {
    userId: '2',
    userName: 'arjun.sharma',
    roleName: 'Admin',
    domain: 'GLOBAL',
  },
  {
    userId: '3',
    userName: 'priya.verma',
    roleName: 'Registrar',
    domain: 'GLOBAL',
  },
  {
    userId: '4',
    userName: 'rohit.mishra',
    roleName: 'Faculty',
    domain: 'GLOBAL',
  },
  {
    userId: '5',
    userName: 'sneha.iyer',
    roleName: 'Admin',
    domain: 'GLOBAL',
  },
];

export async function getUserAssignments(): Promise<
  UserManagement.UserAssignmentList[]
> {
  return [...assignments];
}

export async function getUserAssignmentById(
  userId: string
): Promise<UserManagement.UserAssignmentForm[]> {
  return assignments
    .filter(a => a.userId === userId)
    .map(({ userId, roleName, domain }) => ({ userId, roleName, domain }));
}

export async function createUserAssignment(
  data: UserManagement.UserAssignmentForm
) {
  const user = assignments.find(a => a.userId === data.userId);
  const newAssignment: UserManagement.UserAssignmentList = {
    userId: data.userId,
    userName: user?.userName ?? data.userId,
    roleName: data.roleName,
    domain: data.domain,
  };
  assignments = [...assignments, newAssignment];
  return newAssignment;
}

export async function updateUserAssignment(
  data: UserManagement.UserAssignmentForm
): Promise<boolean> {
  assignments = assignments.map(a =>
    a.userId === data.userId
      ? { ...a, roleName: data.roleName, domain: data.domain }
      : a
  );
  return true;
}
