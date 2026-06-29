import { useQuery } from '@tanstack/react-query';
import { getBudgetRevisions } from './api';
const QK = ['@fsc/budget-revisions'];
export function useBudgetRevisionsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: getBudgetRevisions,
  });
  return { data, isLoading };
}
