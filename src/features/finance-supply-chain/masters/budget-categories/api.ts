import { BUDGET_CATEGORIES } from '../../mock-data';
export type BudgetCategoryItem = (typeof BUDGET_CATEGORIES)[0];
export type BudgetCategoryForm = Omit<BudgetCategoryItem, 'id'>;
export async function getBudgetCategories(): Promise<BudgetCategoryItem[]> {
  return Promise.resolve([...BUDGET_CATEGORIES]);
}
export async function createBudgetCategory(
  form: BudgetCategoryForm
): Promise<BudgetCategoryItem> {
  return Promise.resolve({ id: Date.now(), ...form });
}
export async function updateBudgetCategory(
  _id: number,
  _form: BudgetCategoryForm
): Promise<boolean> {
  return Promise.resolve(true);
}
export async function toggleBudgetCategoryStatus(
  _id: number
): Promise<boolean> {
  return Promise.resolve(true);
}
