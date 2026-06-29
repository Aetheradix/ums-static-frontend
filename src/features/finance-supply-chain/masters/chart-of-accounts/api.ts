import { CHART_OF_ACCOUNTS } from '../../mock-data';

export type ChartOfAccountsItem = (typeof CHART_OF_ACCOUNTS)[0];
export type ChartOfAccountsForm = Omit<ChartOfAccountsItem, 'id'>;

export async function getChartOfAccounts(): Promise<ChartOfAccountsItem[]> {
  return Promise.resolve([...CHART_OF_ACCOUNTS]);
}
export async function createChartOfAccount(
  form: ChartOfAccountsForm
): Promise<ChartOfAccountsItem> {
  return Promise.resolve({ id: Date.now(), ...form });
}
export async function updateChartOfAccount(
  _id: number,
  _form: ChartOfAccountsForm
): Promise<boolean> {
  return Promise.resolve(true);
}
export async function toggleChartOfAccountStatus(
  _id: number
): Promise<boolean> {
  return Promise.resolve(true);
}
