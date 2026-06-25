import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDesignation,
  getDesignation,
  getDesignations,
  deleteDesignation,
  updateDesignation,
  patchDesignationStatus,
} from './api';

const QUERY_KEY = ['@master/designation'];

export function useDesignationsQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDesignations,
  });

  return { data, isLoading, refetch };
}

export function useCreateDesignationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.HR.DesignationForm) =>
      await createDesignation(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.HR.DesignationItem[]>(QUERY_KEY) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useDesignationQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getDesignation(id);
      if (!data) return undefined;

      return {
        classId: data.classId,
        postId: data.postId,
        designationTypeId: data.designationTypeId,
        name: data.name,
        code: data.code,
        sequenceNumber: data.sequenceNumber,
      };
    },
  });
}

export function useUpdateDesignationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.HR.DesignationForm) =>
      await updateDesignation(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.DesignationItem[]>(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.HR.DesignationItem = {
        id,
        classId: formData.classId,
        postId: formData.postId,
        designationTypeId: formData.designationTypeId,
        name: formData.name,
        code: formData.code,
        sequenceNumber: formData.sequenceNumber,
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

export function useDeleteDesignationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteDesignation(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.DesignationItem[]>(QUERY_KEY) ?? [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function useDesignationActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchDesignationStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.DesignationItem[]>(QUERY_KEY) ?? [];

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
