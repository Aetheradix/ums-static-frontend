import type {
  ApplicationFormData,
  CreateApplicationCommand,
  MasterLookups,
} from '../types';

export interface IStudentApplicationRepository {
  getLookups(): Promise<MasterLookups>;
  getDraft(): Promise<ApplicationFormData | null>;
  saveDraft(data: ApplicationFormData): Promise<void>;
  submitApplication(
    data: CreateApplicationCommand
  ): Promise<{ applicationId: number }>;
  uploadDocument(file: File): Promise<string | null>;
}
