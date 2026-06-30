declare namespace ResearchManagement {
  // ─── Project ──────────────────────────────────────────────────────────────

  interface Project {
    code: string;
    title: string;
    agency: string;
    type: string;
    category: string;
    approvedBudget: number;
    disbursedFunds: number;
    overheadPercentage: number;
    piName: string;
    piMobile: string;
    piEmail: string;
    durationMonths: number;
    ethicsStatus: 'Approved' | 'Pending' | 'Expired';
    milestonesCount: number;
    completedMilestones: number;
    status: string;
    synopsis: string;
  }

  // ─── Milestone ────────────────────────────────────────────────────────────

  interface Milestone {
    id: number;
    title: string;
    budgetPercent: number;
    deliverables: string;
    ucSubmitted: 'Yes' | 'No';
  }

  // ─── Proposal ─────────────────────────────────────────────────────────────

  interface Proposal {
    id: string;
    enrollmentNo: string;
    piName: string;
    department: string;
    mobile: string;
    email: string;
    title: string;
    durationMonths: string;
    coInvestigators: string;
    abstract: string;
    totalRequestedFunds: number;
    overheadProposed: string;
    agency: string;
    hasEthicsClearance: 'Yes' | 'No';
    ethicsRefNo: string;
    plagiarismScore: number;
    declaration: boolean;
    signature: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Sent Back';
    adminRemarks: string;
    milestones: Milestone[];
    ethicsDocs: string;
    budgetDocs: string;
  }

  // ─── Proposal Form (for wizard, allows string funds) ─────────────────────

  interface ProposalForm {
    id: string;
    enrollmentNo: string;
    piName: string;
    department: string;
    mobile: string;
    email: string;
    title: string;
    durationMonths: string;
    coInvestigators: string;
    abstract: string;
    totalRequestedFunds: string | number;
    overheadProposed: string;
    agency: string;
    hasEthicsClearance: 'Yes' | 'No';
    ethicsRefNo: string;
    declaration: boolean;
    signature: string;
    milestones: Milestone[];
    ethicsDocs: string;
    budgetDocs: string;
  }

  // ─── Project Form ─────────────────────────────────────────────────────────

  interface ProjectForm {
    title: string;
    agency: string;
    category: string;
    duration: string;
    totalBudget: string;
    piName: string;
    coPiName: string;
    coPiMobile: string;
  }

  // ─── Disbursement Log ─────────────────────────────────────────────────────

  interface DisbursedLog {
    code: string;
    piName: string;
    agency: string;
    milestone: string;
    amount: number;
    date: string;
  }

  // ─── Notification ─────────────────────────────────────────────────────────

  interface Notification {
    message: string;
    type: 'success' | 'error';
  }
}
