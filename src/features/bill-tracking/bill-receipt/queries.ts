import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBillReceipt,
  getBillReceipts,
  type BillReceiptForm,
  type BillReceiptItem,
} from './api';

const QK = ['@bt/bill-receipts'];

export function useBillReceiptsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getBillReceipts,
  });
  return { data, isLoading };
}

export function useCreateBillReceiptMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: BillReceiptForm) => createBillReceipt(f),
    onSuccess(data) {
      const prev = qc.getQueryData<BillReceiptItem[]>(QK) ?? [];
      qc.setQueryData(QK, [data, ...prev]);
    },
  });
}
