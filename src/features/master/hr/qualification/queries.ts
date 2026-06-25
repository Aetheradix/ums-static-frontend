import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createQualification,
  getQualification,
  getQualifications,
  patchQualificationStatus,
  updateQualification,
} from './api';

const QUERY_KEY = ['@master/qualification'];

export function useQualificationsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getQualifications,
  });
  return { data, isLoading };
}

export function useCreateQualificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.HR.QualificationForm) =>
      await createQualification(data),

    onSuccess(data) {
      if (!data) return;
      const result =
        queryClient.getQueryData<Master.HR.QualificationItem[]>(QUERY_KEY) ??
        [];
      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useQualificationQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getQualification(id);
      if (!data) return undefined;
      return {
        name: data.name,
        subject: data.subject,
        code: data.code,
        isActive: data.isActive,
      };
    },
    enabled: !!id,
  });
}

export function useUpdateQualificationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.HR.QualificationForm) =>
      await updateQualification(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.QualificationItem[]>(QUERY_KEY) ??
        [];
      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];
      const itemToReplace: Master.HR.QualificationItem = {
        id,
        name: formData.name,
        subject: formData.subject,
        code: formData.code,
        isActive: existing?.isActive || formData.isActive,
      };

      queryClient.setQueryData(QUERY_KEY, [
        ...result.slice(0, index),
        itemToReplace,
        ...result.slice(index + 1),
      ]);
      queryClient.setQueryData([...QUERY_KEY, id], formData);
    },
  });
}

export function useQualificationActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchQualificationStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.QualificationItem[]>(QUERY_KEY) ??
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
