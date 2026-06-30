import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFinancialYear,
  getFinancialYears,
  toggleFinancialYearStatus,
  type FinancialYearForm,
  type FinancialYearItem,
  updateFinancialYear,
} from './api';

const QK = ['@fsc/financial-year'];

export function useFinancialYearsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getFinancialYears,
  });
  return { data, isLoading };
}

export function useCreateFinancialYearMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FinancialYearForm) => createFinancialYear(form),
    onSuccess(data) {
      const prev = qc.getQueryData<FinancialYearItem[]>(QK) ?? [];
      qc.setQueryData(QK, [...prev, data]);
    },
  });
}

export function useUpdateFinancialYearMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FinancialYearForm) => updateFinancialYear(id, form),
    onSuccess(_, form) {
      const prev = qc.getQueryData<FinancialYearItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        prev.map(item => (item.id === id ? { ...item, ...form } : item))
      );
    },
  });
}

export function useToggleFinancialYearStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; isActive: boolean }) =>
      toggleFinancialYearStatus(id),
    onSuccess(_, { id, isActive }) {
      const prev = qc.getQueryData<FinancialYearItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        prev.map(item => (item.id === id ? { ...item, isActive } : item))
      );
    },
  });
}
