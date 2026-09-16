const BASE = '/civil-infrastructure';

export const civilUrls = {
  // Sub-Menus
  civilMenu: '/home/sub-menu/civil-infrastructure',
  adminMenu: '/home/sub-menu/civil-admin',
  engineerMenu: '/home/sub-menu/civil-engineer',
  financeMenu: '/home/sub-menu/civil-finance',
  externalMastersMenu: '/home/sub-menu/civil-external-masters',

  // Portals (Direct Dashboards)
  adminPortal: `${BASE}/admin/dashboard`,
  engineerPortal: `${BASE}/engineer/dashboard`,
  financePortal: `${BASE}/finance/dashboard`,

  // Admin Pages
  adminDashboard: `${BASE}/admin/dashboard`,
  workRegistration: `${BASE}/admin/work-registration`,
  workCategorization: `${BASE}/admin/work-categorization`,
  adminApproval: `${BASE}/admin/admin-approval`,
  technicalSanction: `${BASE}/admin/technical-sanction`,
  budgetLock: `${BASE}/admin/budget-lock`,
  tenderOversight: `${BASE}/admin/tender-oversight`,
  agencyVerification: `${BASE}/admin/agency-verification`,
  workOrderSign: `${BASE}/admin/work-order-sign`,
  workManpowerMapping: `${BASE}/admin/work-manpower-mapping`,
  adminEotRequest: `${BASE}/admin/eot-requests`,
  completionCertificate: `${BASE}/admin/completion-certificate`,
  adminReports: `${BASE}/admin/reports`,
  adminSORMaster: `${BASE}/admin/sor-master`,
  adminBOQCompilation: `${BASE}/admin/boq-compilation`,
  adminMilestones: `${BASE}/admin/milestones`,
  milestoneApprovals: `${BASE}/admin/milestone-approvals`,

  // Admin Gap-Fill & Indian Workflow Pages
  annualWorkPlan: `${BASE}/admin/annual-work-plan`,
  statutoryCompliance: `${BASE}/admin/statutory-compliance`,
  labourCompliance: `${BASE}/admin/labour-compliance`,
  deviationApproval: `${BASE}/admin/deviation-approval`,
  tpiReports: `${BASE}/admin/tpi-reports`,
  assetRegister: `${BASE}/admin/asset-register`,

  // Admin Masters
  sorType: `${BASE}/admin/masters/sor-type`,
  sorChapter: `${BASE}/admin/masters/sor-chapter`,
  sorSubject: `${BASE}/admin/masters/sor-subject`,
  sorItemMaster: `${BASE}/admin/masters/sor-items`,
  projectMaster: `${BASE}/admin/masters/projects`,
  workCategoryMaster: `${BASE}/admin/masters/work-categories`,
  workDepartmentMaster: `${BASE}/admin/masters/work-departments`,
  fundingSourceMaster: `${BASE}/admin/masters/funding-sources`,
  mandateDocumentMaster: `${BASE}/admin/masters/mandate-documents`,
  qualityLabMaster: `${BASE}/admin/masters/quality-labs`,
  tpiAgencyMaster: `${BASE}/admin/masters/tpi-agencies`,
  mbStatusMaster: `${BASE}/admin/masters/mb-statuses`,
  statusMaster: `${BASE}/admin/masters/statuses`,

  // Engineer Pages
  engineerDashboard: `${BASE}/engineer/dashboard`,
  technicalPlanning: `${BASE}/engineer/technical-planning`,
  sorMaster: `${BASE}/engineer/sor-master`,
  boqCompilation: `${BASE}/engineer/boq-compilation`,
  executionRouter: `${BASE}/engineer/execution-router`,
  qualityFramework: `${BASE}/engineer/quality-framework`,
  progressMonitoring: `${BASE}/engineer/progress-monitoring`,
  qualityTesting: `${BASE}/engineer/quality-testing`,
  eMeasurementBook: `${BASE}/engineer/e-measurement-book`,
  eotRequest: `${BASE}/engineer/eot-request`,
  milestoneSignoff: `${BASE}/engineer/milestone-signoff`,
  requestCC: `${BASE}/engineer/request-cc`,
  mbReport: `${BASE}/engineer/mb-report`,
  siteHandover: `${BASE}/engineer/site-handover`,
  deviationStatement: `${BASE}/engineer/deviation-statement`,

  // Finance Pages
  financeDashboard: `${BASE}/finance/dashboard`,
  budgetAllocation: `${BASE}/finance/budget-allocation`,
  raBillProcessing: `${BASE}/finance/ra-bill-processing`,
  finalBillSettlement: `${BASE}/finance/final-bill-settlement`,
  paymentRelease: `${BASE}/finance/payment-release`,
  dlpMonitoring: `${BASE}/finance/dlp-monitoring`,
  utilizationCertificate: `${BASE}/finance/utilization-certificate`,
  pvcCalculation: `${BASE}/finance/pvc-calculation`,
};
