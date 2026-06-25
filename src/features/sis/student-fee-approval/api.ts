import { ApiService } from 'services';
import type { StudentApplication } from './types';

const BASE_URL = 'student/applications';

export async function getStudentApplication(id: number) {
  const result = await ApiService.get<StudentApplication>(`${BASE_URL}/${id}`);
  return result;
}

export async function approveStudentFee(id: number) {
  const result = await ApiService.patch(`${BASE_URL}/${id}/approve-payment`, {
    isFeePaid: true,
  });
  return result;
}
