import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StatsApi } from './api';

export const statKeys = {
  all: ['cmsStats'] as const,
};

export const useStatsQuery = () =>
  useQuery({
    queryKey: statKeys.all,
    queryFn: () => StatsApi.getAll(),
  });

export const useUpdateStatMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.UniversityStatForm) => StatsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statKeys.all });
    },
  });
};
