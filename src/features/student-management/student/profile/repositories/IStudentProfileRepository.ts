import type { StudentProfile } from '../types';

export interface IStudentProfileRepository {
  getProfile(): Promise<StudentProfile | null>;
  saveProfile(profile: StudentProfile): Promise<void>;
}
