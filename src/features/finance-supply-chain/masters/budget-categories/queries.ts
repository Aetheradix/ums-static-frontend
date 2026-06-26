import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBudgetCategory,
  getBudgetCategories,
  toggleBudgetCategoryStatus,
  updateBudgetCategory,
  type BudgetCategoryForm,
  type BudgetCategoryItem,
} from './api';
const QK = ['@fsc/budget-categories'];
export function useBudgetCategoriesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getBudgetCategories,
  });
  return { data, isLoading };
}
export function useCreateBudgetCategoryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: BudgetCategoryForm) => createBudgetCategory(f),
    onSuccess(data) {
      const p = qc.getQueryData<BudgetCategoryItem[]>(QK) ?? [];
      qc.setQueryData(QK, [...p, data]);
    },
  });
}
export function useUpdateBudgetCategoryMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: BudgetCategoryForm) => updateBudgetCategory(id, f),
    onSuccess(_, f) {
      const p = qc.getQueryData<BudgetCategoryItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, ...f } : i))
      );
    },
  });
}
export function useToggleBudgetCategoryStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; isActive: boolean }) =>
      toggleBudgetCategoryStatus(id),
    onSuccess(_, { id, isActive }) {
      const p = qc.getQueryData<BudgetCategoryItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, isActive } : i))
      );
    },
  });
}
