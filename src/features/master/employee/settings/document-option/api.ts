import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const DOCUMENT_OPTION_URL = `${MASTER_API_ROOT}document-option`;

export function getDocumentOptions() {
  return ApiService.getList<Master.Employee.DocumentOptionsItem>(
    DOCUMENT_OPTION_URL
  );
}

export async function getDocumentOption(id: number) {
  const { data } = await ApiService.get<Master.Employee.DocumentOptionsForm>(
    `${DOCUMENT_OPTION_URL}/${id}`
  );

  return data;
}

export async function createDocumentOption(
  form: Master.Employee.DocumentOptionsForm
) {
  const { error, data } =
    await ApiService.post<Master.Employee.DocumentOptionsForm>(
      DOCUMENT_OPTION_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateDocumentOption(
  id: number,
  form: Master.Employee.DocumentOptionsForm
): Promise<boolean> {
  const result = await ApiService.put(`${DOCUMENT_OPTION_URL}/${id}`, form);

  return !result.error;
}

export async function patchDocumentOptionStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${DOCUMENT_OPTION_URL}/${id}`, {
    isActive,
  });

  return !result.error;
}
