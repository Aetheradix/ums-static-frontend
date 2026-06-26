let nextId = 6;

let users: UserManagement.UserList[] = [
  {
    id: '1',
    userName: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@university.edu',
    isActive: true,
  },
  {
    id: '2',
    userName: 'arjun.sharma',
    firstName: 'Arjun',
    lastName: 'Sharma',
    email: 'arjun.sharma@university.edu',
    isActive: true,
  },
  {
    id: '3',
    userName: 'priya.verma',
    firstName: 'Priya',
    lastName: 'Verma',
    email: 'priya.verma@university.edu',
    isActive: true,
  },
  {
    id: '4',
    userName: 'rohit.mishra',
    firstName: 'Rohit',
    lastName: 'Mishra',
    email: 'rohit.mishra@university.edu',
    isActive: false,
  },
  {
    id: '5',
    userName: 'sneha.iyer',
    firstName: 'Sneha',
    lastName: 'Iyer',
    email: 'sneha.iyer@university.edu',
    isActive: true,
  },
];

export async function getUser(id: string): Promise<UserManagement.UserList> {
  return users.find(u => u.id === id)!;
}

export async function getUsers(): Promise<UserManagement.UserList[]> {
  return [...users];
}

export async function createUser(data: UserManagement.UserForm) {
  const newUser: UserManagement.UserList = { id: String(nextId++), ...data };
  users = [...users, newUser];
  return newUser;
}

export async function updateUser(
  id: string,
  data: UserManagement.UserForm
): Promise<boolean> {
  users = users.map(u => (u.id === id ? { ...u, ...data } : u));
  return true;
}
