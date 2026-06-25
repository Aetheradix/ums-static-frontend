import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createActionOption,
  getActionOption,
  getActionOptions,
  patchActionOptionStatus,
  updateActionOption,
} from './api';

const QUERY_KEY = ['@master/action-option'];

export function useActionOptionsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getActionOptions,
  });

  return { data, isLoading };
}

export function useGetActionOptionByIdQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getActionOption(id);

      if (!data) return undefined;

      return {
        name: data.name,
        description: data.description,
      };
    },
  });
}

export function useCreateActionOptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.ActionOptionForm) =>
      await createActionOption(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Employee.ActionOptionItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useUpdateActionOptionMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.ActionOptionForm) =>
      await updateActionOption(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.ActionOptionItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);

      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Employee.ActionOptionItem = {
        id: id,
        name: formData.name,
        description: formData.description,
        isActive: existing?.isActive,
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

export function useActionOptionStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchActionOptionStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.ActionOptionItem[]>(
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
