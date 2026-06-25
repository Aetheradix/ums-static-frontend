import { useQuery } from '@tanstack/react-query';
import { getDocType } from './api';

const QUERY_KEY = ['@master/document-type'];

export function useDocumentTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDocType,
  });
  return { data, isLoading };
}
