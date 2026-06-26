import { COST_CENTRES } from '../../mock-data';
export type CostCentreItem = (typeof COST_CENTRES)[0];
export type CostCentreForm = Omit<CostCentreItem, 'id'>;
export async function getCostCentres(): Promise<CostCentreItem[]> {
  return Promise.resolve([...COST_CENTRES]);
}
export async function createCostCentre(
  form: CostCentreForm
): Promise<CostCentreItem> {
  return Promise.resolve({ id: Date.now(), ...form });
}
export async function updateCostCentre(
  _id: number,
  _form: CostCentreForm
): Promise<boolean> {
  return Promise.resolve(true);
}
export async function toggleCostCentreStatus(_id: number): Promise<boolean> {
  return Promise.resolve(true);
}
