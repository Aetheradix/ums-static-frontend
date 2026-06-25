import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const EMPLOYMENT_NATURE_URL = `${MASTER_API_ROOT}employment-nature`;

export function getEmploymentNatures() {
  return ApiService.getList<Master.Employee.EmploymentNatureItem>(
    EMPLOYMENT_NATURE_URL
  );
}

export async function getEmploymentNature(id: number) {
  const { data } = await ApiService.get<Master.Employee.EmploymentNatureForm>(
    `${EMPLOYMENT_NATURE_URL}/${id}`
  );

  return data;
}

export async function createEmploymentNature(
  form: Master.Employee.EmploymentNatureForm
) {
  const { error, data } =
    await ApiService.post<Master.Employee.EmploymentNatureForm>(
      EMPLOYMENT_NATURE_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateEmploymentNature(
  id: number,
  form: Master.Employee.EmploymentNatureForm
): Promise<boolean> {
  const result = await ApiService.put(`${EMPLOYMENT_NATURE_URL}/${id}`, form);

  return !result.error;
}

export async function patchEmploymentNatureStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${EMPLOYMENT_NATURE_URL}/${id}`, {
    isActive,
  });

  return !result.error;
}
