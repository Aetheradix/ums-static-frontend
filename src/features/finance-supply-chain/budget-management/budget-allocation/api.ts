import { BUDGET_ALLOCATIONS } from '../../mock-data';
export type BudgetAllocationItem = (typeof BUDGET_ALLOCATIONS)[0];
export async function getBudgetAllocations(): Promise<BudgetAllocationItem[]> {
  return Promise.resolve([...BUDGET_ALLOCATIONS]);
}
