import { useQuery } from '@tanstack/react-query';
import { getAppraisalApplicationStatus } from './api';

const QUERY_KEY = ['@master/appraisal-application-status'];

export function useAppraisalApplicationStatusQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAppraisalApplicationStatus,
  });
  return { data, isLoading };
}
