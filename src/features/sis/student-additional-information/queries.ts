import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createStudentAdditionalInformation,
  getStudentAdditionalInformation,
  getStudentAdditionalInformations,
  updateStudentAdditionalInformation,
} from './api';

const QUERY_KEY = ['@sis/student-additional-information'];

export function useStudentAdditionalInformationsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getStudentAdditionalInformations,
  });

  return { data, isLoading };
}

export function useCreateStudentAdditionalInformationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SIS.StudentAdditionalInformationForm) =>
      await createStudentAdditionalInformation(data),

    onSuccess() {
      // Invalidate the list query to fetch fresh data from server
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useStudentAdditionalInformationQuery(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const data = await getStudentAdditionalInformation(id);
      if (!data) return undefined;

      return {
        studentId: data.studentId,
        studentAcademicId: data.studentAcademicId,
        emergencyContactName: data.emergencyContactName,
        emergencyContact: data.emergencyContact,
        emergencyRelation: data.emergencyRelation,
        emailNotification: data.emailNotification,
        smsNotification: data.smsNotification,
        pushNotification: data.pushNotification,
        languagePreferance: data.languagePreferance,
        profilePhoto: null,
        profilePhotoUrl: data.profilePhotoUrl,
      };
    },
    enabled: !!id,
  });
}

export function useUpdateStudentAdditionalInformationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SIS.StudentAdditionalInformationForm) =>
      await updateStudentAdditionalInformation(id, data),

    onSuccess(success) {
      if (!success) return;

      // Invalidate both list and individual query
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id] });
    },
  });
}
