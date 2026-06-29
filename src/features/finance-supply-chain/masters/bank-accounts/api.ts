import { BANK_ACCOUNTS } from '../../mock-data';
export type BankAccountItem = (typeof BANK_ACCOUNTS)[0];
export type BankAccountForm = Omit<BankAccountItem, 'id'>;
export async function getBankAccounts(): Promise<BankAccountItem[]> {
  return Promise.resolve([...BANK_ACCOUNTS]);
}
export async function createBankAccount(
  form: BankAccountForm
): Promise<BankAccountItem> {
  return Promise.resolve({ id: Date.now(), ...form });
}
export async function updateBankAccount(
  _id: number,
  _form: BankAccountForm
): Promise<boolean> {
  return Promise.resolve(true);
}
export async function toggleBankAccountStatus(_id: number): Promise<boolean> {
  return Promise.resolve(true);
}
