import { useQuery } from '@tanstack/react-query';
import { getBudgetAllocations } from './api';
const QK = ['@fsc/budget-allocations'];
export function useBudgetAllocationsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getBudgetAllocations,
  });
  return { data, isLoading };
}
