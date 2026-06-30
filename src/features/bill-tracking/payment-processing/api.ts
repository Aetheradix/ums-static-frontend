// ─── Payment Processing API ───────────────────────────────────────────────────
import { BT_PAYMENT_VOUCHERS } from '../mock-data';

export type PaymentVoucherItem = (typeof BT_PAYMENT_VOUCHERS)[0];
export type PaymentVoucherForm = Omit<
  PaymentVoucherItem,
  'id' | 'voucherNo' | 'status'
>;

export async function getPaymentVouchers(): Promise<PaymentVoucherItem[]> {
  return Promise.resolve([...BT_PAYMENT_VOUCHERS]);
}

export async function createPaymentVoucher(
  form: PaymentVoucherForm
): Promise<PaymentVoucherItem> {
  const newId = Date.now();
  return Promise.resolve({
    id: newId,
    voucherNo: `PV-2025-${String(newId).slice(-3)}`,
    status: 'Paid',
    ...form,
  });
}
