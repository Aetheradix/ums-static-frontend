import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTehsil,
  getTehsil,
  getTehsils,
  patchTehsilStatus,
  updateTehsil,
} from './api';

const QUERY_KEY = ['@master/tehsil'];

export function useTehsilsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getTehsils,
  });
  return { data, isLoading };
}

export function useCreateTehsilMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.TehsilForm) => await createTehsil(data),

    onSuccess(data) {
      if (!data) return;
      const result =
        queryClient.getQueryData<Master.TehsilItem[]>(QUERY_KEY) ?? [];
      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useTehsilQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getTehsil(id);
      if (!data) return undefined;
      return {
        name: data.name,
        code: data.code,
        districtId: data.districtId,
        isActive: data.isActive,
      };
    },
  });
}

export function useUpdateTehsilMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.TehsilForm) => await updateTehsil(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.TehsilItem[]>(QUERY_KEY) ?? [];
      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];
      const itemToReplace: Master.TehsilItem = {
        id,
        name: formData.name,
        code: formData.code,
        districtId: formData.districtId,
        districtName: existing?.districtName ?? '',
        isActive: existing?.isActive || formData.isActive,
      };

      queryClient.setQueryData(QUERY_KEY, [
        ...result.slice(0, index),
        itemToReplace,
        ...result.slice(index + 1),
      ]);
      queryClient.setQueryData([...QUERY_KEY, id], formData);
    },
  });
}

export function useTehsilActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchTehsilStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.TehsilItem[]>(QUERY_KEY) ?? [];

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
