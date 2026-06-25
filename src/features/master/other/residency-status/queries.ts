import { useQuery } from '@tanstack/react-query';
import { getResidencyStatuses } from './api';

const QUERY_KEY = ['@master/residency-statuses'];

export function useResidencyStatusesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getResidencyStatuses,
  });
  return { data, isLoading };
}
