import { useQuery } from '@tanstack/react-query';
import { getAccommodationTypes } from './api';

const QUERY_KEY = ['@master/accommodation-type'];

export function useAccommodationTypesQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAccommodationTypes,
  });
  return { data, isLoading };
}
