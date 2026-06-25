import { useQuery } from '@tanstack/react-query';
import { getFinancialSupportTypes } from './api';

const QUERY_KEY = ['@master/financial-support-type'];

export function useFinancialSupportTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getFinancialSupportTypes,
  });
  return { data, isLoading };
}
