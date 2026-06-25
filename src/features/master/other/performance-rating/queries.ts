import { useQuery } from '@tanstack/react-query';
import { getPerformanceRatings } from './api';

const QUERY_KEY = ['@master/performance-rating'];

export function usePerformanceRatingQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getPerformanceRatings,
  });
  return { data, isLoading };
}
