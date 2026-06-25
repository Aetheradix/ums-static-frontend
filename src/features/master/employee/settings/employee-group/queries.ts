import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEmployeeGroup,
  getEmployeeGroup,
  getEmployeeGroups,
  patchEmployeeGroupStatus,
  updateEmployeeGroup,
} from './api';

const QUERY_KEY = ['@master/employee-group'];

export function useEmployeeGroupsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getEmployeeGroups,
  });

  return { data, isLoading };
}

export function useGetEmployeeGroupByIdQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getEmployeeGroup(id);

      if (!data) return undefined;

      return {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      };
    },
  });
}

export function useCreateEmployeeGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.EmployeeGroupForm) =>
      await createEmployeeGroup(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Employee.EmployeeGroupItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useUpdateEmployeeGroupMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.EmployeeGroupForm) =>
      await updateEmployeeGroup(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.EmployeeGroupItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);

      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Employee.EmployeeGroupItem = {
        id: id,
        name: formData.name,
        description: formData.description,
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

export function useEmployeeGroupStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchEmployeeGroupStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.EmployeeGroupItem[]>(
          QUERY_KEY
        ) ?? [];

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
