import { findMock } from '../../features/examination-management/mocks';

let apiRoot: string | undefined = undefined;

function setApiRoot(value: string) {
  apiRoot = value;
}

function getApiRoot() {
  return apiRoot;
}

// Simulate network delay to make UI transitions realistic
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function mockRequest<T>(
  url: string,
  defaultData: any = {}
): Promise<Api.ApiResult<T>> {
  console.log(`[Mock API Request] -> ${url}`);
  await delay(500);
  const data = findMock(url);

  if (data) {
    return { error: false, data: data as T };
  }

  console.warn(
    `[Mock API] No mock found for: ${url}. Returning default empty object/array.`
  );
  return { error: false, data: defaultData as T };
}

async function get<T>(url: string) {
  return await mockRequest<T>(url);
}

async function getList<T>(url: string): Promise<T[]> {
  const res = await mockRequest<T[]>(url, []);
  return res.data ?? [];
}

async function post<T>(url: string, body: unknown) {
  console.log(`[Mock API POST Payload] -> `, body);
  return await mockRequest<T>(url);
}

async function put<T>(url: string, body: unknown) {
  console.log(`[Mock API PUT Payload] -> `, body);
  return await mockRequest<T>(url);
}

async function del<T>(url: string) {
  return await mockRequest<T>(url);
}

async function patch<T>(url: string, body: unknown) {
  console.log(`[Mock API PATCH Payload] -> `, body);
  return await mockRequest<T>(url);
}

async function putFormData<T>(url: string, _formData: FormData) {
  return await mockRequest<T>(url);
}

async function postFormData<T>(url: string, _formData: FormData) {
  return await mockRequest<T>(url);
}

async function patchFormData<T>(url: string, _formData: FormData) {
  return await mockRequest<T>(url);
}

async function getFile(url: string, _body?: unknown) {
  console.log(`[Mock API Request] getFile -> ${url}`);
  await delay(500);
  return { error: false, data: new Blob() };
}

export default {
  get,
  getList,
  post,
  put,
  del,
  patch,
  putFormData,
  postFormData,
  patchFormData,
  getFile,
  setApiRoot,
  getApiRoot,
};
