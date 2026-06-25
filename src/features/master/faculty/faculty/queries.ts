import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFaculty,
  getFaculty,
  getFaculties,
  patchFacultyStatus,
  updateFaculty,
} from './api';

const QUERY_KEY = ['@master/faculty'];

export function useFacultiesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getFaculties,
  });

  return { data, isLoading };
}

export function useCreateFacultyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.FacultyForm) => await createFaculty(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.FacultyItem[]>(QUERY_KEY) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useFacultyQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getFaculty(id);
      if (!data) return undefined;

      return {
        ...data,
        joiningDate: new Date(data.joiningDate),
      } as Master.FacultyItem;
    },
  });
}

export function useUpdateFacultyMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.FacultyForm) =>
      await updateFaculty(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.FacultyItem[]>(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.FacultyItem = {
        ...formData,
        id,
        isActive: existing?.isActive || formData.isActive,
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

export function useFacultyActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchFacultyStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.FacultyItem[]>(QUERY_KEY) ?? [];

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
