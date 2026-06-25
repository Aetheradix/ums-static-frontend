import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const SPECIALISATION_URL = `${MASTER_API_ROOT}specialisation`;

export function getSpecialisations() {
  return ApiService.getList<Master.Other.SpecialisationItem>(
    SPECIALISATION_URL
  );
}

export async function getSpecialisation(id: number) {
  const { data } = await ApiService.get<Master.Other.SpecialisationItem>(
    `${SPECIALISATION_URL}/${id}`
  );
  return data;
}

export async function createSpecialisation(
  form: Master.Other.SpecialisationForm
) {
  const { error, data } =
    await ApiService.post<Master.Other.SpecialisationItem>(
      SPECIALISATION_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateSpecialisation(
  id: number,
  form: Master.Other.SpecialisationForm
): Promise<boolean> {
  const result = await ApiService.put(`${SPECIALISATION_URL}/${id}`, form);
  return !result.error;
}

export async function patchSpecialisationStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${SPECIALISATION_URL}/${id}/status`, {
    isActive,
  });

  return !result.error;
}
