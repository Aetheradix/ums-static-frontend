import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTaxGstConfig,
  getTaxGstConfigs,
  toggleTaxGstConfigStatus,
  updateTaxGstConfig,
  type TaxGstConfigForm,
  type TaxGstConfigItem,
} from './api';
const QK = ['@fsc/tax-gst-config'];
export function useTaxGstConfigsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getTaxGstConfigs,
  });
  return { data, isLoading };
}
export function useCreateTaxGstConfigMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: TaxGstConfigForm) => createTaxGstConfig(f),
    onSuccess(data) {
      const p = qc.getQueryData<TaxGstConfigItem[]>(QK) ?? [];
      qc.setQueryData(QK, [...p, data]);
    },
  });
}
export function useUpdateTaxGstConfigMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: TaxGstConfigForm) => updateTaxGstConfig(id, f),
    onSuccess(_, f) {
      const p = qc.getQueryData<TaxGstConfigItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, ...f } : i))
      );
    },
  });
}
export function useToggleTaxGstConfigStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; isActive: boolean }) =>
      toggleTaxGstConfigStatus(id),
    onSuccess(_, { id, isActive }) {
      const p = qc.getQueryData<TaxGstConfigItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, isActive } : i))
      );
    },
  });
}
