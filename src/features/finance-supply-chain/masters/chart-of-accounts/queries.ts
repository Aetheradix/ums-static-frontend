import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createChartOfAccount,
  getChartOfAccounts,
  toggleChartOfAccountStatus,
  updateChartOfAccount,
  type ChartOfAccountsForm,
  type ChartOfAccountsItem,
} from './api';

const QK = ['@fsc/chart-of-accounts'];

export function useChartOfAccountsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getChartOfAccounts,
  });
  return { data, isLoading };
}

export function useCreateChartOfAccountMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: ChartOfAccountsForm) => createChartOfAccount(form),
    onSuccess(data) {
      const prev = qc.getQueryData<ChartOfAccountsItem[]>(QK) ?? [];
      qc.setQueryData(QK, [...prev, data]);
    },
  });
}

export function useUpdateChartOfAccountMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: ChartOfAccountsForm) => updateChartOfAccount(id, form),
    onSuccess(_, form) {
      const prev = qc.getQueryData<ChartOfAccountsItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        prev.map(item => (item.id === id ? { ...item, ...form } : item))
      );
    },
  });
}

export function useToggleChartOfAccountStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; isActive: boolean }) =>
      toggleChartOfAccountStatus(id),
    onSuccess(_, { id, isActive }) {
      const prev = qc.getQueryData<ChartOfAccountsItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        prev.map(item => (item.id === id ? { ...item, isActive } : item))
      );
    },
  });
}
