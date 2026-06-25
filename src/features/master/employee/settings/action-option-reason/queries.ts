import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createActionOptionReason,
  getActionOptionReason,
  getActionOptionReasons,
  patchActionOptionReasonStatus,
  updateActionOptionReason,
} from './api';

const QUERY_KEY = ['@master/action-option-reason'];

export function useActionOptionReasonsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getActionOptionReasons,
  });

  return { data, isLoading };
}

export function useCreateActionOptionReasonMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Employee.ActionOptionReasonForm) =>
      await createActionOptionReason(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Employee.ActionOptionReasonItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useActionOptionReasonQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getActionOptionReason(id);
      if (!data) return undefined;

      return {
        actionOptionId: data.actionOptionId,
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      };
    },
  });
}

export function useUpdateActionOptionReasonMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.ActionOptionReasonForm) =>
      await updateActionOptionReason(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.ActionOptionReasonItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Employee.ActionOptionReasonItem = {
        id,
        actionOptionId: formData.actionOptionId,
        name: formData.name,
        description: formData.description,
        isActive: existing?.isActive ?? formData.isActive,
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

export function useActionOptionReasonActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchActionOptionReasonStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.ActionOptionReasonItem[]>(
          QUERY_KEY
        ) ?? [];

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
