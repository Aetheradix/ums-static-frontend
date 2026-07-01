import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPaymentVoucher,
  getPaymentVouchers,
  type PaymentVoucherForm,
  type PaymentVoucherItem,
} from './api';

const QK = ['@bt/payment-vouchers'];

export function usePaymentVouchersQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getPaymentVouchers,
  });
  return { data, isLoading };
}

export function useCreatePaymentVoucherMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: PaymentVoucherForm) => createPaymentVoucher(f),
    onSuccess(data) {
      const prev = qc.getQueryData<PaymentVoucherItem[]>(QK) ?? [];
      qc.setQueryData(QK, [data, ...prev]);
    },
  });
}
