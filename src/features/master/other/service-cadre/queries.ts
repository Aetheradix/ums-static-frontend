import { useQuery } from '@tanstack/react-query';
import { getServiceCadres } from './api';

const QUERY_KEY = ['@master/service-cadre'];

export function useServiceCadreQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getServiceCadres,
  });
  return { data, isLoading };
}
