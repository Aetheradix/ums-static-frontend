import { useQuery } from '@tanstack/react-query';
import { getOccupationTypes } from './api';

const QUERY_KEY = [`@master/occupation`];

export function useOccupationTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getOccupationTypes,
  });
  return { data, isLoading };
}
