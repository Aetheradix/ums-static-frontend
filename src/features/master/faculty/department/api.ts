import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const DEPARTMENT_URL = `${MASTER_API_ROOT}department`;

export function getDepartments() {
  return ApiService.getList<Master.DepartmentItem>(DEPARTMENT_URL);
}

export async function getDepartment(id: number) {
  const { data } = await ApiService.get<Master.DepartmentItem>(
    `${DEPARTMENT_URL}/${id}`
  );
  return data;
}

export async function createDepartment(form: Master.DepartmentForm) {
  const { error, data } = await ApiService.post<Master.DepartmentItem>(
    DEPARTMENT_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateDepartment(
  id: number,
  form: Master.DepartmentForm
): Promise<boolean> {
  const result = await ApiService.put(`${DEPARTMENT_URL}/${id}`, form);
  return !result.error;
}

export async function patchDepartmentStatus(
  id: number,
  _isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${DEPARTMENT_URL}/${id}/status`, {});

  return !result.error;
}
