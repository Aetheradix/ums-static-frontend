import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NoticesApi } from './api';

export const noticeKeys = {
  all: ['cmsNotices'] as const,
};

export const useNoticesQuery = () =>
  useQuery({
    queryKey: noticeKeys.all,
    queryFn: () => NoticesApi.getAll(),
  });

export const useCreateNoticeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.NoticeForm) => NoticesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
};

export const useUpdateNoticeMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.NoticeForm) => NoticesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
};

export const useDeleteNoticeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NoticesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
};
