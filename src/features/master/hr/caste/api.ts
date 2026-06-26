import { ApiService } from 'services';

const CASTE_URL = `master/castes`;

export function getCastes() {
  //   return ApiService.getList<Master.HR.CasteItem>(CASTE_URL);
  return Promise.resolve([
    { id: 1, name: 'General', text: 'General', isActive: true },
    { id: 2, name: 'OBC', text: 'OBC', isActive: true },
    { id: 3, name: 'SC/ST', text: 'SC/ST', isActive: true },
  ] as unknown as Master.HR.CasteItem[]);
}

export async function getCaste(id: number) {
  const { data } = await ApiService.get<Master.HR.CasteItem>(
    `${CASTE_URL}/${id}`
  );
  return data;
}

export async function createCaste(form: Master.HR.CasteForm) {
  const { error, data } = await ApiService.post<Master.HR.CasteItem>(
    CASTE_URL,
    form
  );
  return !error ? data : undefined;
}

export async function updateCaste(
  id: number,
  form: Master.HR.CasteForm
): Promise<boolean> {
  const result = await ApiService.put(`${CASTE_URL}/${id}`, form);
  return !result.error;
}

export async function patchCasteStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${CASTE_URL}/${id}`, {});

  return !result.error;
}
