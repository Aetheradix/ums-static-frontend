import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOrganizationUnit,
  getOrganizationUnit,
  getOrganizationUnits,
  patchOrganizationUnitStatus,
  updateOrganizationUnit,
} from './api';

const QUERY_KEY = ['@master/organization-unit'];

export function useOrganizationUnitsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getOrganizationUnits,
  });

  return { data, isLoading };
}

export function useGetOrganizationUnitByIdQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getOrganizationUnit(id);

      if (!data) return undefined;

      return {
        name: data.name,
      };
    },
  });
}

export function useCreateOrganizationUnitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.OrganizationUnitForm) =>
      await createOrganizationUnit(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Employee.OrganizationUnitItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useUpdateOrganizationUnitMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.OrganizationUnitForm) =>
      await updateOrganizationUnit(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.OrganizationUnitItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);

      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Employee.OrganizationUnitItem = {
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

export function useOrganizationUnitStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchOrganizationUnitStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.OrganizationUnitItem[]>(
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
