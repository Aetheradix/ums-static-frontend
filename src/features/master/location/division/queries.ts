import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDivision,
  getDivision,
  getDivisions,
  patchDivisionStatus,
  updateDivision,
} from './api';

const QUERY_KEY = ['@master/division'];

export function useDivisionsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDivisions,
  });
  return { data, isLoading };
}

export function useCreateDivisionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.DivisionForm) => await createDivision(data),

    onSuccess(data) {
      if (!data) return;
      const result =
        queryClient.getQueryData<Master.DivisionItem[]>(QUERY_KEY) ?? [];
      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useDivisionQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getDivision(id);
      if (!data) return undefined;
      return {
        name: data.name,
        code: data.code,
        stateId: data.stateId,
        isActive: data.isActive,
      };
    },
  });
}

export function useUpdateDivisionMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.DivisionForm) =>
      await updateDivision(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.DivisionItem[]>(QUERY_KEY) ?? [];
      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];
      const itemToReplace: Master.DivisionItem = {
        id,
        name: formData.name,
        code: formData.code,
        stateId: formData.stateId,
        stateName: existing?.stateName ?? '',
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

export function useDivisionActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchDivisionStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.DivisionItem[]>(QUERY_KEY) ?? [];

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
