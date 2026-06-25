import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEligibilityApplicationProcess,
  getEligibilityApplicationProcess,
  getEligibilityApplicationProcesses,
  deleteEligibilityApplicationProcess,
  updateEligibilityApplicationProcess,
  patchEligibilityApplicationProcessStatus,
} from './api';

const QUERY_KEY = ['@master/eligibility-application-process'];

export function useEligibilityApplicationProcessesQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getEligibilityApplicationProcesses,
  });

  return { data, isLoading, refetch };
}

export function useCreateEligibilityApplicationProcessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Grant.EligibilityApplicationProcessForm) =>
      await createEligibilityApplicationProcess(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<
          Master.Grant.EligibilityApplicationProcessItem[]
        >(QUERY_KEY) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useEligibilityApplicationProcessQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getEligibilityApplicationProcess(id);
      if (!data) return undefined;

      return {
        grantTypeId: data.grantTypeId,
        grantCategoryId: data.grantCategoryId,
        eligibilityText: data.eligibilityText,
        applicationProcessText: data.applicationProcessText,
        approvalProcessText: data.approvalProcessText,
      };
    },
  });
}

export function useUpdateEligibilityApplicationProcessMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Grant.EligibilityApplicationProcessForm) =>
      await updateEligibilityApplicationProcess(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<
          Master.Grant.EligibilityApplicationProcessItem[]
        >(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Grant.EligibilityApplicationProcessItem = {
        id,
        grantTypeId: formData.grantTypeId,
        grantCategoryId: formData.grantCategoryId,
        eligibilityText: formData.eligibilityText,
        applicationProcessText: formData.applicationProcessText,
        approvalProcessText: formData.approvalProcessText,
        isActive: existing?.isActive ?? true,
      };

      const updatedItems = [
        ...result.slice(0, index),
        itemToReplace,
        ...result.slice(index + 1),
      ];

      queryClient.setQueryData(QUERY_KEY, updatedItems);
      queryClient.setQueryData([...QUERY_KEY, id], formData);
    },
  });
}

export function useDeleteEligibilityApplicationProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) =>
      await deleteEligibilityApplicationProcess(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<
          Master.Grant.EligibilityApplicationProcessItem[]
        >(QUERY_KEY) ?? [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function useEligibilityApplicationProcessActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchEligibilityApplicationProcessStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<
          Master.Grant.EligibilityApplicationProcessItem[]
        >(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === variables.id);
      if (index === -1) return;

      const updatedItem = {
        ...result[index],
        isActive: variables.isActive,
      };

      queryClient.setQueryData(QUERY_KEY, [
        ...result.slice(0, index),
        updatedItem,
        ...result.slice(index + 1),
      ]);
    },
  });
}
