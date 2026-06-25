import { useQuery } from '@tanstack/react-query';
import { getLanguagePreferences } from './api';

const QUERY_KEY = ['@master/language-preference'];

export function useLanguagePreferenceQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getLanguagePreferences,
  });
  return { data, isLoading };
}
