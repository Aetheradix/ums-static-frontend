import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CourseApi } from './api';

export const courseKeys = {
  all: ['cmsCourses'] as const,
  detail: (id: number) => ['cmsCourses', id] as const,
};

export const useCoursesQuery = () =>
  useQuery({
    queryKey: courseKeys.all,
    queryFn: () => CourseApi.getAll(),
  });

export const useCourseQuery = (id: number) =>
  useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => CourseApi.getById(id),
    enabled: !!id,
  });

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.CourseForm) => CourseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
};

export const useUpdateCourseMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.CourseForm) => CourseApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) });
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => CourseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
};
