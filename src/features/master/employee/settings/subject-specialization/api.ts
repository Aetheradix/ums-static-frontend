import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const SUBJECT_SPECIALIZATION_URL = `${MASTER_API_ROOT}subject-specialization`;

export function getSubjectSpecializations() {
  return ApiService.getList<Master.Employee.SubjectSpecializationItem>(
    SUBJECT_SPECIALIZATION_URL
  );
}

export async function getSubjectSpecialization(id: number) {
  const { data } =
    await ApiService.get<Master.Employee.SubjectSpecializationForm>(
      `${SUBJECT_SPECIALIZATION_URL}/${id}`
    );

  return data;
}

export async function createSubjectSpecialization(
  form: Master.Employee.SubjectSpecializationForm
) {
  const { error, data } =
    await ApiService.post<Master.Employee.SubjectSpecializationForm>(
      SUBJECT_SPECIALIZATION_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateSubjectSpecialization(
  id: number,
  form: Master.Employee.SubjectSpecializationForm
): Promise<boolean> {
  const result = await ApiService.put(
    `${SUBJECT_SPECIALIZATION_URL}/${id}`,
    form
  );

  return !result.error;
}

export async function patchSubjectSpecializationStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${SUBJECT_SPECIALIZATION_URL}/${id}`, {
    isActive,
  });

  return !result.error;
}
