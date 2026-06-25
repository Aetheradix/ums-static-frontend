import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const SCHEME_CATEGORY_URL = `${MASTER_API_ROOT}scheme-categories`;

export function getSchemeCategories() {
  return ApiService.getList<Master.Scheme.SchemeCategoryItem>(
    SCHEME_CATEGORY_URL
  );
}

export async function getSchemeCategory(id: number) {
  const { data } = await ApiService.get<Master.Scheme.SchemeCategoryItem>(
    `${SCHEME_CATEGORY_URL}/${id}`
  );
  return data;
}

export async function createSchemeCategory(
  form: Master.Scheme.SchemeCategoryForm
) {
  const { error, data } =
    await ApiService.post<Master.Scheme.SchemeCategoryItem>(
      SCHEME_CATEGORY_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateSchemeCategory(
  id: number,
  form: Master.Scheme.SchemeCategoryForm
): Promise<boolean> {
  const result = await ApiService.put(`${SCHEME_CATEGORY_URL}/${id}`, form);
  return !result.error;
}

export async function deleteSchemeCategory(id: number): Promise<boolean> {
  const result = await ApiService.del(`${SCHEME_CATEGORY_URL}/${id}`);
  return !result.error;
}

export async function patchSchemeCategoryStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(
    `${SCHEME_CATEGORY_URL}/${id}/status`,
    {}
  );
  return !result.error;
}
