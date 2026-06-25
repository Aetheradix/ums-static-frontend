import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const CLASS_URL = `${MASTER_API_ROOT}classes`;

export function getClasses() {
  return ApiService.getList<Master.HR.ClassItem>(CLASS_URL);
}

export async function getClass(id: number) {
  const { data } = await ApiService.get<Master.HR.ClassItem>(
    `${CLASS_URL}/${id}`
  );
  return data;
}

export async function createClass(form: Master.HR.ClassForm) {
  const { error, data } = await ApiService.post<Master.HR.ClassItem>(
    CLASS_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateClass(
  id: number,
  form: Master.HR.ClassForm
): Promise<boolean> {
  const result = await ApiService.put(`${CLASS_URL}/${id}`, form);
  return !result.error;
}

export async function deleteClass(id: number): Promise<boolean> {
  const result = await ApiService.del(`${CLASS_URL}/${id}`);
  return !result.error;
}

export async function patchClassStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${CLASS_URL}/${id}/status`, {});
  return !result.error;
}
