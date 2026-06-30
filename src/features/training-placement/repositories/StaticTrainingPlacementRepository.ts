import type { ICacheService } from 'services/cache';
import { CacheKeys } from 'services/cache/CacheKeys';
import { getInitialSeedData, type TpSeedData } from '../seed';
import type { ITrainingPlacementRepository } from './ITrainingPlacementRepository';
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

const SIMULATED_DELAY = 350;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class StaticTrainingPlacementRepository implements ITrainingPlacementRepository {
  private cache: ICacheService;
  private data: TpSeedData;

  constructor(cache: ICacheService) {
    this.cache = cache;
    const cached = this.cache.get<TpSeedData>(CacheKeys.TP_SEED_DATA);
    this.data = cached ?? getInitialSeedData();
    if (!cached) {
      this.cache.set(CacheKeys.TP_SEED_DATA, this.data);
    }
  }

  private persist(): void {
    this.cache.set(CacheKeys.TP_SEED_DATA, this.data);
  }

  async getSeasons(filter?: SeasonFilter): Promise<PlacementSeason[]> {
    await delay(SIMULATED_DELAY);
    let rows = [...this.data.seasons];
    if (filter?.status) {
      rows = rows.filter(s => s.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      rows = rows.filter(
        s =>
          s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
    }
    return rows.sort((a, b) => a.code.localeCompare(b.code));
  }

  async getSeasonById(id: string): Promise<PlacementSeason | null> {
    await delay(SIMULATED_DELAY);
    return this.data.seasons.find(s => s.id === id) ?? null;
  }

  async saveSeason(data: PlacementSeasonInput): Promise<PlacementSeason> {
    await delay(SIMULATED_DELAY);

    if (data.id) {
      const idx = this.data.seasons.findIndex(s => s.id === data.id);
      if (idx === -1) throw new Error('Season not found');
      const duplicate = this.data.seasons.find(
        s => s.code === data.code && s.id !== data.id
      );
      if (duplicate) throw new Error('Season code already exists');

      const updated: PlacementSeason = { ...data, id: data.id };
      this.data.seasons[idx] = updated;
      this.persist();
      return updated;
    }

    const duplicate = this.data.seasons.find(s => s.code === data.code);
    if (duplicate) throw new Error('Season code already exists');

    const created: PlacementSeason = {
      ...data,
      id: generateId('season'),
    };
    this.data.seasons.push(created);
    this.persist();
    return created;
  }

  async getCompanies(filter?: CompanyFilter): Promise<Company[]> {
    await delay(SIMULATED_DELAY);
    let rows = [...this.data.companies];
    if (filter?.verificationStatus) {
      rows = rows.filter(
        c => c.verificationStatus === filter.verificationStatus
      );
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      rows = rows.filter(
        c =>
          c.companyName.toLowerCase().includes(q) ||
          c.hrEmail.toLowerCase().includes(q)
      );
    }
    return rows;
  }

  async getCompanyById(id: string): Promise<Company | null> {
    await delay(SIMULATED_DELAY);
    return this.data.companies.find(c => c.id === id) ?? null;
  }

  async getCompanySeasons(companyId?: string): Promise<CompanySeason[]> {
    await delay(SIMULATED_DELAY);
    if (!companyId) return [...this.data.companySeasons];
    return this.data.companySeasons.filter(cs => cs.companyId === companyId);
  }

  async getOpportunities(filter?: OpportunityFilter): Promise<Opportunity[]> {
    await delay(SIMULATED_DELAY);
    let rows = [...this.data.opportunities];
    if (filter?.seasonId) {
      rows = rows.filter(o => o.seasonId === filter.seasonId);
    }
    if (filter?.companyId) {
      rows = rows.filter(o => o.companyId === filter.companyId);
    }
    if (filter?.status) {
      rows = rows.filter(o => o.status === filter.status);
    }
    if (filter?.opportunityType) {
      rows = rows.filter(o => o.opportunityType === filter.opportunityType);
    }
    if (filter?.studentVisibleOnly) {
      rows = rows.filter(o => o.showPost && o.status === 'Active');
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      rows = rows.filter(o => o.title.toLowerCase().includes(q));
    }
    return rows;
  }

  async getApplications(filter?: ApplicationFilter): Promise<Application[]> {
    await delay(SIMULATED_DELAY);
    let rows = [...this.data.applications];

    if (filter?.seasonId) {
      rows = rows.filter(a => a.seasonId === filter.seasonId);
    }
    if (filter?.companyId) {
      rows = rows.filter(a => a.companyId === filter.companyId);
    }
    if (filter?.opportunityId) {
      rows = rows.filter(a => a.opportunityId === filter.opportunityId);
    }
    if (filter?.hiringStatus) {
      rows = rows.filter(a => a.hiringStatus === filter.hiringStatus);
    }
    if (filter?.ouId) {
      const studentIds = this.data.students
        .filter(s => s.ouId === filter.ouId)
        .map(s => s.id);
      rows = rows.filter(a => studentIds.includes(a.studentId));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      rows = rows.filter(a => {
        const student = this.data.students.find(s => s.id === a.studentId);
        const opp = this.data.opportunities.find(o => o.id === a.opportunityId);
        return (
          student?.name.toLowerCase().includes(q) ||
          student?.rollNumber.toLowerCase().includes(q) ||
          opp?.title.toLowerCase().includes(q)
        );
      });
    }
    return rows.sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
  }

  async updateHiringStatus(input: HiringStatusUpdate): Promise<void> {
    await delay(200);
    for (const appId of input.applicationIds) {
      const idx = this.data.applications.findIndex(a => a.id === appId);
      if (idx !== -1) {
        this.data.applications[idx] = {
          ...this.data.applications[idx],
          hiringStatus: input.hiringStatus,
        };
      }
    }
    this.persist();
  }

  async getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
    await delay(SIMULATED_DELAY);

    const activeSeasons = this.data.seasons.filter(s => s.status === 'Active');
    const pendingVerifications = this.data.companies.filter(
      c => c.verificationStatus === 'Pending'
    ).length;
    const selectedStudents = this.data.applications.filter(
      a => a.hiringStatus === 'Selected'
    ).length;

    const applicantsBySeason = this.data.seasons.map(season => ({
      seasonCode: season.code,
      count: this.data.applications.filter(a => a.seasonId === season.id)
        .length,
    }));

    return {
      totalCompanies: this.data.companies.filter(
        c => c.verificationStatus === 'Approved'
      ).length,
      totalApplicants: this.data.applications.length,
      totalJobPosts: this.data.opportunities.filter(o => o.status === 'Active')
        .length,
      activeSeasons: activeSeasons.length,
      pendingVerifications,
      selectedStudents,
      applicantsBySeason,
      monthlyTrend: [
        { month: 'Jan', count: 12 },
        { month: 'Feb', count: 18 },
        { month: 'Mar', count: 24 },
        { month: 'Apr', count: 31 },
        { month: 'May', count: 28 },
        { month: 'Jun', count: 42 },
      ],
      companyDistribution: [
        { sector: 'IT Services', count: 45 },
        { sector: 'Product / SaaS', count: 25 },
        { sector: 'Consulting', count: 15 },
        { sector: 'Core Engineering', count: 10 },
        { sector: 'Finance', count: 5 },
      ],
      hiringFunnel: [
        { stage: 'Applied', count: 500 },
        { stage: 'Shortlisted', count: 300 },
        { stage: 'Written Test', count: 250 },
        { stage: 'Interview', count: 120 },
        { stage: 'Selected', count: 45 },
      ],
      seasonProgress: [
        { seasonCode: 'PL2023-24', completed: 85, total: 100 },
        { seasonCode: 'INT-SUMMER-24', completed: 40, total: 100 },
      ],
    };
  }

  async getCompanyDashboardMetrics(
    companyId: string
  ): Promise<CompanyDashboardMetrics> {
    await delay(SIMULATED_DELAY);
    const companyOpps = this.data.opportunities.filter(
      o => o.companyId === companyId
    );
    const activeJobPosts = companyOpps.filter(
      o => o.status === 'Active'
    ).length;
    const draftJobPosts = companyOpps.filter(
      o => o.status === 'Inactive'
    ).length;

    const companyApps = this.data.applications.filter(
      a => a.companyId === companyId
    );

    // get unique active seasons this company is part of (from opportunities or companySeasons)
    const activeSeasons = new Set(
      this.data.companySeasons
        .filter(cs => cs.companyId === companyId)
        .map(cs => cs.seasonId)
    ).size;

    const applicantsByJob = companyOpps
      .map(opp => ({
        jobTitle: opp.title,
        count: this.data.applications.filter(a => a.opportunityId === opp.id)
          .length,
      }))
      .filter(x => x.count > 0);

    return {
      totalApplicants: companyApps.length,
      activeJobPosts,
      draftJobPosts,
      activeSeasons,
      applicantsByJob,
    };
  }

  async getDeptDashboardMetrics(ouId: string): Promise<DeptDashboardMetrics> {
    await delay(SIMULATED_DELAY);

    // Total students mapped to this OU
    const deptStudents = this.data.students.filter(s => s.ouId === ouId);
    const totalStudents = deptStudents.length;

    // Placed and unplaced
    const deptStudentIds = new Set(deptStudents.map(s => s.id));
    const deptApps = this.data.applications.filter(a =>
      deptStudentIds.has(a.studentId)
    );
    // Unique students placed
    const placedStudentIds = new Set(
      deptApps.filter(a => a.hiringStatus === 'Selected').map(a => a.studentId)
    );
    const studentsPlaced = placedStudentIds.size;
    const studentsUnplaced = totalStudents - studentsPlaced;

    // Active opportunities (assuming all active are relevant, or filter by programme)
    const activeOpportunities = this.data.opportunities.filter(
      o => o.status === 'Active'
    ).length;

    const placementByProgramme = Array.from(
      new Set(deptStudents.map(s => s.programmeId))
    ).map(prog => {
      const progStudents = deptStudents.filter(s => s.programmeId === prog);
      const placed = progStudents.filter(s =>
        placedStudentIds.has(s.id)
      ).length;
      return {
        programme: prog,
        placed,
        total: progStudents.length,
      };
    });

    return {
      totalStudents,
      studentsPlaced,
      studentsUnplaced,
      activeOpportunities,
      placementByProgramme,
    };
  }

  async getSeasonReport(seasonId?: string): Promise<SeasonReportRow[]> {
    await delay(SIMULATED_DELAY);
    const seasons = seasonId
      ? this.data.seasons.filter(s => s.id === seasonId)
      : this.data.seasons;

    return seasons.map(season => {
      const companyIds = new Set(
        this.data.companySeasons
          .filter(cs => cs.seasonId === season.id)
          .map(cs => cs.companyId)
      );
      const applicantCount = this.data.applications.filter(
        a => a.seasonId === season.id
      ).length;

      return {
        seasonCode: season.code,
        seasonName: season.name,
        companyCount: companyIds.size,
        applicantCount,
      };
    });
  }
}
