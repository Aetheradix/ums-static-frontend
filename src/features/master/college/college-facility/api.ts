import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const AVAILABLE_FACILITY_URL = `${MASTER_API_ROOT}available-facility`;

export function getAvailableFacilities() {
  return ApiService.getList<CollegeMaster.AvailableFacilityItem>(
    AVAILABLE_FACILITY_URL
  );
}

export async function getAvailableFacility(id: number) {
  const { data } = await ApiService.get<CollegeMaster.AvailableFacilityItem>(
    `${AVAILABLE_FACILITY_URL}/${id}`
  );
  return data;
}

export async function createAvailableFacility(
  form: CollegeMaster.AvailableFacilityForm
) {
  const { error, data } =
    await ApiService.post<CollegeMaster.AvailableFacilityItem>(
      AVAILABLE_FACILITY_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateAvailableFacility(
  id: number,
  form: CollegeMaster.AvailableFacilityForm
): Promise<boolean> {
  const result = await ApiService.put(`${AVAILABLE_FACILITY_URL}/${id}`, form);
  return !result.error;
}

export async function deleteAvailableFacility(id: number): Promise<boolean> {
  const result = await ApiService.del(`${AVAILABLE_FACILITY_URL}/${id}`);
  return !result.error;
}

export async function patchAvailableFacilityStatus(
  id: number
): Promise<boolean> {
  const result = await ApiService.patch(
    `${AVAILABLE_FACILITY_URL}/${id}/status`,
    {}
  );
  return !result.error;
}
