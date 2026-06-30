import { BUDGET_HEADS } from '../../mock-data';
export type BudgetHeadItem = (typeof BUDGET_HEADS)[0];
export type BudgetHeadForm = Omit<BudgetHeadItem, 'id'>;
export async function getBudgetHeads(): Promise<BudgetHeadItem[]> {
  return Promise.resolve([...BUDGET_HEADS]);
}
export async function createBudgetHead(
  form: BudgetHeadForm
): Promise<BudgetHeadItem> {
  return Promise.resolve({ id: Date.now(), ...form });
}
export async function updateBudgetHead(
  _id: number,
  _form: BudgetHeadForm
): Promise<boolean> {
  return Promise.resolve(true);
}
export async function toggleBudgetHeadStatus(_id: number): Promise<boolean> {
  return Promise.resolve(true);
}
