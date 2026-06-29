// ─── Seed Data — lifted from integrated_research_erp_system.tsx ───────────────

export const INITIAL_PROJECTS: ResearchManagement.Project[] = [
  {
    code: 'STU-GR-2026-001',
    title: 'Quantum Cryptography Keys for Secure Smart Cities',
    agency: 'Department of Science & Technology (DST)',
    type: 'Sponsored Research',
    category: 'Information Technology',
    approvedBudget: 4500000,
    disbursedFunds: 1500000,
    overheadPercentage: 15,
    piName: 'Dr. Neha Sharma',
    piMobile: '9876543220',
    piEmail: 'neha.sharma@stu.ac.in',
    durationMonths: 36,
    ethicsStatus: 'Approved',
    milestonesCount: 6,
    completedMilestones: 2,
    status: 'Active',
    synopsis:
      'Developing scalable post-quantum cryptographic primitives tailored for low-resource IoT nodes within smart city grids.',
  },
  {
    code: 'STU-GR-2026-002',
    title: 'Autonomous Agricultural Spraying Drones for Malwa Region',
    agency: 'Indian Council of Agricultural Research (ICAR)',
    type: 'Sponsored Research',
    category: 'Agricultural Engineering',
    approvedBudget: 1850000,
    disbursedFunds: 0,
    overheadPercentage: 10,
    piName: 'Dr. Rajesh Verma',
    piMobile: '8765432120',
    piEmail: 'rajesh.verma@stu.ac.in',
    durationMonths: 24,
    ethicsStatus: 'Pending',
    milestonesCount: 4,
    completedMilestones: 0,
    status: 'Pending Evaluation',
    synopsis:
      'Designing localized variable-rate agricultural drones to spray biological fertilizers, minimizing chemical runoff.',
  },
  {
    code: 'STU-GR-2026-003',
    title: 'Waste-to-Energy Biomass Micro-Reactor Design',
    agency: 'Science & Engineering Research Board (SERB)',
    type: 'Collaborative Grant',
    category: 'Biotechnology',
    approvedBudget: 3000000,
    disbursedFunds: 1000000,
    overheadPercentage: 12,
    piName: 'Dr. Amit Patel',
    piMobile: '7654321090',
    piEmail: 'amit.patel@stu.ac.in',
    durationMonths: 18,
    ethicsStatus: 'Approved',
    milestonesCount: 3,
    completedMilestones: 1,
    status: 'Under Revision',
    synopsis:
      'Optimizing fluidized bed micro-reactors for decentralized localized municipal solid waste conversion into bio-methane.',
  },
];

export const INITIAL_PROPOSALS: ResearchManagement.Proposal[] = [
  {
    id: 'PROP-2026-8812',
    enrollmentNo: 'STU-FAC-782',
    piName: 'Dr. Sandeep Kothari',
    department: 'Department of Electronics & Communication',
    mobile: '9425012345',
    email: 'sandeep.k@stu.ac.in',
    title: 'AI-Powered Early Fault Detection in Power Grids',
    durationMonths: '24',
    coInvestigators: 'Dr. Sunita Sen, Prof. H. S. Rawat',
    abstract:
      'Proposing real-time deep learning temporal models running edge-side on grid transformers to identify insulation leakages prior to arc faults.',
    totalRequestedFunds: 3800000,
    overheadProposed: '15',
    agency: 'Science & Engineering Research Board (SERB)',
    hasEthicsClearance: 'Yes',
    ethicsRefNo: 'STU-ETH-2026-04',
    plagiarismScore: 4,
    declaration: true,
    signature: 'Sandeep Kothari',
    status: 'Pending',
    adminRemarks: '',
    milestones: [
      {
        id: 1,
        title: 'Sensor Selection & Data Pipeline Integration',
        budgetPercent: 30,
        deliverables: 'Hardware list & ingestion test reports',
        ucSubmitted: 'No',
      },
      {
        id: 2,
        title: 'Edge Deployment & Model Quantization',
        budgetPercent: 40,
        deliverables: 'Quantized models running on STU-FPGA testbed',
        ucSubmitted: 'No',
      },
      {
        id: 3,
        title: 'Validation Testbed & Serology Reporting',
        budgetPercent: 30,
        deliverables: 'Final industrial report & transfer audit files',
        ucSubmitted: 'No',
      },
    ],
    ethicsDocs: 'ethics_clearance_sandeep.pdf',
    budgetDocs: 'budget_justification_serb.pdf',
  },
  {
    id: 'PROP-2026-0412',
    enrollmentNo: 'STU-FAC-102',
    piName: 'Dr. Preeti Deshmukh',
    department: 'Department of Civil Engineering',
    mobile: '9826078122',
    email: 'preeti.d@stu.ac.in',
    title: 'Seismic Retrofitting of Malwa Heritage Structures',
    durationMonths: '36',
    coInvestigators: 'None',
    abstract:
      'Developing non-invasive polymer matrix injections to secure century-old brick masonry against high-amplitude lateral tremors.',
    totalRequestedFunds: 2200000,
    overheadProposed: '12',
    agency: 'Department of Science & Technology (DST)',
    hasEthicsClearance: 'No',
    ethicsRefNo: 'None',
    plagiarismScore: 32,
    declaration: true,
    signature: 'Preeti Deshmukh',
    status: 'Sent Back',
    adminRemarks:
      'Plagiarism analysis flagged overlap of 32% with SERB-2024 publications. Revise and filter similarities.',
    milestones: [
      {
        id: 1,
        title: 'Rheology Testing of Lime Mortar Bindings',
        budgetPercent: 50,
        deliverables: 'Viscosity maps & curing velocity graphs',
        ucSubmitted: 'No',
      },
      {
        id: 2,
        title: 'Scaled Shake-Table Heritage Model Verification',
        budgetPercent: 50,
        deliverables: 'Accelerometer logs & video test captures',
        ucSubmitted: 'No',
      },
    ],
    ethicsDocs: 'Not Uploaded',
    budgetDocs: 'seismic_retro_costs.xlsx',
  },
];

