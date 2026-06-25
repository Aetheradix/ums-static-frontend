import { useQuery } from '@tanstack/react-query';
import { getBloodGroups } from './api';

const QUERY_KEY = ['@master/blood-group'];

export function useBloodGroupQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getBloodGroups,
  });
  return { data, isLoading };
}
