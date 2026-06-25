import { useQuery } from '@tanstack/react-query';
import { getTravelReasons } from './api';

const QUERY_KEY = ['@master/travel-reason'];

export function useTravelReasonQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getTravelReasons,
  });

  return { data, isLoading };
}
