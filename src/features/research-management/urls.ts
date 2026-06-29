// ─── URL builder for the Research Management module ───────────────────────────

export const RESEARCH_MANAGEMENT_BASE_URL = 'research-management';

export const researchManagementUrls = (base: string) => {
  const prefix = `${base}`;
  return {
    root: prefix,
    dashboard: `${prefix}/dashboard`,
    projectRegistry: `${prefix}/project-registry`,
    proposalWizard: `${prefix}/proposal-wizard`,
    adminReview: `${prefix}/admin-review`,
    ledgerDisbursement: `${prefix}/ledger-disbursement`,
  };
};
