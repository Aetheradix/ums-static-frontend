import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createNationality,
  getNationalities,
  getNationality,
  patchNationalityStatus,
  updateNationality,
} from './api';

const QUERY_KEY = ['@master/nationality'];

export function useNationalitiesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getNationalities,
  });
  return { data, isLoading };
}

export function useCreateNationalityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Other.NationalityForm) =>
      await createNationality(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Other.NationalityItem[]>(QUERY_KEY) ??
        [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useNationalityQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getNationality(id);
      if (!data) return undefined;

      return {
        name: data.name,
      };
    },
  });
}

export function useUpdateNationalityMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Other.NationalityForm) =>
      await updateNationality(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Other.NationalityItem[]>(QUERY_KEY) ??
        [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Other.NationalityItem = {
        id: id,
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

export function useNationalityActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchNationalityStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Other.NationalityItem[]>(QUERY_KEY) ??
        [];

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
