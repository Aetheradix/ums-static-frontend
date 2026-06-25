import { ApiService } from 'services';

const DISTRICT_URL = `master/districts`;

export function getDistricts() {
  return ApiService.getList<Master.DistrictItem>(DISTRICT_URL);
}

export async function getDistrict(id: number) {
  const { data } = await ApiService.get<Master.DistrictItem>(
    `${DISTRICT_URL}/${id}`
  );
  return data;
}

export async function createDistrict(form: Master.DistrictForm) {
  const { error, data } = await ApiService.post<Master.DistrictItem>(
    DISTRICT_URL,
    form
  );
  return !error ? data : undefined;
}

export async function updateDistrict(
  id: number,
  form: Master.DistrictForm
): Promise<boolean> {
  const result = await ApiService.put(`${DISTRICT_URL}/${id}`, form);
  return !result.error;
}

export async function patchDistrictStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${DISTRICT_URL}/${id}`, {});

  return !result.error;
}
