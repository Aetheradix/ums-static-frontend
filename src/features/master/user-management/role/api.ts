import ApiService from 'services/api';

const ROLE_URL = `user-management/role`;

export async function getUserRole(
  id: string
): Promise<UserManagement.UserRoleList> {
  const response = await ApiService.get<UserManagement.UserRoleList>(
    `${ROLE_URL}/${id}`
  );
  return response.data!;
}

export async function getUserRoles(): Promise<UserManagement.UserRoleList[]> {
  const response =
    await ApiService.get<UserManagement.UserRoleList[]>(ROLE_URL);
  return response.data ?? [];
}

export async function createUserRole(data: UserManagement.UserRoleForm) {
  const { error, data: result } =
    await ApiService.post<UserManagement.UserRoleForm>(ROLE_URL, data);
  return !error ? result : undefined;
}

export async function updateUserRole(
  id: string,
  data: UserManagement.UserRoleForm
): Promise<boolean> {
  const url = `${ROLE_URL}/${id}`;
  const { error } = await ApiService.put(url, data);
  return !error;
}
