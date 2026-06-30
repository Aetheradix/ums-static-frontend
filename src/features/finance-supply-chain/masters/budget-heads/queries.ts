import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBudgetHead,
  getBudgetHeads,
  toggleBudgetHeadStatus,
  updateBudgetHead,
  type BudgetHeadForm,
  type BudgetHeadItem,
} from './api';
const QK = ['@fsc/budget-heads'];
export function useBudgetHeadsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getBudgetHeads,
  });
  return { data, isLoading };
}
export function useCreateBudgetHeadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: BudgetHeadForm) => createBudgetHead(f),
    onSuccess(data) {
      const p = qc.getQueryData<BudgetHeadItem[]>(QK) ?? [];
      qc.setQueryData(QK, [...p, data]);
    },
  });
}
export function useUpdateBudgetHeadMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: BudgetHeadForm) => updateBudgetHead(id, f),
    onSuccess(_, f) {
      const p = qc.getQueryData<BudgetHeadItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, ...f } : i))
      );
    },
  });
}
export function useToggleBudgetHeadStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; isActive: boolean }) =>
      toggleBudgetHeadStatus(id),
    onSuccess(_, { id, isActive }) {
      const p = qc.getQueryData<BudgetHeadItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, isActive } : i))
      );
    },
  });
}
