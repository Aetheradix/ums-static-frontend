import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createUserAssignment,
  getUserAssignmentById,
  getUserAssignments,
  updateUserAssignment,
} from './api';

const queryKey = ['@user-management/user-assignments'];

export function useUserAssignmentsQuery() {
  return useQuery({
    queryKey: queryKey,
    queryFn: getUserAssignments,
  });
}

export function useUserAssignmentQuery(userId: string) {
  return useQuery({
    queryKey: [...queryKey, userId],
    queryFn: () => getUserAssignmentById(userId),
    enabled: !!userId,
  });
}

export function useCreateUserAssignmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserManagement.UserAssignmentForm) =>
      await createUserAssignment(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateUserAssignmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserManagement.UserAssignmentForm) =>
      await updateUserAssignment(data),
    onSuccess(result) {
      if (!result) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}
