import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCollegeType,
  getCollegeType,
  getCollegeTypes,
  deleteCollegeType,
  updateCollegeType,
  patchCollegeTypeStatus,
} from './api';

const QUERY_KEY = ['@master/college-type'];

export function useCollegeTypesQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getCollegeTypes,
  });

  return { data, isLoading, refetch };
}

export function useCreateCollegeTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CollegeMaster.CollegeTypeForm) =>
      await createCollegeType(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<CollegeMaster.CollegeTypeItem[]>(QUERY_KEY) ??
        [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useCollegeTypeQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getCollegeType(id);
      if (!data) return undefined;

      return {
        name: data.name,
      };
    },
  });
}

export function useUpdateCollegeTypeMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CollegeMaster.CollegeTypeForm) =>
      await updateCollegeType(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<CollegeMaster.CollegeTypeItem[]>(QUERY_KEY) ??
        [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: CollegeMaster.CollegeTypeItem = {
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

export function useDeleteCollegeTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteCollegeType(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<CollegeMaster.CollegeTypeItem[]>(QUERY_KEY) ??
        [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function useCollegeTypeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchCollegeTypeStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<CollegeMaster.CollegeTypeItem[]>(QUERY_KEY) ??
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
