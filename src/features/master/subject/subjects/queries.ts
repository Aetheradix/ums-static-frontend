import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSubject,
  getSubject,
  getSubjects,
  patchSubjectStatus,
  updateSubject,
} from './api';

const QUERY_KEY = ['@master/subjects'];

export function useSubjectsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getSubjects,
  });
  return { data, isLoading };
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.SubjectMaster.SubjectForm) =>
      await createSubject(data),

    onSuccess(data) {
      if (!data) return;
      const result =
        queryClient.getQueryData<Master.SubjectMaster.SubjectItem[]>(
          QUERY_KEY
        ) ?? [];
      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useSubjectQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getSubject(id);
      if (!data) return undefined;
      return {
        subjectName: data.subjectName,
        subjectCode: data.subjectCode,
        categoryId: data.categoryId,
        isActive: data.isActive,
      };
    },
  });
}

export function useUpdateSubjectMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.SubjectMaster.SubjectForm) =>
      await updateSubject(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.SubjectMaster.SubjectItem[]>(
          QUERY_KEY
        ) ?? [];
      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];
      const itemToReplace: Master.SubjectMaster.SubjectItem = {
        id,
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
        categoryId: formData.categoryId,
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

export function useSubjectActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchSubjectStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.SubjectMaster.SubjectItem[]>(
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
