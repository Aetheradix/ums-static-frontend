import { useQuery } from '@tanstack/react-query';
import { getMaritalStatuses } from './api';

const QUERY_KEY = ['@master/marital-status'];

export function useMaritalStatusQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getMaritalStatuses,
  });

  return { data, isLoading };
}
