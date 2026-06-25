import { useQuery } from '@tanstack/react-query';
import { getDraftRegistration } from './api';

const QUERY_KEY = ['@affiliation/draft-registration'];

export function useGetDraftRegistrationQuery(
  applicationNumber: string,
  establishmentYear: number
) {
  return useQuery({
    queryKey: [...QUERY_KEY, applicationNumber, establishmentYear],
    queryFn: () => getDraftRegistration(applicationNumber, establishmentYear),
    enabled:
      !!applicationNumber && !!establishmentYear && establishmentYear > 0,
  });
}
