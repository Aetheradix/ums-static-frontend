import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GalleryApi } from './api';

export const galleryKeys = {
  all: ['cmsGallery'] as const,
};

export const useGalleryQuery = () =>
  useQuery({
    queryKey: galleryKeys.all,
    queryFn: () => GalleryApi.getAll(),
  });

export const useCreateGalleryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.GalleryForm) => GalleryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
};

export const useDeleteGalleryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => GalleryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
};
