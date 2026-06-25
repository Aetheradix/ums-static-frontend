import { useQuery } from '@tanstack/react-query';
import { getEmployeeType } from './api';

const QUERY_KEY = ['@master/employee-type'];

export function useEmployeeTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getEmployeeType,
  });
  return { data, isLoading };
}
