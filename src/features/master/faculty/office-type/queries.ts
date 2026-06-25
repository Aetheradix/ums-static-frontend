import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOfficeType,
  getOfficeType,
  getOfficeTypes,
  patchOfficeTypeStatus,
  updateOfficeType,
} from './api';

const QUERY_KEY = ['@master/office-type'];

export function useOfficeTypesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getOfficeTypes,
  });

  return { data, isLoading };
}

export function useCreateOfficeTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.OfficeTypeForm) =>
      await createOfficeType(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.OfficeTypeItem[]>(QUERY_KEY) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useOfficeTypeQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getOfficeType(id);
      if (!data) return undefined;

      return {
        code: data.code,
        name: data.name,
      };
    },
  });
}

export function useUpdateOfficeTypeMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.OfficeTypeForm) =>
      await updateOfficeType(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.OfficeTypeItem[]>(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.OfficeTypeItem = {
        id: id,
        code: formData.code,
        name: formData.name,
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

export function useOfficeTypeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchOfficeTypeStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.OfficeTypeItem[]>(QUERY_KEY) ?? [];

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
