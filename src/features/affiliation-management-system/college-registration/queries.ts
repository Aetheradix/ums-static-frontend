import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCollegeRegistration,
  updateCollegeRegistration,
  getCollegeRegistrations,
  getCollegesByCollegeType,
} from './api';

const QUERY_KEY = ['@affiliation/college-registration'];

export function useAllCollegeRegistrationsQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getCollegeRegistrations,
  });

  return { data, isLoading, refetch };
}

export function useCollegesByCollegeTypeQuery(collegeTypeId?: number) {
  const { data = [], isLoading } = useQuery({
    queryKey: [...QUERY_KEY, 'by-college-type', collegeTypeId],
    queryFn: () => getCollegesByCollegeType(collegeTypeId!),
    enabled: !!collegeTypeId,
  });

  return { data, isLoading };
}

export function useCreateCollegeRegistrationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      documentIds,
    }: {
      data: AffiliationManagementSystem.CollegeApplicationFormData;
      documentIds: { documentId: string; documentType: string }[];
    }) => await createCollegeRegistration(data, documentIds),

    onSuccess(data) {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateCollegeRegistrationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
      documentIds,
    }: {
      id: number;
      data: AffiliationManagementSystem.CollegeApplicationFormData;
      documentIds: { documentId: string; documentType: string }[];
    }) => await updateCollegeRegistration(id, data, documentIds),

    onSuccess(data) {
      if (!data) return;

      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
