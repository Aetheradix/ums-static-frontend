import { BUDGETS } from '../../mock-data';
export type BudgetItem = (typeof BUDGETS)[0];
export type BudgetForm = Omit<BudgetItem, 'id'>;
export async function getBudgets(): Promise<BudgetItem[]> {
  return Promise.resolve([...BUDGETS]);
}
export async function createBudget(form: BudgetForm): Promise<BudgetItem> {
  return Promise.resolve({ id: Date.now(), ...form });
}
export async function updateBudget(
  _id: number,
  _form: BudgetForm
): Promise<boolean> {
  return Promise.resolve(true);
}
