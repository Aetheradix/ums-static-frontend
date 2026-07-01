// ─── Employee Claims API ──────────────────────────────────────────────────────
import { BT_EMPLOYEE_CLAIMS } from '../mock-data';

export type EmployeeClaimItem = (typeof BT_EMPLOYEE_CLAIMS)[0];
export type EmployeeClaimForm = Omit<
  EmployeeClaimItem,
  'id' | 'claimNo' | 'financialYear'
>;

export async function getEmployeeClaims(): Promise<EmployeeClaimItem[]> {
  return Promise.resolve([...BT_EMPLOYEE_CLAIMS]);
}

export async function createEmployeeClaim(
  form: EmployeeClaimForm
): Promise<EmployeeClaimItem> {
  const newId = Date.now();
  return Promise.resolve({
    id: newId,
    claimNo: `EC-2025-${String(newId).slice(-3)}`,
    ...form,
  });
}

export async function submitEmployeeClaim(_id: number): Promise<boolean> {
  return Promise.resolve(true);
}
