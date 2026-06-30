import { LocalStorageCacheService, type ICacheService } from 'services/cache';
import { StaticStudentApplicationRepository } from 'features/admissions-management/student/application-form/repositories/StaticStudentApplicationRepository';
import { StudentApplicationService } from 'features/admissions-management/student/application-form/services/StudentApplicationService';
import { StaticStudentProfileRepository } from 'features/student-management/student/profile/repositories/StaticStudentProfileRepository';
import { StudentProfileService } from 'features/student-management/student/profile/services/StudentProfileService';
import { StaticTrainingPlacementRepository } from 'features/training-placement/repositories/StaticTrainingPlacementRepository';
import { TrainingPlacementService } from 'features/training-placement/services/TrainingPlacementService';

let cacheService: ICacheService | null = null;
let studentAppService: StudentApplicationService | null = null;
let studentProfileService: StudentProfileService | null = null;
let trainingPlacementService: TrainingPlacementService | null = null;

export function getCacheService(): ICacheService {
  if (!cacheService) {
    cacheService = new LocalStorageCacheService();
  }
  return cacheService;
}

export function getStudentApplicationService(): StudentApplicationService {
  if (!studentAppService) {
    const cache = getCacheService();
    const repo = new StaticStudentApplicationRepository(cache);
    studentAppService = new StudentApplicationService(repo);
  }
  return studentAppService;
}

export function getStudentProfileService(): StudentProfileService {
  if (!studentProfileService) {
    const cache = getCacheService();
    const repo = new StaticStudentProfileRepository(cache);
    studentProfileService = new StudentProfileService(repo);
  }
  return studentProfileService;
}

export function getTrainingPlacementService(): TrainingPlacementService {
  if (!trainingPlacementService) {
    const cache = getCacheService();
    const repo = new StaticTrainingPlacementRepository(cache);
    trainingPlacementService = new TrainingPlacementService(repo);
  }
  return trainingPlacementService;
}

export function resetServices(): void {
  cacheService = null;
  studentAppService = null;
  studentProfileService = null;
  trainingPlacementService = null;
}
