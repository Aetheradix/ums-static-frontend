import { useQuery } from '@tanstack/react-query';
import { getUgcListed } from './api';

const QUERY_KEY = ['@master/ugc-listed'];

export function getUgcListedQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getUgcListed,
  });
  return { data, isLoading };
}
