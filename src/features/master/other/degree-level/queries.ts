import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDegreeLevel,
  getDegreeLevel,
  getDegreeLevels,
  patchDegreeLevelStatus,
  updateDegreeLevel,
} from './api';

const QUERY_KEY = ['@master/degree-level'];

export function useDegreeLevelsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDegreeLevels,
  });

  return { data, isLoading };
}

export function useCreateDegreeLevelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Other.DegreeLevelForm) =>
      await createDegreeLevel(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Other.DegreeLevelItem[]>(QUERY_KEY) ??
        [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useDegreeLevelQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getDegreeLevel(id);
      if (!data) return undefined;

      return {
        name: data.name,
      };
    },
  });
}

export function useUpdateDegreeLevelMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Other.DegreeLevelForm) =>
      await updateDegreeLevel(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Other.DegreeLevelItem[]>(QUERY_KEY) ??
        [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Other.DegreeLevelItem = {
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

export function useDegreeLevelActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchDegreeLevelStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Other.DegreeLevelItem[]>(QUERY_KEY) ??
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
