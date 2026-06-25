import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCollegeCategory,
  getCollegeCategory,
  getCollegeCategories,
  deleteCollegeCategory,
  updateCollegeCategory,
  patchCollegeCategoryStatus,
} from './api';

const QUERY_KEY = ['@master/college-category'];

export function useCollegeCategoriesQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getCollegeCategories,
  });

  return { data, isLoading, refetch };
}

export function useCreateCollegeCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CollegeMaster.CollegeCategoryForm) =>
      await createCollegeCategory(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<CollegeMaster.CollegeCategoryItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useCollegeCategoryQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getCollegeCategory(id);
      if (!data) return undefined;

      return {
        name: data.name,
        collegeTypeId: data.collegeTypeId,
      };
    },
  });
}

export function useUpdateCollegeCategoryMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CollegeMaster.CollegeCategoryForm) =>
      await updateCollegeCategory(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<CollegeMaster.CollegeCategoryItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: CollegeMaster.CollegeCategoryItem = {
        id,
        name: formData.name,
        collegeTypeId: formData.collegeTypeId,
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

export function useDeleteCollegeCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteCollegeCategory(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<CollegeMaster.CollegeCategoryItem[]>(
          QUERY_KEY
        ) ?? [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function useCollegeCategoryActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchCollegeCategoryStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<CollegeMaster.CollegeCategoryItem[]>(
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
