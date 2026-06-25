import { useQuery } from '@tanstack/react-query';
import { getPatentStatus } from './api';

const QUERY_KEY = ['@master/patent-status'];

export function usePatentStatusQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getPatentStatus,
  });
  return { data, isLoading };
}
