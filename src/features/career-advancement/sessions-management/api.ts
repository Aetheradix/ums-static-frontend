import { ApiService } from 'services';
import { SESSIONS_MANAGEMENT_BASE_URL } from './urls';

export function getSessions() {
  return ApiService.getList<CareerAdvancement.Session.SessionItem>(
    SESSIONS_MANAGEMENT_BASE_URL
  );
}

export async function getSession(id: number) {
  const { data } = await ApiService.get<CareerAdvancement.Session.SessionItem>(
    `${SESSIONS_MANAGEMENT_BASE_URL}/${id}`
  );
  return data;
}

export async function createSession(
  command: CareerAdvancement.Session.SessionCommand
) {
  const { error, data } =
    await ApiService.post<CareerAdvancement.Session.SessionItem>(
      SESSIONS_MANAGEMENT_BASE_URL,
      command
    );
  return !error ? data : undefined;
}

export async function updateSession(
  id: number,
  command: CareerAdvancement.Session.SessionCommand
): Promise<boolean> {
  const result = await ApiService.put(
    `${SESSIONS_MANAGEMENT_BASE_URL}/${id}`,
    command
  );
  return !result.error;
}

export async function deleteSession(id: number): Promise<boolean> {
  const result = await ApiService.del(`${SESSIONS_MANAGEMENT_BASE_URL}/${id}`);
  return !result.error;
}

export async function patchSessionStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(
    `${SESSIONS_MANAGEMENT_BASE_URL}/${id}/status`,
    {}
  );
  return !result.error;
}
