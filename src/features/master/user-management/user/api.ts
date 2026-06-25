import ApiService from 'services/api';

const USER_URL = `user-management/user`;

export async function getUser(id: string): Promise<UserManagement.UserList> {
  const response = await ApiService.get<UserManagement.UserList>(
    `${USER_URL}/${id}`
  );
  return response.data!;
}

export async function getUsers(): Promise<UserManagement.UserList[]> {
  const response = await ApiService.get<UserManagement.UserList[]>(USER_URL);
  return response.data ?? [];
}

export async function createUser(data: UserManagement.UserForm) {
  const { error, data: result } =
    await ApiService.post<UserManagement.UserForm>(USER_URL, data);
  return !error ? result : undefined;
}

export async function updateUser(
  id: string,
  data: UserManagement.UserForm
): Promise<boolean> {
  const url = `${USER_URL}/${id}`;
  const { error } = await ApiService.put(url, data);
  return !error;
}
