import { useQuery } from '@tanstack/react-query';
import { getBudgetTransfers } from './api';
const QK = ['@fsc/budget-transfers'];
export function useBudgetTransfersQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getBudgetTransfers,
  });
  return { data, isLoading };
}
