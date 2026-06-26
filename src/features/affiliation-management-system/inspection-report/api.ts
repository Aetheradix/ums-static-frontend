import { useMutation } from '@tanstack/react-query';

export function useSubmitInspectionReportMutation() {
  return useMutation({
    mutationFn: async (data: any) => {
      // Simulate network delay for static showcase
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, data };
    },
  });
}
