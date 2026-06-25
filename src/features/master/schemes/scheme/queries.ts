import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createScheme,
  deleteScheme,
  getSchemes,
  getScheme,
  patchSchemeStatus,
  updateScheme,
} from './api';

const QUERY_KEY = ['@master/scheme'];

export function useSchemesQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getSchemes,
  });

  return { data, isLoading, refetch };
}

export function useCreateSchemeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Scheme.SchemeForm) =>
      await createScheme(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Scheme.SchemeItem[]>(QUERY_KEY) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useSchemeQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getScheme(id);
      if (!data) return undefined;

      return {
        name: data.name,
        code: data.code,
        schemeTypeId: data.schemeTypeId,
        schemeCategoryId: data.schemeCategoryId,
        isActive: data.isActive,
      };
    },
  });
}

export function useUpdateSchemeMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Scheme.SchemeForm) =>
      await updateScheme(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Scheme.SchemeItem[]>(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Scheme.SchemeItem = {
        id,
        name: formData.name,
        code: formData.code,
        schemeTypeId: formData.schemeTypeId,
        schemeCategoryId: formData.schemeCategoryId,
        isActive: existing?.isActive ?? true,
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

export function useDeleteSchemeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteScheme(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Scheme.SchemeItem[]>(QUERY_KEY) ?? [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function useSchemeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchSchemeStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Scheme.SchemeItem[]>(QUERY_KEY) ?? [];

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
