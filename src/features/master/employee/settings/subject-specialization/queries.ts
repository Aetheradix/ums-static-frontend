import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSubjectSpecialization,
  getSubjectSpecialization,
  getSubjectSpecializations,
  patchSubjectSpecializationStatus,
  updateSubjectSpecialization,
} from './api';

const QUERY_KEY = ['@master/subject-specialization'];

export function useSubjectSpecializationsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getSubjectSpecializations,
  });

  return { data, isLoading };
}

export function useGetSubjectSpecializationByIdQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],

    queryFn: async () => {
      const data = await getSubjectSpecialization(id);

      if (!data) return undefined;

      return {
        name: data.name,
      };
    },
  });
}

export function useCreateSubjectSpecializationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.SubjectSpecializationForm) =>
      await createSubjectSpecialization(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Employee.SubjectSpecializationItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useUpdateSubjectSpecializationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.SubjectSpecializationForm) =>
      await updateSubjectSpecialization(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.SubjectSpecializationItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);

      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Employee.SubjectSpecializationItem = {
        id: id,
        name: formData.name,
        isActive: existing?.isActive,
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

export function useSubjectSpecializationStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchSubjectSpecializationStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.SubjectSpecializationItem[]>(
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
