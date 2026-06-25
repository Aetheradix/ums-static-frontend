import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAvailableFacility,
  deleteAvailableFacility,
  getAvailableFacilities,
  getAvailableFacility,
  patchAvailableFacilityStatus,
  updateAvailableFacility,
} from './api';

const QUERY_KEY = ['@master/available-facility'];

export function useAvailableFacilitiesQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAvailableFacilities,
  });

  return { data, isLoading, refetch };
}

export function useCreateAvailableFacilityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CollegeMaster.AvailableFacilityForm) =>
      await createAvailableFacility(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<CollegeMaster.AvailableFacilityItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useAvailableFacilityQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getAvailableFacility(id);
      if (!data) return undefined;

      return {
        facilityName: data.facilityName,
      };
    },
  });
}

export function useUpdateAvailableFacilityMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CollegeMaster.AvailableFacilityForm) =>
      await updateAvailableFacility(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<CollegeMaster.AvailableFacilityItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: CollegeMaster.AvailableFacilityItem = {
        id,
        facilityName: formData.facilityName,
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

export function useDeleteAvailableFacilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteAvailableFacility(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<CollegeMaster.AvailableFacilityItem[]>(
          QUERY_KEY
        ) ?? [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function useAvailableFacilityActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchAvailableFacilityStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<CollegeMaster.AvailableFacilityItem[]>(
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
