import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createVendorBill,
  getVendorBills,
  submitVendorBill,
  type VendorBillForm,
  type VendorBillItem,
} from './api';

const QK = ['@bt/vendor-bills'];

export function useVendorBillsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getVendorBills,
  });
  return { data, isLoading };
}

export function useCreateVendorBillMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: VendorBillForm) => createVendorBill(f),
    onSuccess(data) {
      const prev = qc.getQueryData<VendorBillItem[]>(QK) ?? [];
      qc.setQueryData(QK, [data, ...prev]);
    },
  });
}

export function useSubmitVendorBillMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => submitVendorBill(id),
    onSuccess(_, id) {
      const prev = qc.getQueryData<VendorBillItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        prev.map(b => (b.id === id ? { ...b, status: 'Submitted' } : b))
      );
    },
  });
}
