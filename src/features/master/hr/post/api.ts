import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const POST_URL = `${MASTER_API_ROOT}posts`;

export function getPosts() {
  return ApiService.getList<Master.HR.PostItem>(POST_URL);
}

export async function getPost(id: number) {
  const { data } = await ApiService.get<Master.HR.PostItem>(
    `${POST_URL}/${id}`
  );
  return data;
}

export async function createPost(form: Master.HR.PostForm) {
  const { error, data } = await ApiService.post<Master.HR.PostItem>(
    POST_URL,
    form
  );

  return !error ? data : undefined;
}

export async function updatePost(
  id: number,
  form: Master.HR.PostForm
): Promise<boolean> {
  const result = await ApiService.put(`${POST_URL}/${id}`, form);
  return !result.error;
}

export async function deletePost(id: number): Promise<boolean> {
  const result = await ApiService.del(`${POST_URL}/${id}`);
  return !result.error;
}

export async function patchPostStatus(id: number): Promise<boolean> {
  const result = await ApiService.patch(`${POST_URL}/${id}/status`, {});
  return !result.error;
}
