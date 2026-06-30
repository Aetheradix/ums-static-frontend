// ─── Vendor Bills API ─────────────────────────────────────────────────────────
import { BT_VENDOR_BILLS } from '../mock-data';

export type VendorBillItem = (typeof BT_VENDOR_BILLS)[0] & {
  purposeOfBill?: string;
  attachment?: string | File | null;
};
export type VendorBillForm = Omit<
  (typeof BT_VENDOR_BILLS)[0],
  'id' | 'billNo' | 'financialYear'
> & {
  purposeOfBill?: string;
  attachment?: File | null;
};

export async function getVendorBills(): Promise<VendorBillItem[]> {
  return Promise.resolve([...BT_VENDOR_BILLS]);
}

export async function createVendorBill(
  form: VendorBillForm
): Promise<VendorBillItem> {
  const newId = Date.now();
  return Promise.resolve({
    id: newId,
    billNo: `VB-2025-${String(newId).slice(-3)}`,
    ...form,
  });
}

export async function submitVendorBill(_id: number): Promise<boolean> {
  return Promise.resolve(true);
}
