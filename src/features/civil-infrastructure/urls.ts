const BASE = '/civil-infrastructure';

export const civilUrls = {
  // Portals
  adminPortal:    `${BASE}/admin`,
  engineerPortal: `${BASE}/engineer`,
  financePortal:  `${BASE}/finance`,

  // Admin Pages
  adminDashboard:          `${BASE}/admin/dashboard`,
  workRegistration:        `${BASE}/admin/work-registration`,
  workCategorization:      `${BASE}/admin/work-categorization`,
  adminApproval:           `${BASE}/admin/admin-approval`,
  technicalSanction:       `${BASE}/admin/technical-sanction`,
  budgetLock:              `${BASE}/admin/budget-lock`,
  tenderOversight:         `${BASE}/admin/tender-oversight`,
  agencyVerification:      `${BASE}/admin/agency-verification`,
  workOrderSign:           `${BASE}/admin/work-order-sign`,
  adminEotRequest:         `${BASE}/admin/eot-requests`,
  completionCertificate:   `${BASE}/admin/completion-certificate`,
  adminReports:            `${BASE}/admin/reports`,
  adminSORMaster:          `${BASE}/admin/sor-master`,
  adminBOQCompilation:     `${BASE}/admin/boq-compilation`,
  adminMilestones:         `${BASE}/admin/milestones`,

  // Engineer Pages
  engineerDashboard:       `${BASE}/engineer/dashboard`,
  technicalPlanning:       `${BASE}/engineer/technical-planning`,
  sorMaster:               `${BASE}/engineer/sor-master`,
  boqCompilation:          `${BASE}/engineer/boq-compilation`,
  executionRouter:         `${BASE}/engineer/execution-router`,
  qualityFramework:        `${BASE}/engineer/quality-framework`,
  progressMonitoring:      `${BASE}/engineer/progress-monitoring`,
  qualityTesting:          `${BASE}/engineer/quality-testing`,
  eMeasurementBook:        `${BASE}/engineer/e-measurement-book`,
  eotRequest:              `${BASE}/engineer/eot-request`,
  milestoneSignoff:        `${BASE}/engineer/milestone-signoff`,

  // Finance Pages
  financeDashboard:        `${BASE}/finance/dashboard`,
  budgetAllocation:        `${BASE}/finance/budget-allocation`,
  raBillProcessing:        `${BASE}/finance/ra-bill-processing`,
  finalBillSettlement:     `${BASE}/finance/final-bill-settlement`,
  paymentRelease:          `${BASE}/finance/payment-release`,
  dlpMonitoring:           `${BASE}/finance/dlp-monitoring`,
};
