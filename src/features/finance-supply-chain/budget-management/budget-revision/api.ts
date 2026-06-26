import { BUDGET_REVISIONS } from '../../mock-data';
export type BudgetRevisionItem = (typeof BUDGET_REVISIONS)[0];
export async function getBudgetRevisions(): Promise<BudgetRevisionItem[]> {
  return Promise.resolve([...BUDGET_REVISIONS]);
}
