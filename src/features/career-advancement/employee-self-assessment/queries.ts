import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEmployeeSelfAssessment,
  getEmployeeSelfAssessmentById,
  updateEmployeeSelfAssessment,
} from './api';

const QUERY_KEY = ['@career/employee-self-assessment'];

export function useCreateEmployeeSelfAssessmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CareerAdvancement.EmployeeSelfAssessmentForm) =>
      await createEmployeeSelfAssessment(data),

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useEmployeeSelfAssessmentQuery(employeeId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, employeeId],
    queryFn: async () => {
      const data = await getEmployeeSelfAssessmentById(employeeId);

      return data ?? null;
    },
    enabled: !!employeeId,
  });
}

export function useUpdateEmployeeSelfAssessmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CareerAdvancement.EmployeeSelfAssessmentForm) =>
      await updateEmployeeSelfAssessment(data),

    onSuccess(_, variables) {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEY, variables.employeeId],
      });
    },
  });
}
