import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBlock,
  getBlock,
  getBlocks,
  patchBlockStatus,
  updateBlock,
} from './api';

const QUERY_KEY = ['@master/block'];

export function useBlocksQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getBlocks,
  });
  return { data, isLoading };
}

export function useCreateBlockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.BlockForm) => await createBlock(data),

    onSuccess(data) {
      if (!data) return;
      const result =
        queryClient.getQueryData<Master.BlockItem[]>(QUERY_KEY) ?? [];
      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useBlockQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getBlock(id);
      if (!data) return undefined;
      return {
        name: data.name,
        code: data.code,
        districtId: data.districtId,
        tehsilId: data.tehsilId,
        isActive: data.isActive,
      };
    },
  });
}

export function useUpdateBlockMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.BlockForm) => await updateBlock(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.BlockItem[]>(QUERY_KEY) ?? [];
      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];
      const itemToReplace: Master.BlockItem = {
        id,
        name: formData.name,
        code: formData.code,
        districtId: formData.districtId,
        districtName: existing?.districtName ?? '',
        tehsilId: formData.tehsilId,
        tehsilName: existing?.tehsilName ?? '',
        isActive: existing?.isActive || formData.isActive,
      };

      queryClient.setQueryData(QUERY_KEY, [
        ...result.slice(0, index),
        itemToReplace,
        ...result.slice(index + 1),
      ]);
      queryClient.setQueryData([...QUERY_KEY, id], formData);
    },
  });
}

export function useBlockActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchBlockStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.BlockItem[]>(QUERY_KEY) ?? [];

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
