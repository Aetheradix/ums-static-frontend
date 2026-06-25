import { useQuery } from '@tanstack/react-query';
import { getRelationship } from './api';

const QUERY_KEY = [`@master/relationship`];

export function useRelationshipQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getRelationship,
  });
  return { data, isLoading };
}
