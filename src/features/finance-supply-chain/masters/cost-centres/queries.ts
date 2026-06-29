import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCostCentre,
  getCostCentres,
  toggleCostCentreStatus,
  updateCostCentre,
  type CostCentreForm,
  type CostCentreItem,
} from './api';
const QK = ['@fsc/cost-centres'];
export function useCostCentresQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getCostCentres,
  });
  return { data, isLoading };
}
export function useCreateCostCentreMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: CostCentreForm) => createCostCentre(f),
    onSuccess(data) {
      const p = qc.getQueryData<CostCentreItem[]>(QK) ?? [];
      qc.setQueryData(QK, [...p, data]);
    },
  });
}
export function useUpdateCostCentreMutation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (f: CostCentreForm) => updateCostCentre(id, f),
    onSuccess(_, f) {
      const p = qc.getQueryData<CostCentreItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, ...f } : i))
      );
    },
  });
}
export function useToggleCostCentreStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; isActive: boolean }) =>
      toggleCostCentreStatus(id),
    onSuccess(_, { id, isActive }) {
      const p = qc.getQueryData<CostCentreItem[]>(QK) ?? [];
      qc.setQueryData(
        QK,
        p.map(i => (i.id === id ? { ...i, isActive } : i))
      );
    },
  });
}
