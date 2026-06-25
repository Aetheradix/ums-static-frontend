import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const SCHEME_TYPE_URL = `${MASTER_API_ROOT}scheme-types`;

export function getSchemeTypes() {
  return ApiService.getList<Master.Scheme.SchemeTypeItem>(SCHEME_TYPE_URL);
}

export async function getSchemeType(id: number) {
  const { data } = await ApiService.get<Master.Scheme.SchemeTypeItem>(
    `${SCHEME_TYPE_URL}/${id}`
  );
  return data;
}

export async function createSchemeType(form: Master.Scheme.SchemeTypeForm) {
  const { error, data } = await ApiService.post<Master.Scheme.SchemeTypeItem>(
    SCHEME_TYPE_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateSchemeType(
  id: number,
  form: Master.Scheme.SchemeTypeForm
): Promise<boolean> {
  const result = await ApiService.put(`${SCHEME_TYPE_URL}/${id}`, form);
  return !result.error;
}

export async function deleteSchemeType(id: number): Promise<boolean> {
  const result = await ApiService.del(`${SCHEME_TYPE_URL}/${id}`);
  return !result.error;
}

export async function patchSchemeTypeStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${SCHEME_TYPE_URL}/${id}/status`, {});
  return !result.error;
}
