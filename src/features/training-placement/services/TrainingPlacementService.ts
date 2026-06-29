import type { ITrainingPlacementRepository } from '../repositories/ITrainingPlacementRepository';
import type {
  AdminDashboardMetrics,
  CompanyDashboardMetrics,
  DeptDashboardMetrics,
  Application,
  ApplicationFilter,
  Company,
  CompanyFilter,
  CompanySeason,
  HiringStatusUpdate,
  Opportunity,
  OpportunityFilter,
  PlacementSeason,
  PlacementSeasonInput,
  SeasonFilter,
  SeasonReportRow,
} from '../types';

export class TrainingPlacementService {
  private repo: ITrainingPlacementRepository;

  constructor(repo: ITrainingPlacementRepository) {
    this.repo = repo;
  }

  getSeasons(filter?: SeasonFilter): Promise<PlacementSeason[]> {
    return this.repo.getSeasons(filter);
  }

  getSeasonById(id: string): Promise<PlacementSeason | null> {
    return this.repo.getSeasonById(id);
  }

  saveSeason(data: PlacementSeasonInput): Promise<PlacementSeason> {
    return this.repo.saveSeason(data);
  }

  getCompanies(filter?: CompanyFilter): Promise<Company[]> {
    return this.repo.getCompanies(filter);
  }

  getCompanyById(id: string): Promise<Company | null> {
    return this.repo.getCompanyById(id);
  }

  getCompanySeasons(companyId?: string): Promise<CompanySeason[]> {
    return this.repo.getCompanySeasons(companyId);
  }

  getOpportunities(filter?: OpportunityFilter): Promise<Opportunity[]> {
    return this.repo.getOpportunities(filter);
  }

  getApplications(filter?: ApplicationFilter): Promise<Application[]> {
    return this.repo.getApplications(filter);
  }

  updateHiringStatus(input: HiringStatusUpdate): Promise<void> {
    return this.repo.updateHiringStatus(input);
  }

  getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
    return this.repo.getAdminDashboardMetrics();
  }

  getCompanyDashboardMetrics(
    companyId: string
  ): Promise<CompanyDashboardMetrics> {
    return this.repo.getCompanyDashboardMetrics(companyId);
  }

  getDeptDashboardMetrics(ouId: string): Promise<DeptDashboardMetrics> {
    return this.repo.getDeptDashboardMetrics(ouId);
  }

  getSeasonReport(seasonId?: string): Promise<SeasonReportRow[]> {
    return this.repo.getSeasonReport(seasonId);
  }
}
