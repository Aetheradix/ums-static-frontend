import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DownloadsApi } from './api';

export const downloadKeys = {
  all: ['cmsDownloads'] as const,
};

export const useDownloadsQuery = () =>
  useQuery({
    queryKey: downloadKeys.all,
    queryFn: () => DownloadsApi.getAll(),
  });

export const useCreateDownloadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.DownloadForm) => DownloadsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: downloadKeys.all });
    },
  });
};

export const useUpdateDownloadMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.DownloadForm) => DownloadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: downloadKeys.all });
    },
  });
};

export const useDeleteDownloadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => DownloadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: downloadKeys.all });
    },
  });
};
