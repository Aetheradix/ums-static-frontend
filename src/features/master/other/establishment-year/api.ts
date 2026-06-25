import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const ESTABLISHMENT_YEAR_URL = `${MASTER_API_ROOT}establishment-years`;

export function getEstablishmentYears() {
  return ApiService.getList<Master.Other.EstablishmentYearItem>(
    ESTABLISHMENT_YEAR_URL
  );
}

export async function getEstablishmentYear(id: number) {
  const { data } = await ApiService.get<Master.Other.EstablishmentYearItem>(
    `${ESTABLISHMENT_YEAR_URL}/${id}`
  );
  return data;
}

export async function createEstablishmentYear(
  form: Master.Other.EstablishmentYearForm
) {
  const { error, data } =
    await ApiService.post<Master.Other.EstablishmentYearItem>(
      ESTABLISHMENT_YEAR_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateEstablishmentYear(
  id: number,
  form: Master.Other.EstablishmentYearForm
): Promise<boolean> {
  const result = await ApiService.put(`${ESTABLISHMENT_YEAR_URL}/${id}`, form);
  return !result.error;
}

export async function deleteEstablishmentYear(id: number): Promise<boolean> {
  const result = await ApiService.del(`${ESTABLISHMENT_YEAR_URL}/${id}`);
  return !result.error;
}

export async function patchEstablishmentYearStatus(
  id: number
): Promise<boolean> {
  const result = await ApiService.patch(
    `${ESTABLISHMENT_YEAR_URL}/${id}/status`,
    {}
  );
  return !result.error;
}
