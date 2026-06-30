import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTrainingPlacementService } from 'shared/di';
import type { PlacementSeasonInput, SeasonFilter } from '../types';

export const tpQueryKeys = {
  seasons: (filter?: SeasonFilter) => ['tp', 'seasons', filter] as const,
  season: (id: string) => ['tp', 'seasons', id] as const,
  adminDashboard: () => ['tp', 'dashboard', 'admin'] as const,
  companyDashboard: (companyId: string) =>
    ['tp', 'dashboard', 'company', companyId] as const,
  deptDashboard: (ouId: string) => ['tp', 'dashboard', 'dept', ouId] as const,
};

export function useSeasonsQuery(filter?: SeasonFilter) {
  const service = getTrainingPlacementService();
  return useQuery({
    queryKey: tpQueryKeys.seasons(filter),
    queryFn: () => service.getSeasons(filter),
  });
}

export function useSeasonQuery(id: string) {
  const service = getTrainingPlacementService();
  return useQuery({
    queryKey: tpQueryKeys.season(id),
    queryFn: () => service.getSeasonById(id),
    enabled: !!id,
  });
}

export function useSaveSeasonMutation() {
  const service = getTrainingPlacementService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlacementSeasonInput) => service.saveSeason(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tp', 'seasons'] });
      queryClient.invalidateQueries({ queryKey: tpQueryKeys.adminDashboard() });
    },
  });
}

export function useAdminDashboardQuery() {
  const service = getTrainingPlacementService();
  return useQuery({
    queryKey: tpQueryKeys.adminDashboard(),
    queryFn: () => service.getAdminDashboardMetrics(),
  });
}

export function useCompanyDashboardQuery(companyId: string) {
  const service = getTrainingPlacementService();
  return useQuery({
    queryKey: tpQueryKeys.companyDashboard(companyId),
    queryFn: () => service.getCompanyDashboardMetrics(companyId),
    enabled: !!companyId,
  });
}

export function useDeptDashboardQuery(ouId: string) {
  const service = getTrainingPlacementService();
  return useQuery({
    queryKey: tpQueryKeys.deptDashboard(ouId),
    queryFn: () => service.getDeptDashboardMetrics(ouId),
    enabled: !!ouId,
  });
}
