import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProgrammeModeOfEducation,
  getProgrammeModeOfEducation,
  getProgrammeModeOfEducations,
  patchProgrammeModeOfEducationStatus,
  updateProgrammeModeOfEducation,
} from './api';

const QUERY_KEY = ['@master/programme-mode-of-educations'];

export function useProgrammeModeOfEducationsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getProgrammeModeOfEducations,
  });
  return { data, isLoading };
}

export function useCreateProgrammeModeOfEducationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Master.SubjectMaster.ProgrammeModeOfEducationForm
    ) => await createProgrammeModeOfEducation(data),

    onSuccess(data) {
      if (!data) return;
      const result =
        queryClient.getQueryData<
          Master.SubjectMaster.ProgrammeModeOfEducationItem[]
        >(QUERY_KEY) ?? [];
      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useProgrammeModeOfEducationQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getProgrammeModeOfEducation(id);
      if (!data) return undefined;
      return {
        name: data.name,
        code: data.code,
        isActive: data.isActive,
      };
    },
  });
}

export function useUpdateProgrammeModeOfEducationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Master.SubjectMaster.ProgrammeModeOfEducationForm
    ) => await updateProgrammeModeOfEducation(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<
          Master.SubjectMaster.ProgrammeModeOfEducationItem[]
        >(QUERY_KEY) ?? [];
      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];
      const itemToReplace: Master.SubjectMaster.ProgrammeModeOfEducationItem = {
        id,
        name: formData.name,
        code: formData.code,
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

export function useProgrammeModeOfEducationActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchProgrammeModeOfEducationStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<
          Master.SubjectMaster.ProgrammeModeOfEducationItem[]
        >(QUERY_KEY) ?? [];

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
