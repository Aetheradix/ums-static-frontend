export interface SendOtpResponse {
  message?: string;
}

export interface VerifyOtpResponse {
  value?: string;
}

export interface SessionInfo {
  email: string;
}

export interface SubjectSelectionInfo {
  programmeId: number;
  programmeName: string;
  specialisationId: number;
  specialisationName: string;
}

export interface AdmissionFeeStatus {
  isFeePaid: boolean;
  hasSubjectsSelected: boolean;
  studentName: string;
  programmeName: string;
}

export interface SubjectDto {
  pssId: number;
  subjectCode: string;
  subjectName: string;
  categoryName: string;
  totalCredits: number;
  isSelected: boolean;
}

export interface SubmitSubjectSelectionRequest {
  email: string;
  semesterName: string;
  selectedPssIds: number[];
}
