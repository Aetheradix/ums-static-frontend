import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createGrantType,
  getGrantType,
  getGrantTypes,
  deleteGrantType,
  updateGrantType,
  patchGrantTypeStatus,
} from './api';

const QUERY_KEY = ['@master/grant-type'];

export function useGrantTypesQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getGrantTypes,
  });

  return { data, isLoading, refetch };
}

export function useCreateGrantTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Grant.GrantTypeForm) =>
      await createGrantType(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Grant.GrantTypeItem[]>(QUERY_KEY) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useGrantTypeQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getGrantType(id);
      if (!data) return undefined;

      return {
        name: data.name,
      };
    },
  });
}

export function useUpdateGrantTypeMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Grant.GrantTypeForm) =>
      await updateGrantType(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Grant.GrantTypeItem[]>(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Grant.GrantTypeItem = {
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

export function useDeleteGrantTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteGrantType(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Grant.GrantTypeItem[]>(QUERY_KEY) ?? [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function useGrantTypeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchGrantTypeStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Grant.GrantTypeItem[]>(QUERY_KEY) ?? [];

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
