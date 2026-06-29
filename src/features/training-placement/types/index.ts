export type PlacementSeasonStatus = 'Active' | 'Inactive';

export type CompanyVerificationStatus = 'Pending' | 'Approved' | 'Rejected';

export type CompanySeasonStatus = 'Saved' | 'Applied';

export type PaymentStatus = 'Not Applicable' | 'Pending' | 'Paid' | 'Failed';

export type OpportunityType = 'Internship' | 'Placement';

export type OpportunityNature = 'Full time' | 'Part-Time';

export type ProcessType = 'On-Campus' | 'Off-Campus';

export type OpportunityStatus = 'Draft' | 'Active' | 'Closed' | 'Inactive';

export type HiringStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Written Test Scheduled'
  | 'GD Scheduled'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected'
  | 'On Hold'
  | 'Withdrawn';

export interface OrganizationalUnit {
  id: string;
  code: string;
  name: string;
}

export interface PlacementSeason {
  id: string;
  code: string;
  name: string;
  feeApplicableCompany: boolean;
  companyFeeAmount: number;
  feeApplicableStudent: boolean;
  studentFeeAmount: number;
  status: PlacementSeasonStatus;
  academicYear: string;
}

export type PlacementSeasonInput = Omit<PlacementSeason, 'id'> & {
  id?: string;
};

export interface OuMapping {
  id: string;
  administeringOuId: string;
  administeredOuIds: string[];
  remarks?: string;
}

export interface Company {
  id: string;
  companyName: string;
  companyDetails: string;
  headOffice: string;
  website?: string;
  hrName: string;
  hrContact: string;
  hrEmail: string;
  verificationStatus: CompanyVerificationStatus;
  profileComplete: boolean;
  createdAt: string;
}

export type CompanyInput = Omit<
  Company,
  'id' | 'verificationStatus' | 'profileComplete' | 'createdAt'
> & { id?: string };

export interface CompanySeason {
  id: string;
  companyId: string;
  seasonId: string;
  feeAmount: number;
  paymentStatus: PaymentStatus;
  status: CompanySeasonStatus;
}

export interface Opportunity {
  id: string;
  companyId: string;
  title: string;
  opportunityType: OpportunityType;
  description: string;
  seasonId: string;
  designation: string;
  opportunityNature: OpportunityNature;
  processType: ProcessType;
  essentialQualification: string[];
  eligibility: string;
  skillSet: string[];
  experience: string;
  ctc: string;
  ctcBreakup?: string;
  location: string;
  venue?: string;
  vacancies: number;
  openingDate: string;
  closingDate: string;
  writtenTest: boolean;
  interview: boolean;
  groupDiscussion: boolean;
  selectionCriteria: string;
  showPost: boolean;
  status: OpportunityStatus;
  applicantCount: number;
  publishedAt?: string;
}

export interface TpStudent {
  id: string;
  name: string;
  rollNumber: string;
  programmeId: string;
  programmeName: string;
  ouId: string;
  batch: string;
  gender: string;
  category: string;
  email: string;
  registered: boolean;
}

export interface Application {
  id: string;
  studentId: string;
  opportunityId: string;
  companyId: string;
  seasonId: string;
  appliedAt: string;
  hiringStatus: HiringStatus;
}

export interface SeasonFilter {
  status?: PlacementSeasonStatus;
  search?: string;
}

export interface CompanyFilter {
  verificationStatus?: CompanyVerificationStatus;
  search?: string;
}

export interface OpportunityFilter {
  seasonId?: string;
  companyId?: string;
  status?: OpportunityStatus;
  opportunityType?: OpportunityType;
  search?: string;
  studentVisibleOnly?: boolean;
}

export interface ApplicationFilter {
  seasonId?: string;
  companyId?: string;
  opportunityId?: string;
  ouId?: string;
  hiringStatus?: HiringStatus;
  search?: string;
}

export interface AdminDashboardMetrics {
  totalCompanies: number;
  totalApplicants: number;
  totalJobPosts: number;
  activeSeasons: number;
  pendingVerifications: number;
  selectedStudents: number;
  applicantsBySeason: { seasonCode: string; count: number }[];
  monthlyTrend: { month: string; count: number }[];
  companyDistribution: { sector: string; count: number }[];
  hiringFunnel: { stage: string; count: number }[];
  seasonProgress: { seasonCode: string; completed: number; total: number }[];
}

export interface CompanyDashboardMetrics {
  totalApplicants: number;
  activeJobPosts: number;
  draftJobPosts: number;
  activeSeasons: number;
  applicantsByJob: { jobTitle: string; count: number }[];
}

export interface DeptDashboardMetrics {
  totalStudents: number;
  studentsPlaced: number;
  studentsUnplaced: number;
  activeOpportunities: number;
  placementByProgramme: { programme: string; placed: number; total: number }[];
}

export interface HiringStatusUpdate {
  applicationIds: string[];
  hiringStatus: HiringStatus;
  remarks?: string;
}

export interface SeasonReportRow {
  seasonCode: string;
  seasonName: string;
  companyCount: number;
  applicantCount: number;
}
