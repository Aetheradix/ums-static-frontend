import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudentApplication, approveStudentFee } from './api';

const QUERY_KEY = ['@sis/student-fee-approval'];

export function useStudentApplicationQuery(id: number | null) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await getStudentApplication(id);
      if (error) {
        throw new Error('Failed to fetch student application');
      }
      return data || null;
    },
    enabled: !!id,
    retry: false,
  });
}

export function useApproveStudentFeeMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await approveStudentFee(id);
      if (error) {
        throw new Error('Failed to approve student fee payment');
      }
      return data;
    },
    onSuccess: () => {
      // Invalidate both the list/detail query for this application to fetch fresh data
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id] });
    },
  });
}
