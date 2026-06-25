import { ApiService } from 'services';

const BASE_URL = `master/subject-categories`;

export function getSubjectCategories() {
  return ApiService.getList<Master.SubjectMaster.SubjectCategoryItem>(BASE_URL);
}

export async function getSubjectCategory(id: number) {
  const { data } =
    await ApiService.get<Master.SubjectMaster.SubjectCategoryItem>(
      `${BASE_URL}/${id}`
    );
  return data;
}

export async function createSubjectCategory(
  form: Master.SubjectMaster.SubjectCategoryForm
) {
  const { error, data } =
    await ApiService.post<Master.SubjectMaster.SubjectCategoryItem>(
      BASE_URL,
      form
    );
  return !error ? data : undefined;
}

export async function updateSubjectCategory(
  id: number,
  form: Master.SubjectMaster.SubjectCategoryForm
): Promise<boolean> {
  const result = await ApiService.put(`${BASE_URL}/${id}`, form);
  return !result.error;
}

export async function patchSubjectCategoryStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${BASE_URL}/${id}/status`, {});
  return !result.error;
}
