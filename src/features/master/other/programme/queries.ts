import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProgramme,
  getProgramme,
  getProgrammes,
  patchProgrammeStatus,
  updateProgramme,
} from './api';

const QUERY_KEY = ['@master/programme'];

export function useProgrammesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getProgrammes,
  });

  return { data, isLoading };
}

export function useCreateProgrammeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Other.ProgrammeForm) =>
      await createProgramme(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Other.ProgrammeItem[]>(QUERY_KEY) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useProgrammeQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getProgramme(id);
      if (!data) return undefined;

      return {
        name: data.name,
        programmeDuration: data.programmeDuration,
        degreeLevelId: data.degreeLevelId
          ? Number(data.degreeLevelId)
          : undefined,
      };
    },
  });
}

export function useUpdateProgrammeMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Other.ProgrammeForm) =>
      await updateProgramme(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Other.ProgrammeItem[]>(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Other.ProgrammeItem = {
        ...existing,
        id: id,
        name: formData.name,
        programmeDuration: formData.programmeDuration,
        degreeLevelId: formData.degreeLevelId,
        isActive: existing?.isActive,
      };

      const updatedItems = [
        ...result.slice(0, index),
        itemToReplace,
        ...result.slice(index + 1),
      ];

      queryClient.setQueryData(QUERY_KEY, updatedItems);
      queryClient.setQueryData([...QUERY_KEY, id], formData);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY }); // Invalidate to refresh degreeeLevelName if needed
    },
  });
}

export function useProgrammeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchProgrammeStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Other.ProgrammeItem[]>(QUERY_KEY) ?? [];

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
