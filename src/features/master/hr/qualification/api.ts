import { ApiService } from 'services';

const QUALIFICATION_URL = `master/qualifications`;

export function getQualifications() {
  return ApiService.getList<Master.HR.QualificationItem>(QUALIFICATION_URL);
}

export async function getQualification(id: number) {
  const { data } = await ApiService.get<Master.HR.QualificationItem>(
    `${QUALIFICATION_URL}/${id}`
  );
  return data;
}

export async function createQualification(form: Master.HR.QualificationForm) {
  const { error, data } = await ApiService.post<Master.HR.QualificationItem>(
    QUALIFICATION_URL,
    form
  );
  return !error ? data : undefined;
}

export async function updateQualification(
  id: number,
  form: Master.HR.QualificationForm
): Promise<boolean> {
  const result = await ApiService.put(`${QUALIFICATION_URL}/${id}`, form);
  return !result.error;
}

export async function patchQualificationStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${QUALIFICATION_URL}/${id}`, {});

  return !result.error;
}
