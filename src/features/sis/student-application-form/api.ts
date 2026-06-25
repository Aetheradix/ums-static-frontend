import { ApiService } from 'services';
import type { CreateApplicationCommand } from './types';
import { STUDENT_APPLICATION_URL } from './urls';

export async function createApplication(form: CreateApplicationCommand) {
  const { error, data } = await ApiService.post<{ value: number }>(
    STUDENT_APPLICATION_URL,
    form
  );

  return !error ? data : undefined;
}

export async function uploadPriorEducationDocument(
  file: File
): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);

  const { error, data } = await ApiService.postFormData<string>(
    `${STUDENT_APPLICATION_URL}/upload-prior-education-documents`,
    formData
  );

  if (!error && data) {
    return data;
  }
  return null;
}
