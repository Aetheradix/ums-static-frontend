import { useQuery } from '@tanstack/react-query';
import { getAddressType } from './api';

const QUERY_KEY = ['@master/address-type'];

export function useAddressTypeQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAddressType,
  });
  return { data, isLoading };
}
