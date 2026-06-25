import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProgrammeSpecializationStructure,
  getProgrammeSpecializationStructure,
  getProgrammeSpecializationStructures,
  patchProgrammeSpecializationStructureStatus,
  updateProgrammeSpecializationStructure,
} from './api';

const QUERY_KEY = ['@master/programme-specialization-structures'];

export function useProgrammeSpecializationStructuresQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getProgrammeSpecializationStructures,
  });
  return { data, isLoading };
}

export function useCreateProgrammeSpecializationStructureMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Master.SubjectMaster.ProgrammeSpecializationStructureForm
    ) => await createProgrammeSpecializationStructure(data),

    onSuccess(data) {
      if (!data) return;
      const result =
        queryClient.getQueryData<
          Master.SubjectMaster.ProgrammeSpecializationStructureItem[]
        >(QUERY_KEY) ?? [];
      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}

export function useProgrammeSpecializationStructureQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getProgrammeSpecializationStructure(id);
      if (!data) return undefined;
      return {
        programmeId: data.programmeId,
        specializationId: data.specializationId,
        modeOfEducationId: data.modeOfEducationId,
        semesterName: data.semesterName,
        subjectId: data.subjectId,
        lectureStructure: data.lectureStructure,
        tutorialStructure: data.tutorialStructure,
        practicalStructure: data.practicalStructure,
        totalCredits: data.totalCredits,
        isActive: data.isActive,
      };
    },
  });
}

export function useUpdateProgrammeSpecializationStructureMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Master.SubjectMaster.ProgrammeSpecializationStructureForm
    ) => await updateProgrammeSpecializationStructure(id, data),

    onSuccess(success, formData) {
      if (!success) return;

      const result =
        queryClient.getQueryData<
          Master.SubjectMaster.ProgrammeSpecializationStructureItem[]
        >(QUERY_KEY) ?? [];
      const index = result.findIndex(item => item.id === id);
      if (index === -1) return;

      const existing = result[index];
      const itemToReplace: Master.SubjectMaster.ProgrammeSpecializationStructureItem =
        {
          id,
          ...formData,
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

export function useProgrammeSpecializationStructureActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; isActive: boolean }) =>
      await patchProgrammeSpecializationStructureStatus(data.id),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<
          Master.SubjectMaster.ProgrammeSpecializationStructureItem[]
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
