import { TAX_GST_CONFIG } from '../../mock-data';
export type TaxGstConfigItem = (typeof TAX_GST_CONFIG)[0];
export type TaxGstConfigForm = Omit<TaxGstConfigItem, 'id'>;
export async function getTaxGstConfigs(): Promise<TaxGstConfigItem[]> {
  return Promise.resolve([...TAX_GST_CONFIG]);
}
export async function createTaxGstConfig(
  form: TaxGstConfigForm
): Promise<TaxGstConfigItem> {
  return Promise.resolve({ id: Date.now(), ...form });
}
export async function updateTaxGstConfig(
  _id: number,
  _form: TaxGstConfigForm
): Promise<boolean> {
  return Promise.resolve(true);
}
export async function toggleTaxGstConfigStatus(_id: number): Promise<boolean> {
  return Promise.resolve(true);
}
