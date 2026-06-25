import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDocumentOption,
  getDocumentOption,
  getDocumentOptions,
  patchDocumentOptionStatus,
  updateDocumentOption,
} from './api';

const QUERY_KEY = ['@master/document-option'];

export function useDocumentOptionsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDocumentOptions,
  });

  return { data, isLoading };
}

export function useGetDocumentOptionByIdQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getDocumentOption(id);

      if (!data) return undefined;

      return {
        name: data.name,
        isActive: data.isActive,
      };
    },
  });
}

export function useCreateDocumentOptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.DocumentOptionsForm) =>
      await createDocumentOption(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.Employee.DocumentOptionsItem[]>(
          QUERY_KEY
        ) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useUpdateDocumentOptionMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.Employee.DocumentOptionsForm) =>
      await updateDocumentOption(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.DocumentOptionsItem[]>(
          QUERY_KEY
        ) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.Employee.DocumentOptionsItem = {
        id,
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

export function useDocumentOptionStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchDocumentOptionStatus(data.id, data.isActive),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.Employee.DocumentOptionsItem[]>(
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
