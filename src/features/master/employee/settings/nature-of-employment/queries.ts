import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEmploymentNature,
  getEmploymentNature,
  getEmploymentNatures,
  patchEmploymentNatureStatus,
  updateEmploymentNature,
} from './api';

const QUERY_KEY = ['@master/employment-nature'];

export function useEmploymentNaturesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getEmploymentNatures,
  });

  return { data, isLoading };
}

export function useGetEmploymentNatureByIdQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getEmploymentNature(id);

      if (!data) return undefined;

      return {
        name: data.name,
      };
    },
  });
}

export function useCreateEmploymentNatureMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.EmploymentNatureForm) =>
      await createEmploymentNature(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Employee.EmploymentNatureItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useUpdateEmploymentNatureMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.EmploymentNatureForm) =>
      await updateEmploymentNature(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.EmploymentNatureItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);

      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Employee.EmploymentNatureItem = {
        id: id,
        name: formData.name,
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

export function useEmploymentNatureStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchEmploymentNatureStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.EmploymentNatureItem[]>(
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
