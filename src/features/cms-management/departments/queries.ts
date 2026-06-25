import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DepartmentApi } from './api';

export const departmentKeys = {
  all: ['cmsDepartments'] as const,
  detail: (id: number) => ['cmsDepartments', id] as const,
};

export const useDepartmentsQuery = () =>
  useQuery({
    queryKey: departmentKeys.all,
    queryFn: () => DepartmentApi.getAll(),
  });

export const useDepartmentQuery = (id: number) =>
  useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => DepartmentApi.getById(id),
    enabled: !!id,
  });

export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.DepartmentForm) => DepartmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};

export const useUpdateDepartmentMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Cms.DepartmentForm) => DepartmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id) });
    },
  });
};

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => DepartmentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};
