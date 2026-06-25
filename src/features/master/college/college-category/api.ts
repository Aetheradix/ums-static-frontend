import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const COLLEGE_CATEGORY_URL = `${MASTER_API_ROOT}college-categories`;

export function getCollegeCategories() {
  return ApiService.getList<CollegeMaster.CollegeCategoryItem>(
    COLLEGE_CATEGORY_URL
  );
}

export async function getCollegeCategory(id: number) {
  const { data } = await ApiService.get<CollegeMaster.CollegeCategoryItem>(
    `${COLLEGE_CATEGORY_URL}/${id}`
  );
  return data;
}

export async function createCollegeCategory(
  form: CollegeMaster.CollegeCategoryForm
) {
  const { error, data } =
    await ApiService.post<CollegeMaster.CollegeCategoryItem>(
      COLLEGE_CATEGORY_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateCollegeCategory(
  id: number,
  form: CollegeMaster.CollegeCategoryForm
): Promise<boolean> {
  const result = await ApiService.put(`${COLLEGE_CATEGORY_URL}/${id}`, form);
  return !result.error;
}

export async function deleteCollegeCategory(id: number): Promise<boolean> {
  const result = await ApiService.del(`${COLLEGE_CATEGORY_URL}/${id}`);
  return !result.error;
}

export async function patchCollegeCategoryStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(
    `${COLLEGE_CATEGORY_URL}/${id}/status`,
    {}
  );
  return !result.error;
}
