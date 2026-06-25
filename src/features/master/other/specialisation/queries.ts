import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSpecialisation,
  getSpecialisation,
  getSpecialisations,
  patchSpecialisationStatus,
  updateSpecialisation,
} from './api';

const QUERY_KEY = ['@master/specialisation'];

export function useSpecialisationsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getSpecialisations,
  });

  return { data, isLoading };
}

export function useCreateSpecialisationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Other.SpecialisationForm) =>
      await createSpecialisation(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Other.SpecialisationItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useSpecialisationQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getSpecialisation(id);
      if (!data) return undefined;

      return {
        name: data.name,
        programmeId: data.programmeId ? Number(data.programmeId) : undefined,
      };
    },
  });
}

export function useUpdateSpecialisationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Other.SpecialisationForm) =>
      await updateSpecialisation(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Other.SpecialisationItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Other.SpecialisationItem = {
        ...existing,
        id: id,
        name: formData.name,
        programmeId: formData.programmeId,
        isActive: existing?.isActive,
      };

      const updatedItems = [
        ...result.slice(0, index),
        itemToReplace,
        ...result.slice(index + 1),
      ];

      queryClient.setQueryData(QUERY_KEY, updatedItems);
      queryClient.setQueryData([...QUERY_KEY, id], formData);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useSpecialisationActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchSpecialisationStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Other.SpecialisationItem[]>(
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
