import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBudget,
  getBudgets,
  updateBudget,
  type BudgetForm,
  type BudgetItem,
} from './api';
const QK = ['@fsc/budgets'];
export function useBudgetsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getBudgets,
  });
  return { data, isLoading };
}
export function useCreateBudgetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: BudgetForm) => createBudget(f),
    onSuccess(data) {
      const p = qc.getQueryData<BudgetItem[]>(QK) ?? [];
      qc.setQueryData(QK, [...p, data]);
    },
  });
}
export function useUpdateBudgetMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: BudgetForm) => updateBudget(id, f),
    onSuccess(_, f) {
      const p = qc.getQueryData<BudgetItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, ...f } : i))
      );
    },
  });
}
