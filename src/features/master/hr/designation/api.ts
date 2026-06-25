import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const DESIGNATION_URL = `${MASTER_API_ROOT}designations`;

export function getDesignations() {
  return ApiService.getList<Master.HR.DesignationItem>(DESIGNATION_URL);
}

export async function getDesignation(id: number) {
  const { data } = await ApiService.get<Master.HR.DesignationItem>(
    `${DESIGNATION_URL}/${id}`
  );
  return data;
}

export async function createDesignation(form: Master.HR.DesignationForm) {
  const { error, data } = await ApiService.post<Master.HR.DesignationItem>(
    DESIGNATION_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateDesignation(
  id: number,
  form: Master.HR.DesignationForm
): Promise<boolean> {
  const result = await ApiService.put(`${DESIGNATION_URL}/${id}`, form);
  return !result.error;
}

export async function deleteDesignation(id: number): Promise<boolean> {
  const result = await ApiService.del(`${DESIGNATION_URL}/${id}`);
  return !result.error;
}

export async function patchDesignationStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${DESIGNATION_URL}/${id}/status`, {});
  return !result.error;
}
