import { useQuery } from '@tanstack/react-query';
import { getDayOfWeek } from './api';

const QUERY_KEY = ['@master/day-of-week'];

export function useDayOfWeekQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDayOfWeek,
  });
  return { data, isLoading };
}
