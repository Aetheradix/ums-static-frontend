import { getAllLookups } from '../seed';
import type {
  ApplicationFormData,
  CreateApplicationCommand,
  MasterLookups,
} from '../types';
import type { IStudentApplicationRepository } from './IStudentApplicationRepository';
import type { ICacheService } from 'services/cache/ICacheService';
import { CacheKeys } from 'services/cache/CacheKeys';

const SIMULATED_DELAY = 400;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let applicationIdCounter = 1000;

export class StaticStudentApplicationRepository implements IStudentApplicationRepository {
  private lookups: MasterLookups | null = null;
  private cache: ICacheService;

  constructor(cache: ICacheService) {
    this.cache = cache;
  }

  async getLookups(): Promise<MasterLookups> {
    if (this.lookups) return this.lookups;
    await delay(SIMULATED_DELAY);
    this.lookups = getAllLookups();
    return this.lookups!;
  }

  async getDraft(): Promise<ApplicationFormData | null> {
    await delay(SIMULATED_DELAY);
    const draft = this.cache.get<ApplicationFormData>(
      CacheKeys.STUDENT_APPLICATION_DRAFT
    );
    return draft ?? null;
  }

  async saveDraft(data: ApplicationFormData): Promise<void> {
    await delay(200);
    this.cache.set(CacheKeys.STUDENT_APPLICATION_DRAFT, data);
  }

  async submitApplication(
    data: CreateApplicationCommand
  ): Promise<{ applicationId: number }> {
    await delay(SIMULATED_DELAY);
    applicationIdCounter += 1;
    const applicationId = applicationIdCounter;

    const existing =
      this.cache.get<
        Array<{
          id: number;
          data: CreateApplicationCommand;
          submittedAt: string;
        }>
      >(CacheKeys.STUDENT_SUBMITTED_APPLICATIONS) ?? [];

    existing.push({
      id: applicationId,
      data,
      submittedAt: new Date().toISOString(),
    });

    this.cache.set(CacheKeys.STUDENT_SUBMITTED_APPLICATIONS, existing);
    this.cache.remove(CacheKeys.STUDENT_APPLICATION_DRAFT);

    return { applicationId };
  }

  async uploadDocument(file: File): Promise<string | null> {
    await delay(800);
    const mockId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    console.log('[StaticRepo] Simulated upload for', file.name, '->', mockId);
    return mockId;
  }
}
