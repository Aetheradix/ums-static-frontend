import { ApiService } from 'services';

const PROGRAMME_MODE_OF_EDUCATION_URL = `master/programme-modes-of-education`;
export function getProgrammeModeOfEducations() {
  return ApiService.getList<Master.SubjectMaster.ProgrammeModeOfEducationItem>(
    PROGRAMME_MODE_OF_EDUCATION_URL
  );
}

export async function getProgrammeModeOfEducation(id: number) {
  const { data } =
    await ApiService.get<Master.SubjectMaster.ProgrammeModeOfEducationItem>(
      `${PROGRAMME_MODE_OF_EDUCATION_URL}/${id}`
    );
  return data;
}

export async function createProgrammeModeOfEducation(
  form: Master.SubjectMaster.ProgrammeModeOfEducationForm
) {
  const { error, data } =
    await ApiService.post<Master.SubjectMaster.ProgrammeModeOfEducationItem>(
      PROGRAMME_MODE_OF_EDUCATION_URL,
      form
    );
  return !error ? data : undefined;
}

export async function updateProgrammeModeOfEducation(
  id: number,
  form: Master.SubjectMaster.ProgrammeModeOfEducationForm
): Promise<boolean> {
  const result = await ApiService.put(
    `${PROGRAMME_MODE_OF_EDUCATION_URL}/${id}`,
    form
  );
  return !result.error;
}

export async function patchProgrammeModeOfEducationStatus(
  id: number
): Promise<boolean> {
  const result = await ApiService.patch(
    `${PROGRAMME_MODE_OF_EDUCATION_URL}/${id}/status`,
    {}
  );
  return !result.error;
}
