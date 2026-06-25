import ApiService from 'services/api';

const USER_ASSIGNMENT_URL = `user-management/user-assignment`;

export async function getUserAssignments(): Promise<
  UserManagement.UserAssignmentList[]
> {
  const response =
    await ApiService.get<UserManagement.UserAssignmentList[]>(
      USER_ASSIGNMENT_URL
    );
  return response.data ?? [];
}

export async function getUserAssignmentById(
  userId: string
): Promise<UserManagement.UserAssignmentForm[]> {
  const response = await ApiService.get<UserManagement.UserAssignmentForm[]>(
    `${USER_ASSIGNMENT_URL}/${userId}`
  );
  return response.data ?? [];
}

export async function createUserAssignment(
  data: UserManagement.UserAssignmentForm
) {
  const { error, data: result } =
    await ApiService.post<UserManagement.UserAssignmentForm>(
      USER_ASSIGNMENT_URL,
      data
    );
  return !error ? result : undefined;
}

export async function updateUserAssignment(
  data: UserManagement.UserAssignmentForm
): Promise<boolean> {
  const { error } = await ApiService.put(USER_ASSIGNMENT_URL, data);
  return !error;
}
