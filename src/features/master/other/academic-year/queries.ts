import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAcademicYear,
  getAcademicYear,
  getAcademicYears,
  patchAcademicYearStatus,
  updateAcademicYear,
} from './api';

const QUERY_KEY = ['@master/academic-year'];

export function useAcademicYearsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAcademicYears,
  });

  return { data, isLoading };
}

export function useGetAcademicYearByIdQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getAcademicYear(id);

      if (!data) return undefined;

      return {
        name: data.name,
        session: data.session,
      };
    },
  });
}

export function useCreateAcademicYearMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.Other.AcademicYearForm) =>
      await createAcademicYear(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Other.AcademicYearItem[]>(QUERY_KEY) ??
        [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useUpdateAcademicYearMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Other.AcademicYearForm) =>
      await updateAcademicYear(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Other.AcademicYearItem[]>(QUERY_KEY) ??
        [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Other.AcademicYearItem = {
        id: id,
        name: formData.name,
        session: formData.session,
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

export function useAcademicYearStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchAcademicYearStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Other.AcademicYearItem[]>(QUERY_KEY) ??
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
