import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const DEGREE_LEVEL_URL = `${MASTER_API_ROOT}degree-level`;

export function getDegreeLevels() {
  //   return ApiService.getList<Master.Other.DegreeLevelForm>(DEGREE_LEVEL_URL);
  return Promise.resolve([
    { id: 1, name: 'Undergraduate', text: 'Undergraduate', isActive: true },
    { id: 2, name: 'Postgraduate', text: 'Postgraduate', isActive: true },
    { id: 3, name: 'Diploma', text: 'Diploma', isActive: true },
  ] as unknown as Master.Other.DegreeLevelForm[]);
}

export async function getDegreeLevel(id: number) {
  const { data } = await ApiService.get<Master.Other.DegreeLevelForm>(
    `${DEGREE_LEVEL_URL}/${id}`
  );
  return data;
}

export async function createDegreeLevel(form: Master.Other.DegreeLevelForm) {
  const { error, data } = await ApiService.post<Master.Other.DegreeLevelForm>(
    DEGREE_LEVEL_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateDegreeLevel(
  id: number,
  form: Master.Other.DegreeLevelForm
): Promise<boolean> {
  const result = await ApiService.put(`${DEGREE_LEVEL_URL}/${id}`, form);
  return !result.error;
}

export async function patchDegreeLevelStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${DEGREE_LEVEL_URL}/${id}/status`, {
    isActive,
  });

  return !result.error;
}
