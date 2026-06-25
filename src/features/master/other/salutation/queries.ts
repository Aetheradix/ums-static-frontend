import { useQuery } from '@tanstack/react-query';
import { getSalutations } from './api';

const QUERY_KEY = ['@master/salutation'];

export function useSalutationQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getSalutations,
  });

  return { data, isLoading };
}
