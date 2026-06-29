import { BUDGET_ALLOCATIONS } from '../../mock-data';
export async function getBudgetUtilization() {
  return Promise.resolve([...BUDGET_ALLOCATIONS]);
}
