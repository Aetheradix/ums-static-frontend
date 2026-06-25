import { useQuery } from '@tanstack/react-query';
import { getGenders } from './api';

const QUERY_KEY = ['@master/gender'];

export function useGenderQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getGenders,
  });
  return { data, isLoading };
}
