import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FacilitiesApi } from './api';

export const facilityKeys = {
  all: ['cmsFacilities'] as const,
};

export const useFacilitiesQuery = () =>
  useQuery({
    queryKey: facilityKeys.all,
    queryFn: () => FacilitiesApi.getAll(),
  });

export const useCreateFacilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.FacilityForm) => FacilitiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all });
    },
  });
};

export const useUpdateFacilityMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.FacilityForm) => FacilitiesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all });
    },
  });
};

export const useDeleteFacilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => FacilitiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all });
    },
  });
};
