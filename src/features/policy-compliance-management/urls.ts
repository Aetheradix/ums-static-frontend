// ─── URL builder for the Policy & Compliance Management module ──────────────

export const POLICY_COMPLIANCE_BASE_URL = 'policy-compliance-management';

export const policyComplianceUrls = (base: string) => {
  const prefix = `${base}`;
  return {
    root: prefix,
    dashboard: `${prefix}/dashboard`,
    policies: `${prefix}/policies`,
    policyReview: `${prefix}/policy-review`,
    policyApproval: `${prefix}/policy-approval`,
    publishedPolicies: `${prefix}/published-policies`,
    acknowledgements: `${prefix}/acknowledgements`,
    complianceRequirements: `${prefix}/compliance-requirements`,
    complianceAssignments: `${prefix}/compliance-assignments`,
    complianceSubmissions: `${prefix}/compliance-submissions`,
    complianceVerification: `${prefix}/compliance-verification`,
    audits: `${prefix}/audits`,
    nonCompliance: `${prefix}/non-compliance`,
    correctiveActions: `${prefix}/corrective-actions`,
    reports: `${prefix}/reports`,
  };
};
