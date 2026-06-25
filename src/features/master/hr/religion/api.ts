import { ApiService } from 'services';

const RELIGION_URL = `master/religions`;

export function getReligions() {
  return ApiService.getList<Master.HR.ReligionItem>(RELIGION_URL);
}

export async function getReligion(id: number) {
  const { data } = await ApiService.get<Master.HR.ReligionItem>(
    `${RELIGION_URL}/${id}`
  );
  return data;
}

export async function createReligion(form: Master.HR.ReligionForm) {
  const { error, data } = await ApiService.post<Master.HR.ReligionItem>(
    RELIGION_URL,
    form
  );
  return !error ? data : undefined;
}

export async function updateReligion(
  id: number,
  form: Master.HR.ReligionForm
): Promise<boolean> {
  const result = await ApiService.put(`${RELIGION_URL}/${id}`, form);
  return !result.error;
}

export async function patchReligionStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${RELIGION_URL}/${id}`, {});

  return !result.error;
}
