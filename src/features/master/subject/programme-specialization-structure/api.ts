import { ApiService } from 'services';

const BASE_URL = `master/programme-specialization-structures`;

export function getProgrammeSpecializationStructures() {
  return ApiService.getList<Master.SubjectMaster.ProgrammeSpecializationStructureItem>(
    BASE_URL
  );
}

export async function getProgrammeSpecializationStructure(id: number) {
  const { data } =
    await ApiService.get<Master.SubjectMaster.ProgrammeSpecializationStructureItem>(
      `${BASE_URL}/${id}`
    );
  return data;
}

export async function createProgrammeSpecializationStructure(
  form: Master.SubjectMaster.ProgrammeSpecializationStructureForm
) {
  const { error, data } =
    await ApiService.post<Master.SubjectMaster.ProgrammeSpecializationStructureItem>(
      BASE_URL,
      form
    );
  return !error ? data : undefined;
}

export async function updateProgrammeSpecializationStructure(
  id: number,
  form: Master.SubjectMaster.ProgrammeSpecializationStructureForm
): Promise<boolean> {
  const result = await ApiService.put(`${BASE_URL}/${id}`, form);
  return !result.error;
}

export async function patchProgrammeSpecializationStructureStatus(
  id: number
): Promise<boolean> {
  const result = await ApiService.patch(`${BASE_URL}/${id}/status`, {});
  return !result.error;
}
