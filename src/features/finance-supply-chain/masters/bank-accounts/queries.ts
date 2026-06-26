import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBankAccount,
  getBankAccounts,
  toggleBankAccountStatus,
  updateBankAccount,
  type BankAccountForm,
  type BankAccountItem,
} from './api';
const QK = ['@fsc/bank-accounts'];
export function useBankAccountsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getBankAccounts,
  });
  return { data, isLoading };
}
export function useCreateBankAccountMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: BankAccountForm) => createBankAccount(f),
    onSuccess(data) {
      const p = qc.getQueryData<BankAccountItem[]>(QK) ?? [];
      qc.setQueryData(QK, [...p, data]);
    },
  });
}
export function useUpdateBankAccountMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: BankAccountForm) => updateBankAccount(id, f),
    onSuccess(_, f) {
      const p = qc.getQueryData<BankAccountItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, ...f } : i))
      );
    },
  });
}
export function useToggleBankAccountStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; isActive: boolean }) =>
      toggleBankAccountStatus(id),
    onSuccess(_, { id, isActive }) {
      const p = qc.getQueryData<BankAccountItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, isActive } : i))
      );
    },
  });
}
