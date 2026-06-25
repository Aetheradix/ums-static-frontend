import { useQuery } from '@tanstack/react-query';
import { getAppraisalType } from './api';

const QUERY_KEY = ['@master/appraisal-type'];

export function useAppraisalTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAppraisalType,
  });
  return { data, isLoading };
}
