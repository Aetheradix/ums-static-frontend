import { ApiService } from 'services';
import { APAR_APPLICATION_BASE_URL } from './urls';

export function getAparApplications() {
  return ApiService.getList<CareerAdvancement.AparApplication.AparApplicationItem>(
    APAR_APPLICATION_BASE_URL
  );
}

export async function getAparApplication(id: number) {
  const { data } =
    await ApiService.get<CareerAdvancement.AparApplication.AparApplicationItem>(
      `${APAR_APPLICATION_BASE_URL}/${id}`
    );
  return data;
}

export async function initiateAparApplication(
  command: CareerAdvancement.AparApplication.InitiateAparCommand
) {
  const { error, data } =
    await ApiService.post<CareerAdvancement.AparApplication.AparApplicationItem>(
      `${APAR_APPLICATION_BASE_URL}/initiate`,
      command
    );
  return !error ? data : undefined;
}
