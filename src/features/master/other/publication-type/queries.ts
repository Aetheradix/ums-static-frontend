import { useQuery } from '@tanstack/react-query';
import { getPublicationTypes } from './api';

const QUERY_KEY = ['@master/publication-type'];

export function usePublicationTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getPublicationTypes,
  });
  return { data, isLoading };
}
