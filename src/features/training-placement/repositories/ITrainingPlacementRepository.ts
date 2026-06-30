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

export interface ITrainingPlacementRepository {
  getSeasons(filter?: SeasonFilter): Promise<PlacementSeason[]>;
  getSeasonById(id: string): Promise<PlacementSeason | null>;
  saveSeason(data: PlacementSeasonInput): Promise<PlacementSeason>;

  getCompanies(filter?: CompanyFilter): Promise<Company[]>;
  getCompanyById(id: string): Promise<Company | null>;

  getCompanySeasons(companyId?: string): Promise<CompanySeason[]>;
  getOpportunities(filter?: OpportunityFilter): Promise<Opportunity[]>;
  getApplications(filter?: ApplicationFilter): Promise<Application[]>;

  updateHiringStatus(input: HiringStatusUpdate): Promise<void>;

  getAdminDashboardMetrics(): Promise<AdminDashboardMetrics>;
  getCompanyDashboardMetrics(
    companyId: string
  ): Promise<CompanyDashboardMetrics>;
  getDeptDashboardMetrics(ouId: string): Promise<DeptDashboardMetrics>;
  getSeasonReport(seasonId?: string): Promise<SeasonReportRow[]>;
}
