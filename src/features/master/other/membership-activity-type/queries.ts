import { useQuery } from '@tanstack/react-query';
import { getMembershipActivityTypes } from './api';

const QUERY_KEY = ['@master/membership-activity-type'];

export function useMembershipActivityTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getMembershipActivityTypes,
  });
  return { data, isLoading };
}
