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
  const apiRoot = ApiService.getApiRoot();
  const response = await fetch(`${apiRoot}${BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.title || result.detail || 'OTP verification failed');
  }
  return result;
}

export async function getSessionInfo(token: string) {
  const apiRoot = ApiService.getApiRoot();
  const response = await fetch(`${apiRoot}${BASE_URL}/protected/session`, {
    headers: { 'X-Admission-Token': token },
  });
  if (!response.ok) throw new Error('Session expired');
  return response.json();
}

async function getWithToken<T>(token: string, path: string): Promise<T> {
  const apiRoot = ApiService.getApiRoot();
  const response = await fetch(`${apiRoot}${BASE_URL}/protected${path}`, {
    headers: { 'X-Admission-Token': token },
  });
  if (!response.ok) throw new Error('Session expired or request failed');
  return response.json();
}

async function postWithToken<T>(
  token: string,
  path: string,
  body: unknown
): Promise<T> {
  const apiRoot = ApiService.getApiRoot();
  const response = await fetch(`${apiRoot}${BASE_URL}/protected${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admission-Token': token },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.title || error.detail || 'Request failed');
  }
  const contentLength = response.headers.get('content-length');
  if (response.status === 204 || contentLength === '0') {
    return undefined as T;
  }
  return response.json();
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
