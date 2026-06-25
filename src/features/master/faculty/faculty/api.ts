import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const FACULTY_URL = `${MASTER_API_ROOT}faculty`;

export function getFaculties() {
  return ApiService.getList<Master.FacultyItem>(FACULTY_URL);
}

export async function getFaculty(id: number) {
  const { data } = await ApiService.get<Master.FacultyItem>(
    `${FACULTY_URL}/${id}`
  );
  return data;
}

export async function createFaculty(form: Master.FacultyForm) {
  const { error, data } = await ApiService.post<Master.FacultyItem>(
    FACULTY_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updateFaculty(
  id: number,
  form: Master.FacultyForm
): Promise<boolean> {
  const result = await ApiService.put(`${FACULTY_URL}/${id}`, form);
  return !result.error;
}

export async function patchFacultyStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${FACULTY_URL}/${id}/status`, {
    isActive,
  });

  return !result.error;
}
