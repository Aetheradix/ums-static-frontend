import { ApiService } from 'services';

const TEHSIL_URL = `master/tehsil`;

export function getTehsils() {
  //   return ApiService.getList<Master.TehsilItem>(TEHSIL_URL);
  return Promise.resolve([
    {
      id: 1,
      name: 'Indore Tehsil',
      text: 'Indore Tehsil',
      isActive: true,
      districtId: 1,
    },
    {
      id: 2,
      name: 'Mhow Tehsil',
      text: 'Mhow Tehsil',
      isActive: true,
      districtId: 1,
    },
  ] as unknown as Master.TehsilItem[]);
}

export async function getTehsil(id: number) {
  const { data } = await ApiService.get<Master.TehsilItem>(
    `${TEHSIL_URL}/${id}`
  );
  return data;
}

export async function createTehsil(form: Master.TehsilForm) {
  const { error, data } = await ApiService.post<Master.TehsilItem>(
    TEHSIL_URL,
    form
  );
  return !error ? data : undefined;
}

export async function updateTehsil(
  id: number,
  form: Master.TehsilForm
): Promise<boolean> {
  const result = await ApiService.put(`${TEHSIL_URL}/${id}`, form);
  return !result.error;
}

export async function patchTehsilStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${TEHSIL_URL}/${id}`, {});

  return !result.error;
}
