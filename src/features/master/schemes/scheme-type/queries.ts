import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSchemeType,
  deleteSchemeType,
  getSchemeTypes,
  getSchemeType,
  patchSchemeTypeStatus,
  updateSchemeType,
} from './api';

const QUERY_KEY = ['@master/scheme-type'];

export function useSchemeTypesQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getSchemeTypes,
  });

  return { data, isLoading, refetch };
}

export function useCreateSchemeTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Scheme.SchemeTypeForm) =>
      await createSchemeType(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Scheme.SchemeTypeItem[]>(QUERY_KEY) ??
        [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useSchemeTypeQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getSchemeType(id);
      if (!data) return undefined;

      return {
        name: data.name,
        isActive: data.isActive,
      };
    },
  });
}

export function useUpdateSchemeTypeMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Scheme.SchemeTypeForm) =>
      await updateSchemeType(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Scheme.SchemeTypeItem[]>(QUERY_KEY) ??
        [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Scheme.SchemeTypeItem = {
        id,
        name: formData.name,
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

export function useDeleteSchemeTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteSchemeType(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Scheme.SchemeTypeItem[]>(QUERY_KEY) ??
        [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function useSchemeTypeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchSchemeTypeStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Scheme.SchemeTypeItem[]>(QUERY_KEY) ??
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
