import { useQuery } from '@tanstack/react-query';
import { getPatentRecordTypes } from './api';

const QUERY_KEY = ['@master/patent-record-type'];

export function usePatentRecordTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getPatentRecordTypes,
  });
  return { data, isLoading };
}
