import { useQuery } from '@tanstack/react-query';
import { getBasicEmployees, getEmployeeById } from './api';

const BASIC_EMPLOYEES_KEY = ['@employee/basic'];
const EMPLOYEE_BY_ID_KEY = ['@employee/detail'];

export function useGetBasicEmployeesQuery() {
  return useQuery({
    queryKey: BASIC_EMPLOYEES_KEY,
    queryFn: async () => await getBasicEmployees(),
  });
}

export function useGetEmployeeByIdQuery(id: number) {
  return useQuery({
    queryKey: [...EMPLOYEE_BY_ID_KEY, id],
    queryFn: async () => await getEmployeeById(id),
    enabled: !!id,
  });
}
