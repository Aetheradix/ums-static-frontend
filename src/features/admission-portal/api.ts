import { ApiService } from 'services';
import type {
  SubjectSelectionInfo,
  SubjectDto,
  SubmitSubjectSelectionRequest,
  AdmissionFeeStatus,
} from './types';

const BASE_URL = 'admission';

export async function sendOtp(email: string) {
  return ApiService.post(`${BASE_URL}/send-otp`, { email });
}

export async function verifyOtp(email: string, otp: string) {
  const result = await ApiService.post<any>(`${BASE_URL}/verify-otp`, {
    email,
    otp,
  });
  if (result.error) {
    throw new Error('OTP verification failed');
  }
  return result.data;
}

export async function getSessionInfo(_token: string) {
  const res = await ApiService.get<any>(`${BASE_URL}/protected/session`);
  if (res.error) throw new Error('Session expired');
  return res.data;
}

async function getWithToken<T>(_token: string, path: string): Promise<T> {
  const res = await ApiService.get<T>(`${BASE_URL}/protected${path}`);
  if (res.error) throw new Error('Session expired or request failed');
  return res.data as T;
}

async function postWithToken<T>(
  _token: string,
  path: string,
  body: unknown
): Promise<T> {
  const res = await ApiService.post<T>(`${BASE_URL}/protected${path}`, body);
  if (res.error) throw new Error('Request failed');
  return res.data as T;
}

export async function getSubjectSelectionInfo(token: string) {
  return getWithToken<SubjectSelectionInfo>(token, '/subject-selection/info');
}

export async function getSubjectsBySemester(
  token: string,
  semesterName: string
) {
  return getWithToken<SubjectDto[]>(
    token,
    `/subject-selection/subjects?semester=${encodeURIComponent(semesterName)}`
  );
}

export async function submitSubjectSelection(
  token: string,
  data: SubmitSubjectSelectionRequest
) {
  return postWithToken<void>(token, '/subject-selection/submit', data);
}

export async function getAdmissionFeeStatus(token: string) {
  return getWithToken<AdmissionFeeStatus>(token, '/fee-payment/status');
}

export async function payAdmissionFee(token: string) {
  return postWithToken<void>(token, '/fee-payment/pay', {});
}
