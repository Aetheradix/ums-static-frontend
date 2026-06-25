import { useQuery } from '@tanstack/react-query';
import { getGroup } from './api';

const QUERY_KEY = ['@master/group-type'];

export function useGroupGradeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getGroup,
  });
  return { data, isLoading };
}
