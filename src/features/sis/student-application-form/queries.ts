import { useMutation } from '@tanstack/react-query';
import { createApplication } from './api';
import type { CreateApplicationCommand } from './types';

export function useCreateApplicationMutation() {
  return useMutation({
    mutationFn: async (data: CreateApplicationCommand) =>
      await createApplication(data),
  });
}
