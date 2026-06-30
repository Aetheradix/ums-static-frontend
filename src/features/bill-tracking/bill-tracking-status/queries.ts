import { useQuery } from '@tanstack/react-query';
import { getBillTrackingDetails } from './api';

export const useBillTracking = (billRef: string) => {
  return useQuery({
    queryKey: ['bill-tracking', billRef],
    queryFn: () => getBillTrackingDetails(billRef),
    enabled: !!billRef,
  });
};
