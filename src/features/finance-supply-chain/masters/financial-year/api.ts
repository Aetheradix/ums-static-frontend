import { FINANCIAL_YEARS } from '../../mock-data';

export type FinancialYearItem = (typeof FINANCIAL_YEARS)[0];
export type FinancialYearForm = Omit<FinancialYearItem, 'id'>;

export async function getFinancialYears(): Promise<FinancialYearItem[]> {
  return Promise.resolve([...FINANCIAL_YEARS]);
}

export async function createFinancialYear(
  _form: FinancialYearForm
): Promise<FinancialYearItem> {
  return Promise.resolve({ id: Date.now(), ..._form });
}

export async function updateFinancialYear(
  _id: number,
  _form: FinancialYearForm
): Promise<boolean> {
  return Promise.resolve(true);
}

export async function toggleFinancialYearStatus(_id: number): Promise<boolean> {
  return Promise.resolve(true);
}
