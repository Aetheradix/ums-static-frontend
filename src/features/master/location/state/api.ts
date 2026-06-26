import { ApiService } from 'services';

const STATE_URL = `master/state`;

export function getStates() {
  //   return ApiService.getList<Master.StateItem>(STATE_URL);
  return Promise.resolve([
    { id: 1, name: 'Madhya Pradesh', text: 'Madhya Pradesh', isActive: true },
    { id: 2, name: 'Maharashtra', text: 'Maharashtra', isActive: true },
    { id: 3, name: 'Gujarat', text: 'Gujarat', isActive: true },
  ] as unknown as Master.StateItem[]);
}

export async function getState(id: number) {
  const { data } = await ApiService.get<Master.StateItem>(`${STATE_URL}/${id}`);
  return data;
}

export async function createState(form: Master.StateForm) {
  const { error, data } = await ApiService.post<Master.StateItem>(
    STATE_URL,
    form
  );
  return !error ? data : undefined;
}

export async function updateState(
  id: number,
  form: Master.StateForm
): Promise<boolean> {
  const result = await ApiService.put(`${STATE_URL}/${id}`, form);
  return !result.error;
}

export async function patchStateStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${STATE_URL}/${id}`, {});

  return !result.error;
}
