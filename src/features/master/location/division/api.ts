import { ApiService } from 'services';

const DIVISION_URL = `master/divisions`;

export function getDivisions() {
  return ApiService.getList<Master.DivisionItem>(DIVISION_URL);
}

export async function getDivision(id: number) {
  const { data } = await ApiService.get<Master.DivisionItem>(
    `${DIVISION_URL}/${id}`
  );
  return data;
}

export async function createDivision(form: Master.DivisionForm) {
  const { error, data } = await ApiService.post<Master.DivisionItem>(
    DIVISION_URL,
    form
  );
  return !error ? data : undefined;
}

export async function updateDivision(
  id: number,
  form: Master.DivisionForm
): Promise<boolean> {
  const result = await ApiService.put(`${DIVISION_URL}/${id}`, form);
  return !result.error;
}

export async function patchDivisionStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${DIVISION_URL}/${id}`, {});

  return !result.error;
}
