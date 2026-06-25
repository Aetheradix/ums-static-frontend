import { ApiService } from 'services';

const BASE_URL = `master/subjects`;

export function getSubjects() {
  return ApiService.getList<Master.SubjectMaster.SubjectItem>(BASE_URL);
}

export async function getSubject(id: number) {
  const { data } = await ApiService.get<Master.SubjectMaster.SubjectItem>(
    `${BASE_URL}/${id}`
  );
  return data;
}

export async function createSubject(form: Master.SubjectMaster.SubjectForm) {
  const { error, data } =
    await ApiService.post<Master.SubjectMaster.SubjectItem>(BASE_URL, form);
  return !error ? data : undefined;
}

export async function updateSubject(
  id: number,
  form: Master.SubjectMaster.SubjectForm
): Promise<boolean> {
  const result = await ApiService.put(`${BASE_URL}/${id}`, form);
  return !result.error;
}

export async function patchSubjectStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${BASE_URL}/${id}/status`, {});
  return !result.error;
}
