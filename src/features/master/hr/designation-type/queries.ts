import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDesignationType,
  getDesignationType,
  getDesignationTypes,
  deleteDesignationType,
  updateDesignationType,
  patchDesignationTypeStatus,
} from './api';

const QUERY_KEY = ['@master/designation-type'];

export function useDesignationTypesQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDesignationTypes,
  });

  return { data, isLoading, refetch };
}

export function useCreateDesignationTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.HR.DesignationTypeForm) =>
      await createDesignationType(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.HR.DesignationTypeItem[]>(QUERY_KEY) ??
        [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useDesignationTypeQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getDesignationType(id);
      if (!data) return undefined;

      return {
        name: data.name,
        code: data.code,
      };
    },
  });
}

export function useUpdateDesignationTypeMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.HR.DesignationTypeForm) =>
      await updateDesignationType(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.DesignationTypeItem[]>(QUERY_KEY) ??
        [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.HR.DesignationTypeItem = {
        id,
        name: formData.name,
        code: formData.code,
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

export function useDeleteDesignationTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteDesignationType(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.DesignationTypeItem[]>(QUERY_KEY) ??
        [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function useDesignationTypeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchDesignationTypeStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.DesignationTypeItem[]>(QUERY_KEY) ??
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
