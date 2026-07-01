import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getBudgetRevisions,
  createBudgetRevision,
  updateBudgetRevision,
} from './api';

const QK = ['@fsc/budget-revisions'];

export function useBudgetRevisionsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getBudgetRevisions,
  });
  return { data, isLoading };
}

export function useCreateBudgetRevisionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBudgetRevision,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}

export function useUpdateBudgetRevisionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof updateBudgetRevision>[1];
    }) => updateBudgetRevision(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}
