import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCollegeRegistrationApprovals,
  getCollegeRegistrationById,
  updateCollegeRegistrationApprovalStatus,
} from './api';

const QUERY_KEY = ['@affiliation/college-registration-approval'];

export function useCollegeRegistrationApprovalsQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getCollegeRegistrationApprovals,
  });

  return { data, isLoading, refetch };
}

export function useCollegeRegistrationByIdQuery(id: number | null) {
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const res = await getCollegeRegistrationById(id!);
      return res.data;
    },
    enabled: !!id,
  });

  return { data, isLoading };
}

export function useUpdateCollegeRegistrationApprovalStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
    }: {
      id: number;
      status: number;
      rejectionReason?: string;
    }) =>
      await updateCollegeRegistrationApprovalStatus(
        id,
        status,
        rejectionReason
      ),

    onSuccess(success) {
      if (!success) return;
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
