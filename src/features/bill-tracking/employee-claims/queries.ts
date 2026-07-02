import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEmployeeClaim,
  getEmployeeClaims,
  submitEmployeeClaim,
  type EmployeeClaimForm,
  type EmployeeClaimItem,
} from './api';

const QK = ['@bt/employee-claims'];

export function useEmployeeClaimsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getEmployeeClaims,
  });
  return { data, isLoading };
}

export function useCreateEmployeeClaimMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: EmployeeClaimForm) => createEmployeeClaim(f),
    onSuccess(data) {
      const prev = qc.getQueryData<EmployeeClaimItem[]>(QK) ?? [];
      qc.setQueryData(QK, [data, ...prev]);
    },
  });
}

export function useSubmitEmployeeClaimMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => submitEmployeeClaim(id),
    onSuccess(_, id) {
      const prev = qc.getQueryData<EmployeeClaimItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        prev.map(c => (c.id === id ? { ...c, status: 'Submitted' } : c))
      );
    },
  });
}
