import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const ACADEMIC_YEAR_URL = `${MASTER_API_ROOT}academic-year`;

export function getAcademicYears() {
  return ApiService.getList<Master.Other.AcademicYearItem>(ACADEMIC_YEAR_URL);
}

export async function getAcademicYear(id: number) {
  const { data } = await ApiService.get<Master.Other.AcademicYearForm>(
    `${ACADEMIC_YEAR_URL}/${id}`
  );

  return data;
}

export async function createAcademicYear(form: Master.Other.AcademicYearForm) {
  const { error, data } = await ApiService.post<Master.Other.AcademicYearForm>(
    ACADEMIC_YEAR_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateAcademicYear(
  id: number,
  form: Master.Other.AcademicYearForm
): Promise<boolean> {
  const result = await ApiService.put(`${ACADEMIC_YEAR_URL}/${id}`, form);

  return !result.error;
}

export async function patchAcademicYearStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${ACADEMIC_YEAR_URL}/${id}`, {
    isActive,
  });

  return !result.error;
}
