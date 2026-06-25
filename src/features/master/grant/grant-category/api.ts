import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const GRANT_CATEGORY_URL = `${MASTER_API_ROOT}grant-categories`;

export function getGrantCategories() {
  return ApiService.getList<Master.Grant.GrantCategoryItem>(GRANT_CATEGORY_URL);
}

export async function getGrantCategory(id: number) {
  const { data } = await ApiService.get<Master.Grant.GrantCategoryItem>(
    `${GRANT_CATEGORY_URL}/${id}`
  );
  return data;
}

export async function createGrantCategory(
  form: Master.Grant.GrantCategoryForm
) {
  const { error, data } = await ApiService.post<Master.Grant.GrantCategoryItem>(
    GRANT_CATEGORY_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateGrantCategory(
  id: number,
  form: Master.Grant.GrantCategoryForm
): Promise<boolean> {
  const result = await ApiService.put(`${GRANT_CATEGORY_URL}/${id}`, form);
  return !result.error;
}

export async function deleteGrantCategory(id: number): Promise<boolean> {
  const result = await ApiService.del(`${GRANT_CATEGORY_URL}/${id}`);
  return !result.error;
}

export async function patchGrantCategoryStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(
    `${GRANT_CATEGORY_URL}/${id}/status`,
    {}
  );
  return !result.error;
}
