import { BUDGET_REVISIONS } from '../../mock-data';

export type BudgetRevisionItem = (typeof BUDGET_REVISIONS)[0];

export type BudgetRevisionForm = Omit<
  BudgetRevisionItem,
  'id' | 'revisionNo' | 'date'
> & {
  revisionNo?: string;
  date?: string;
};

export async function getBudgetRevisions(): Promise<BudgetRevisionItem[]> {
  return Promise.resolve([...BUDGET_REVISIONS]);
}

export async function createBudgetRevision(
  data: BudgetRevisionForm
): Promise<BudgetRevisionItem> {
  const newItem: BudgetRevisionItem = {
    ...data,
    id: Date.now(),
    revisionNo:
      data.revisionNo ||
      `REV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
    date: data.date || new Date().toISOString().split('T')[0],
  };
  BUDGET_REVISIONS.push(newItem);
  return Promise.resolve(newItem);
}

export async function updateBudgetRevision(
  id: number,
  data: Partial<BudgetRevisionForm>
): Promise<BudgetRevisionItem> {
  const index = BUDGET_REVISIONS.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Not found');
  const updatedItem = { ...BUDGET_REVISIONS[index], ...data };
  BUDGET_REVISIONS[index] = updatedItem;
  return Promise.resolve(updatedItem);
}
