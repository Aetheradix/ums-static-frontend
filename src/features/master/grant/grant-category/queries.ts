import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createGrantCategory,
  getGrantCategory,
  getGrantCategories,
  deleteGrantCategory,
  updateGrantCategory,
  patchGrantCategoryStatus,
} from './api';

const QUERY_KEY = ['@master/grant-category'];

export function useGrantCategoriesQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getGrantCategories,
  });

  return { data, isLoading, refetch };
}

export function useCreateGrantCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Grant.GrantCategoryForm) =>
      await createGrantCategory(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Grant.GrantCategoryItem[]>(QUERY_KEY) ??
        [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useGrantCategoryQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getGrantCategory(id);
      if (!data) return undefined;

      return {
        name: data.name,
        grantTypeId: data.grantTypeId,
      };
    },
  });
}

export function useUpdateGrantCategoryMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Grant.GrantCategoryForm) =>
      await updateGrantCategory(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Grant.GrantCategoryItem[]>(QUERY_KEY) ??
        [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Grant.GrantCategoryItem = {
        id,
        name: formData.name,
        grantTypeId: formData.grantTypeId,
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

export function useDeleteGrantCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteGrantCategory(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Grant.GrantCategoryItem[]>(QUERY_KEY) ??
        [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function useGrantCategoryActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchGrantCategoryStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Grant.GrantCategoryItem[]>(QUERY_KEY) ??
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
