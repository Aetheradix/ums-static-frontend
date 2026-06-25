import { useQuery } from '@tanstack/react-query';
import { getCollegeAreas } from './api';

const QUERY_KEY = ['@master/college-area'];

export function useCollegeAreasQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getCollegeAreas,
  });
  return { data, isLoading };
}
