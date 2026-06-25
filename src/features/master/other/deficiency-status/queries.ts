import { useQuery } from '@tanstack/react-query';
import { getDeficiencyStatuses } from './api';

const QUERY_KEY = ['@master/deficiency-status'];

export function useDeficiencyStatusesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDeficiencyStatuses,
  });
  return { data, isLoading };
}
