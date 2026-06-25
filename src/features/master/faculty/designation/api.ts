import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const DESIGNATION_URL = `${MASTER_API_ROOT}faculty-designation`;

export function getDesignations() {
  return ApiService.getList<Master.DesignationItem>(DESIGNATION_URL);
}

export async function getDesignation(id: number) {
  const { data } = await ApiService.get<Master.DesignationItem>(
    `${DESIGNATION_URL}/${id}`
  );
  return data;
}

export async function createDesignation(form: Master.DesignationForm) {
  const { error, data } = await ApiService.post<Master.DesignationItem>(
    DESIGNATION_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateDesignation(
  id: number,
  form: Master.DesignationForm
): Promise<boolean> {
  const result = await ApiService.put(`${DESIGNATION_URL}/${id}`, form);
  return !result.error;
}

export async function patchDesignationStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${DESIGNATION_URL}/${id}/status`, {
    isActive,
  });

  return !result.error;
}
