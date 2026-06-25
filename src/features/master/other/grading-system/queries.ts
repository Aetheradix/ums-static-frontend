import { useQuery } from '@tanstack/react-query';
import { getGradingSystems } from './api';

const QUERY_KEY = ['@master/grading-system'];

export function useGradingSystemQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getGradingSystems,
  });
  return { data, isLoading };
}
