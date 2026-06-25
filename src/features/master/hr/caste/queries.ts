import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCaste,
  getCaste,
  getCastes,
  patchCasteStatus,
  updateCaste,
} from './api';

const QUERY_KEY = ['@master/caste'];

export function useCastesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getCastes,
  });
  return { data, isLoading };
}

export function useCreateCasteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.HR.CasteForm) => await createCaste(data),

    onSuccess(data) {
      if (!data) return;
      const result =
        queryClient.getQueryData<Master.HR.CasteItem[]>(QUERY_KEY) ?? [];
      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useCasteQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getCaste(id);
      if (!data) return undefined;
      return {
        name: data.name,
        isActive: data.isActive,
      };
    },
    enabled: !!id,
  });
}

export function useUpdateCasteMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.HR.CasteForm) =>
      await updateCaste(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.CasteItem[]>(QUERY_KEY) ?? [];
      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];
      const itemToReplace: Master.HR.CasteItem = {
        id,
        name: formData.name,
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

export function useCasteActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchCasteStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.CasteItem[]>(QUERY_KEY) ?? [];

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
