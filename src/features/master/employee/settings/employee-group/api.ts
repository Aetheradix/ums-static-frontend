import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const EMPLOYEE_GROUP_URL = `${MASTER_API_ROOT}employee-group`;

export function getEmployeeGroups() {
  return ApiService.getList<Master.Employee.EmployeeGroupItem>(
    EMPLOYEE_GROUP_URL
  );
}

export async function getEmployeeGroup(id: number) {
  const { data } = await ApiService.get<Master.Employee.EmployeeGroupForm>(
    `${EMPLOYEE_GROUP_URL}/${id}`
  );

  return data;
}

export async function createEmployeeGroup(
  form: Master.Employee.EmployeeGroupForm
) {
  const { error, data } =
    await ApiService.post<Master.Employee.EmployeeGroupForm>(
      EMPLOYEE_GROUP_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateEmployeeGroup(
  id: number,
  form: Master.Employee.EmployeeGroupForm
): Promise<boolean> {
  const result = await ApiService.put(`${EMPLOYEE_GROUP_URL}/${id}`, form);

  return !result.error;
}

export async function patchEmployeeGroupStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${EMPLOYEE_GROUP_URL}/${id}`, {
    isActive,
  });

  return !result.error;
}
