import { useQuery } from '@tanstack/react-query';
import { getCancelledBills } from './api';

export const useCancelledBills = () => {
  return useQuery({
    queryKey: ['cancelled-bills'],
    queryFn: getCancelledBills,
    initialData: [],
  });
};
