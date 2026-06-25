import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDepartment,
  getDepartment,
  getDepartments,
  patchDepartmentStatus,
  updateDepartment,
} from './api';

const QUERY_KEY = ['@master/department'];

export function useDepartmentsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDepartments,
  });

  return { data, isLoading };
}

export function useCreateDepartmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.DepartmentForm) =>
      await createDepartment(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.DepartmentItem[]>(QUERY_KEY) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useDepartmentQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getDepartment(id);
      if (!data) return undefined;

      return {
        code: data.code,
        name: data.name,
        officeTypeId: data.officeTypeId,
        hodName: data.hodName,
        contactNumber: data.contactNumber,
      };
    },
  });
}

export function useUpdateDepartmentMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.DepartmentForm) =>
      await updateDepartment(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.DepartmentItem[]>(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.DepartmentItem = {
        id,
        code: formData.code,
        name: formData.name,
        officeTypeId: formData.officeTypeId,
        hodName: formData.hodName,
        contactNumber: formData.contactNumber,
        isActive: existing?.isActive,
      };

      const updatedItems = [
        ...result.slice(0, index),
        itemToReplace,
        ...result.slice(index + 1),
      ];

      queryClient.setQueryData(QUERY_KEY, updatedItems);
      queryClient.setQueryData([...QUERY_KEY, id], formData);
    },
  });
}

export function useDepartmentActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchDepartmentStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.DepartmentItem[]>(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === variables.id);
      if (index === -1) return;

      const updatedItem = {
        ...result[index],
        isActive: variables.isActive,
      };

      queryClient.setQueryData(QUERY_KEY, [
        ...result.slice(0, index),
        updatedItem,
        ...result.slice(index + 1),
      ]);
    },
  });
}
