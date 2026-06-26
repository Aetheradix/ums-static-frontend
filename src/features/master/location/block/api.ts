import { ApiService } from 'services';

const BLOCK_URL = `master/blocks`;

export function getBlocks() {
  //   return ApiService.getList<Master.BlockItem>(BLOCK_URL);
  return Promise.resolve([
    {
      id: 1,
      name: 'Indore Block',
      text: 'Indore Block',
      isActive: true,
      tehsilId: 1,
    },
    {
      id: 2,
      name: 'Rau Block',
      text: 'Rau Block',
      isActive: true,
      tehsilId: 1,
    },
  ] as unknown as Master.BlockItem[]);
}

export async function getBlock(id: number) {
  const { data } = await ApiService.get<Master.BlockItem>(`${BLOCK_URL}/${id}`);
  return data;
}

export async function createBlock(form: Master.BlockForm) {
  const { error, data } = await ApiService.post<Master.BlockItem>(
    BLOCK_URL,
    form
  );
  return !error ? data : undefined;
}

export async function updateBlock(
  id: number,
  form: Master.BlockForm
): Promise<boolean> {
  const result = await ApiService.put(`${BLOCK_URL}/${id}`, form);
  return !result.error;
}

export async function patchBlockStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${BLOCK_URL}/${id}`, {});

  return !result.error;
}
