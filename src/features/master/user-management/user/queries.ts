import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, getUser, getUsers, updateUser } from './api';

const queryKey = ['@user-management/users'];

export function useUsersQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getUsers,
    enabled,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserManagement.UserForm) => await createUser(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateUserMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserManagement.UserForm) =>
      await updateUser(id, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, id] });
    },
  });
}

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}
