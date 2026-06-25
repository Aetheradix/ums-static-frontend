import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;
const SCHEME_URL = `${MASTER_API_ROOT}scheme`;

export function getSchemes() {
  return ApiService.getList<Master.Scheme.SchemeItem>(SCHEME_URL);
}

export async function getScheme(id: number) {
  const { data } = await ApiService.get<Master.Scheme.SchemeItem>(
    `${SCHEME_URL}/${id}`
  );
  return data;
}

export async function createScheme(form: Master.Scheme.SchemeForm) {
  const { error, data } = await ApiService.post<Master.Scheme.SchemeItem>(
    SCHEME_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateScheme(
  id: number,
  form: Master.Scheme.SchemeForm
): Promise<boolean> {
  const result = await ApiService.put(`${SCHEME_URL}/${id}`, form);
  return !result.error;
}

export async function deleteScheme(id: number): Promise<boolean> {
  const result = await ApiService.del(`${SCHEME_URL}/${id}`);
  return !result.error;
}

export async function patchSchemeStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${SCHEME_URL}/${id}/status`, {});
  return !result.error;
}
