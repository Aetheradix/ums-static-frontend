import { CacheKeys } from 'services/cache/CacheKeys';
import type { ICacheService } from 'services/cache/ICacheService';
import { sampleStudentProfile } from '../seed/sample-profile';
import type { StudentProfile } from '../types';
import type { IStudentProfileRepository } from './IStudentProfileRepository';

const SIMULATED_DELAY = 400;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class StaticStudentProfileRepository implements IStudentProfileRepository {
  private cache: ICacheService;

  constructor(cache: ICacheService) {
    this.cache = cache;
  }

  async getProfile(): Promise<StudentProfile | null> {
    await delay(SIMULATED_DELAY);
    const cached = this.cache.get<StudentProfile>(CacheKeys.STUDENT_PROFILE);
    if (cached) return cached;
    return sampleStudentProfile;
  }

  async saveProfile(profile: StudentProfile): Promise<void> {
    await delay(200);
    this.cache.set(CacheKeys.STUDENT_PROFILE, profile);
  }
}
