import { useQuery } from '@tanstack/react-query';
import { getAppraisalApplicationForwardedToType } from './api';

const QUERY_KEY = ['@master/appraisal-application-forwarded-to-type'];

export function useAppraisalApplicationForwardedToTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAppraisalApplicationForwardedToType,
  });
  return { data, isLoading };
}
