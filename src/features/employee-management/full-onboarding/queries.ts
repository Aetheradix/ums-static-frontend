import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFullOnboarding } from './api';

const queryKey = ['@employees/full-onboarding'];

export function useCreateFullOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EmployeeManagement.FullOnboardingForm) =>
      await createFullOnboarding(data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
  });
}
