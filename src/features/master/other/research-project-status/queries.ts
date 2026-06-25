import { useQuery } from '@tanstack/react-query';
import { getResearchProjectStatus } from './api';

const QUERY_KEY = ['@master/research-project-status'];

export function useResearchProjectStatusQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getResearchProjectStatus,
  });
  return { data, isLoading };
}
