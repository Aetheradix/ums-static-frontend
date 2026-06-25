import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const SECTION_URL = `${MASTER_API_ROOT}sections`;

export function getSections() {
  return ApiService.getList<Master.HR.SectionItem>(SECTION_URL);
}

export async function getSection(id: number) {
  const { data } = await ApiService.get<Master.HR.SectionItem>(
    `${SECTION_URL}/${id}`
  );
  return data;
}

export async function createSection(form: Master.HR.SectionForm) {
  const { error, data } = await ApiService.post<Master.HR.SectionItem>(
    SECTION_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateSection(
  id: number,
  form: Master.HR.SectionForm
): Promise<boolean> {
  const result = await ApiService.put(`${SECTION_URL}/${id}`, form);
  return !result.error;
}

export async function deleteSection(id: number): Promise<boolean> {
  const result = await ApiService.del(`${SECTION_URL}/${id}`);
  return !result.error;
}

export async function patchSectionStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${SECTION_URL}/${id}/status`, {});
  return !result.error;
}
