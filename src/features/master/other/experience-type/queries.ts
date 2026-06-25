import { useQuery } from '@tanstack/react-query';
import { getExperienceTypes } from './api';

const QUERY_KEY = ['@master/experience-type'];

export function useExperienceTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getExperienceTypes,
  });
  return { data, isLoading };
}
