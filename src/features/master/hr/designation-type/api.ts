import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const DESIGNATION_TYPE_URL = `${MASTER_API_ROOT}designation-types`;

export function getDesignationTypes() {
  return ApiService.getList<Master.HR.DesignationTypeItem>(
    DESIGNATION_TYPE_URL
  );
}

export async function getDesignationType(id: number) {
  const { data } = await ApiService.get<Master.HR.DesignationTypeItem>(
    `${DESIGNATION_TYPE_URL}/${id}`
  );
  return data;
}

export async function createDesignationType(
  form: Master.HR.DesignationTypeForm
) {
  const { error, data } = await ApiService.post<Master.HR.DesignationTypeItem>(
    DESIGNATION_TYPE_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateDesignationType(
  id: number,
  form: Master.HR.DesignationTypeForm
): Promise<boolean> {
  const result = await ApiService.put(`${DESIGNATION_TYPE_URL}/${id}`, form);
  return !result.error;
}

export async function deleteDesignationType(id: number): Promise<boolean> {
  const result = await ApiService.del(`${DESIGNATION_TYPE_URL}/${id}`);
  return !result.error;
}

export async function patchDesignationTypeStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(
    `${DESIGNATION_TYPE_URL}/${id}/status`,
    {}
  );
  return !result.error;
}
