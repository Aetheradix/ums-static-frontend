import { useQuery } from '@tanstack/react-query';
import { getBudgetUtilization } from './api';
const QK = ['@fsc/budget-utilization'];
export function useBudgetUtilizationQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getBudgetUtilization,
  });
  return { data, isLoading };
}
