import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const NATIONALITY_URL = `${MASTER_API_ROOT}nationality`;
export function getNationalities() {
  return ApiService.getList<Master.Other.NationalityItem>(NATIONALITY_URL);
}

export async function getNationality(id: number) {
  const { data } = await ApiService.get<Master.Other.NationalityForm>(
    `${NATIONALITY_URL}/${id}`
  );
  return data;
}

export async function createNationality(form: Master.Other.NationalityForm) {
  const { error, data } = await ApiService.post<Master.Other.NationalityForm>(
    NATIONALITY_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateNationality(
  id: number,
  form: Master.Other.NationalityForm
): Promise<boolean> {
  const result = await ApiService.put(`${NATIONALITY_URL}/${id}`, form);
  return !result.error;
}

export async function patchNationalityStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${NATIONALITY_URL}/${id}`, {
    isActive,
  });
  return !result.error;
}
