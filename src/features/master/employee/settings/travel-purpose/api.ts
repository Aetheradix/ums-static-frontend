import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const TRAVEL_PURPOSE_URL = `${MASTER_API_ROOT}travel-purpose`;

export function getTravelPurposes() {
  return ApiService.getList<Master.Employee.TravelPurposeItem>(
    TRAVEL_PURPOSE_URL
  );
}

export async function getTravelPurpose(id: number) {
  const { data } = await ApiService.get<Master.Employee.TravelPurposeForm>(
    `${TRAVEL_PURPOSE_URL}/${id}`
  );

  return data;
}

export async function createTravelPurpose(
  form: Master.Employee.TravelPurposeForm
) {
  const { error, data } =
    await ApiService.post<Master.Employee.TravelPurposeForm>(
      TRAVEL_PURPOSE_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateTravelPurpose(
  id: number,
  form: Master.Employee.TravelPurposeForm
): Promise<boolean> {
  const result = await ApiService.put(`${TRAVEL_PURPOSE_URL}/${id}`, form);

  return !result.error;
}

export async function patchTravelPurposeStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${TRAVEL_PURPOSE_URL}/${id}/status`, {
    isActive,
  });

  return !result.error;
}
