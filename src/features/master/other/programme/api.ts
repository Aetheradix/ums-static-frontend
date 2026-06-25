import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const PROGRAMME_URL = `${MASTER_API_ROOT}programme`;

export function getProgrammes() {
  return ApiService.getList<Master.Other.ProgrammeItem>(PROGRAMME_URL);
}

export async function getProgramme(id: number) {
  const { data } = await ApiService.get<Master.Other.ProgrammeItem>(
    `${PROGRAMME_URL}/${id}`
  );
  return data;
}

export async function createProgramme(form: Master.Other.ProgrammeForm) {
  const { error, data } = await ApiService.post<Master.Other.ProgrammeItem>(
    PROGRAMME_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateProgramme(
  id: number,
  form: Master.Other.ProgrammeForm
): Promise<boolean> {
  const result = await ApiService.put(`${PROGRAMME_URL}/${id}`, form);
  return !result.error;
}

export async function patchProgrammeStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${PROGRAMME_URL}/${id}/status`, {
    isActive,
  });

  return !result.error;
}
