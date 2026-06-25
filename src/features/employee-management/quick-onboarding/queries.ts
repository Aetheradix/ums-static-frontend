import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuickOnboarding } from './api';

const queryKey = ['@employees/quick-onboarding'];

export function useCreateQuickOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EmployeeManagement.QuickOnboardingForm) =>
      await createQuickOnboarding(data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
  });
}
