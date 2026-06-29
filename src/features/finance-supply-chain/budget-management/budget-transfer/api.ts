import { BUDGET_TRANSFERS } from '../../mock-data';
export type BudgetTransferItem = (typeof BUDGET_TRANSFERS)[0];
export async function getBudgetTransfers(): Promise<BudgetTransferItem[]> {
  return Promise.resolve([...BUDGET_TRANSFERS]);
}
