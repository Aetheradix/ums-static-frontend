import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NewsApi } from './api';

export const newsKeys = {
  all: ['cmsNews'] as const,
};

export const useNewsQuery = () =>
  useQuery({
    queryKey: newsKeys.all,
    queryFn: () => NewsApi.getAll(),
  });

export const useCreateNewsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.NewsEventForm) => NewsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
    },
  });
};

export const useUpdateNewsMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.NewsEventForm) => NewsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
    },
  });
};

export const useDeleteNewsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
    },
  });
};
