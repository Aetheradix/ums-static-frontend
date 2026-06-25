import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDistrict,
  getDistrict,
  getDistricts,
  patchDistrictStatus,
  updateDistrict,
} from './api';

const QUERY_KEY = ['@master/district'];

export function useDistrictsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDistricts,
  });
  return { data, isLoading };
}

export function useCreateDistrictMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.DistrictForm) => await createDistrict(data),

    onSuccess(data) {
      if (!data) return;
      const result =
        queryClient.getQueryData<Master.DistrictItem[]>(QUERY_KEY) ?? [];
      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useDistrictQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getDistrict(id);
      if (!data) return undefined;
      return {
        name: data.name,
        code: data.code,
        divisionId: data.divisionId,
        isActive: data.isActive,
      };
    },
  });
}

export function useUpdateDistrictMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.DistrictForm) =>
      await updateDistrict(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.DistrictItem[]>(QUERY_KEY) ?? [];
      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];
      const itemToReplace: Master.DistrictItem = {
        id,
        name: formData.name,
        code: formData.code,
        divisionId: formData.divisionId,
        divisionName: existing?.divisionName ?? '',
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

export function useDistrictActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchDistrictStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.DistrictItem[]>(QUERY_KEY) ?? [];

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
