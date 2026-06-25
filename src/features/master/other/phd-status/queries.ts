import { useQuery } from '@tanstack/react-query';
import { getPhDStatus } from './api';

const QUERY_KEY = ['@master/phd-status'];

export function usePhDStatusQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getPhDStatus,
  });
  return { data, isLoading };
}
