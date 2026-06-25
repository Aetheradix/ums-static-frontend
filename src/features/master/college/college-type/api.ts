import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const COLLEGE_TYPE_URL = `${MASTER_API_ROOT}college-types`;

export function getCollegeTypes() {
  return ApiService.getList<CollegeMaster.CollegeTypeItem>(COLLEGE_TYPE_URL);
}

export async function getCollegeType(id: number) {
  const { data } = await ApiService.get<CollegeMaster.CollegeTypeItem>(
    `${COLLEGE_TYPE_URL}/${id}`
  );
  return data;
}

export async function createCollegeType(form: CollegeMaster.CollegeTypeForm) {
  const { error, data } = await ApiService.post<CollegeMaster.CollegeTypeItem>(
    COLLEGE_TYPE_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateCollegeType(
  id: number,
  form: CollegeMaster.CollegeTypeForm
): Promise<boolean> {
  const result = await ApiService.put(`${COLLEGE_TYPE_URL}/${id}`, form);
  return !result.error;
}

export async function deleteCollegeType(id: number): Promise<boolean> {
  const result = await ApiService.del(`${COLLEGE_TYPE_URL}/${id}`);
  return !result.error;
}

export async function patchCollegeTypeStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${COLLEGE_TYPE_URL}/${id}/status`, {});
  return !result.error;
}