export const INITIAL_DISBURSED_LOGS: ResearchManagement.DisbursedLog[] = [
  {
    code: 'STU-GR-2026-001',
    piName: 'Dr. Neha Sharma',
    agency: 'Department of Science & Technology (DST)',
    milestone: '1',
    amount: 1500000,
    date: 'June 2026',
  },
  {
    code: 'STU-GR-2026-003',
    piName: 'Dr. Amit Patel',
    agency: 'Science & Engineering Research Board (SERB)',
    milestone: '1',
    amount: 1000000,
    date: 'June 2026',
  },
];

// ─── Dropdown Options ──────────────────────────────────────────────────────────

export const DEPARTMENT_OPTIONS = [
  'Department of Electronics & Communication',
  'Department of Civil Engineering',
  'Department of Biotechnology',
  'Department of Computer Science & Engineering',
  'Department of Mechanical Engineering',
];

export const AGENCY_OPTIONS = [
  'Science & Engineering Research Board (SERB)',
  'Department of Science & Technology (DST)',
  'Indian Council of Agricultural Research (ICAR)',
  'Department of Biotechnology (DBT)',
];

export const CATEGORY_OPTIONS = [
  'Information Technology',
  'Agricultural Engineering',
  'Biotechnology',
  'Physics Science Core',
];

export const BLANK_PROPOSAL: ResearchManagement.ProposalForm = {
  id: '',
  enrollmentNo: '',
  piName: '',
  department: 'Department of Electronics & Communication',
  mobile: '',
  email: '',
  title: '',
  durationMonths: '24',
  coInvestigators: '',
  abstract: '',
  totalRequestedFunds: '',
  overheadProposed: '15',
  agency: 'Science & Engineering Research Board (SERB)',
  hasEthicsClearance: 'Yes',
  ethicsRefNo: '',
  declaration: false,
  signature: '',
  milestones: [
    {
      id: 1,
      title: 'Deliverable Stage 1',
      budgetPercent: 40,
      deliverables: 'Initial Prototype & Schematic Design',
      ucSubmitted: 'No',
    },
    {
      id: 2,
      title: 'Deliverable Stage 2',
      budgetPercent: 60,
      deliverables: 'Final Validation, Audited statement',
      ucSubmitted: 'No',
    },
  ],
  ethicsDocs: 'ethics_clearance_default.pdf',
  budgetDocs: 'budget_breakdown_final.xlsx',
};

export const BLANK_PROJECT_FORM: ResearchManagement.ProjectForm = {
  title: '',
  agency: '',
  category: 'Information Technology',
  duration: '24',
  totalBudget: '',
  piName: '',
  coPiName: '',
  coPiMobile: '',
};
