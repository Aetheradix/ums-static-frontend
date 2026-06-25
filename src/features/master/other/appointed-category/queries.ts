import { useQuery } from '@tanstack/react-query';
import { getAppointedCategories } from './api';

const QUERY_KEY = ['@master/appointed-category'];

export function useAppointedCategoryQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAppointedCategories,
  });

  return { data, isLoading };
}
