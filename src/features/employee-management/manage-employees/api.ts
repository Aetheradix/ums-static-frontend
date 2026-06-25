import { ApiService } from 'services';
import { EMPLOYEE_BASIC_URL, EMPLOYEE_URL } from './urls';

export async function getBasicEmployees() {
  const { error, data } =
    await ApiService.get<EmployeeManagement.QuickOnboardingItem[]>(
      EMPLOYEE_BASIC_URL
    );

  return !error ? data : [];
}

export async function getEmployeeById(id: number) {
  const { error, data } =
    await ApiService.get<EmployeeManagement.QuickOnboardingItem>(
      `${EMPLOYEE_URL}/${id}`
    );

  return !error ? data : undefined;
}
