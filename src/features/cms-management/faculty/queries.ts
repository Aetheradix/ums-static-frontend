import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FacultyApi } from './api';

export const facultyKeys = {
  all: ['cmsFaculty'] as const,
  detail: (id: number) => ['cmsFaculty', id] as const,
};

export const useFacultyQuery = () =>
  useQuery({
    queryKey: facultyKeys.all,
    queryFn: () => FacultyApi.getAll(),
  });

export const useFacultyMemberQuery = (id: number) =>
  useQuery({
    queryKey: facultyKeys.detail(id),
    queryFn: () => FacultyApi.getById(id),
    enabled: !!id,
  });

export const useCreateFacultyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.FacultyForm) => FacultyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.all });
    },
  });
};

export const useUpdateFacultyMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.FacultyForm) => FacultyApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.all });
      queryClient.invalidateQueries({ queryKey: facultyKeys.detail(id) });
    },
  });
};

export const useDeleteFacultyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => FacultyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.all });
    },
  });
};
