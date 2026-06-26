import type { IStudentProfileRepository } from '../repositories/IStudentProfileRepository';
import type { StudentProfile } from '../types';

export class StudentProfileService {
  private repo: IStudentProfileRepository;

  constructor(repo: IStudentProfileRepository) {
    this.repo = repo;
  }

  async getProfile(): Promise<StudentProfile | null> {
    return this.repo.getProfile();
  }

  async saveProfile(profile: StudentProfile): Promise<void> {
    await this.repo.saveProfile(profile);
  }
}
