import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSeparationReasonType,
  getSeparationReasonType,
  getSeparationReasonTypes,
  patchSeparationReasonTypeStatus,
  updateSeparationReasonType,
} from './api';

const QUERY_KEY = ['@master/separation-reason-type'];

export function useSeparationReasonTypesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getSeparationReasonTypes,
  });

  return { data, isLoading };
}

export function useGetSeparationReasonTypeByIdQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getSeparationReasonType(id);

      if (!data) return undefined;

      return {
        name: data.name,
        type: data.type,
      };
    },
  });
}

export function useCreateSeparationReasonTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.SeparationReasonTypeForm) =>
      await createSeparationReasonType(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Employee.SeparationReasonTypeItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useUpdateSeparationReasonTypeMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.SeparationReasonTypeForm) =>
      await updateSeparationReasonType(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.SeparationReasonTypeItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Employee.SeparationReasonTypeItem = {
        id,
        name: formData.name,
        type: formData.type,
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

export function useSeparationReasonTypeStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchSeparationReasonTypeStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.SeparationReasonTypeItem[]>(
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
