import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createUserRole,
  getUserRole,
  getUserRoles,
  updateUserRole,
} from './api';

const queryKey = ['@user-management/roles'];

export function useUserRolesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getUserRoles,
    enabled,
  });
}

export function useCreateUserRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserManagement.UserRoleForm) =>
      await createUserRole(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateUserRoleMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserManagement.UserRoleForm) =>
      await updateUserRole(id, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, id] });
    },
  });
}

export function useUserRoleQuery(id: string) {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: () => getUserRole(id),
    enabled: !!id,
  });
}
