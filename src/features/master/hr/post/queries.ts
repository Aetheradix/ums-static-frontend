import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPost,
  getPost,
  getPosts,
  deletePost,
  updatePost,
  patchPostStatus,
} from './api';

const QUERY_KEY = ['@master/post'];

export function usePostsQuery() {
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getPosts,
  });

  return { data, isLoading, refetch };
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Master.HR.PostForm) => await createPost(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<Master.HR.PostItem[]>(QUERY_KEY) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function usePostQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getPost(id);
      if (!data) return undefined;

      return {
        name: data.name,
        code: data.code,
      };
    },
  });
}

export function useUpdatePostMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Master.HR.PostForm) => await updatePost(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.PostItem[]>(QUERY_KEY) ?? [];

      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];

      const itemToReplace: Master.HR.PostItem = {
        id,
        name: formData.name,
        code: formData.code,
        isActive: existing?.isActive ?? true,
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

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deletePost(id),

    onSuccess(success, id) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.PostItem[]>(QUERY_KEY) ?? [];

      const updatedItems = result.filter(item => item.id !== id);

      queryClient.setQueryData(QUERY_KEY, updatedItems);
    },
  });
}

export function usePostActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchPostStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.HR.PostItem[]>(QUERY_KEY) ?? [];

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
