// ─── Bill Receipt API ─────────────────────────────────────────────────────────
import { BT_BILL_RECEIPTS } from '../mock-data';

export type BillReceiptItem = (typeof BT_BILL_RECEIPTS)[0] & {
  purposeOfBill?: string;
  attachment?: string | File | null;
};
export type BillReceiptForm = Omit<
  (typeof BT_BILL_RECEIPTS)[0],
  'id' | 'receiptNo' | 'status'
> & {
  purposeOfBill?: string;
  attachment?: File | null;
};

export async function getBillReceipts(): Promise<BillReceiptItem[]> {
  return Promise.resolve([...BT_BILL_RECEIPTS]);
}

export async function createBillReceipt(
  form: BillReceiptForm
): Promise<BillReceiptItem> {
  const newId = Date.now();
  return Promise.resolve({
    id: newId,
    receiptNo: `BRC-2025-${String(newId).slice(-3)}`,
    status: 'Received',
    ...form,
  });
}
