import { useQuery } from '@tanstack/react-query';
import { getSemester } from './api';

const QUERY_KEY = ['@master/semester'];

export function useSemesterQuery(options?: { enabled?: boolean }) {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getSemester,
    enabled: options?.enabled ?? true,
  });
  return { data, isLoading };
}
