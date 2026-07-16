export const NAV_LINKS = [
  { label: 'Home', href: '/octagon-cms' },
  { label: 'Solutions', href: '/octagon-cms/solutions' },
  { label: 'About', href: '/octagon-cms/about' },
  { label: 'Contact', href: '/octagon-cms/contact' },
] as const;

export const HERO_CONTENT = {
  badge: 'STQC Certified · NEP 2020 Compliant',
  headline: 'Complete Digital University Management Platform',
  sub: 'Empowering institutions with intelligent governance and automation.',
  cta1: 'Explore Solutions',
  cta2: 'Request a Demo',
};

export const PROBLEMS = [
  {
    icon: '📂',
    title: 'Manual File Tracking',
    desc: 'No digital workflow, everything on paper or email.',
  },
  {
    icon: '📊',
    title: 'Zero Real-Time Data',
    desc: 'Decisions made without live dashboards or reports.',
  },
  {
    icon: '⚖️',
    title: 'RTI & Legal Chaos',
    desc: 'Compliance and legal cases handled manually, no tracking.',
  },
  {
    icon: '🧩',
    title: 'Disconnected Systems',
    desc: '10 different tools for 10 different departments.',
  },
] as const;

export const SOLUTIONS = [
  {
    id: 'academics',
    icon: 'GraduationCap',
    title: 'Academics',
    color: 'blue',
    tagline: 'Admission to Graduation',
    desc: 'Complete lifecycle management for admissions, programmes, examinations, and alumni relations.',
    modules: [
      { name: 'Academic Management', icon: 'BookOpen' },
      { name: 'Admission Management', icon: 'Users' },
      { name: 'Alumni Management', icon: 'GraduationCap' },
      { name: 'Convocation Management', icon: 'Award' },
      { name: 'Evaluation & Grading', icon: 'PenTool' },
      { name: 'Evaluation & Grading (for evaluator)', icon: 'CheckCircle' },
      { name: 'Fee Configuration', icon: 'Wallet' },
      { name: 'Programme Management', icon: 'LayoutTemplate' },
      { name: 'Student Feedback Management', icon: 'MessageSquare' },
      { name: 'Thesis Management', icon: 'FileText' },
      { name: 'Training & Placement Management', icon: 'Briefcase' },
      { name: 'Student Portal', icon: 'Laptop' },
    ],
  },
  {
    id: 'accounts_finance',
    icon: 'Landmark',
    title: 'Accounts & Finance',
    color: 'emerald',
    tagline: 'End-to-End Control',
    desc: 'Powerful finance modules with multi-channel payments, inventory tracking, and project management.',
    modules: [
      { name: 'Bill Management & Tracking', icon: 'Receipt' },
      { name: 'Finance & Procurement Management', icon: 'Truck' },
      { name: 'Inventory Management', icon: 'Box' },
      { name: 'Research & Grants Management', icon: 'Microscope' },
    ],
  },
  {
    id: 'base_modules',
    icon: 'Settings',
    title: 'Base Modules',
    color: 'purple',
    tagline: 'Core Infrastructure',
    desc: 'Fundamental modules providing access control and core system capabilities.',
    modules: [
      { name: 'Core Modules', icon: 'Cpu' },
      { name: 'User Management', icon: 'UserCog' },
    ],
  },
  {
    id: 'employee_services',
    icon: 'Users',
    title: 'Employee Services',
    color: 'orange',
    tagline: 'People-First System',
    desc: 'Complete HR lifecycle from recruitment to retirement, payroll, and leave management.',
    modules: [
      { name: 'Career Advancement', icon: 'TrendingUp' },
      { name: 'Employee Management', icon: 'UsersRound' },
      { name: 'Leave Management', icon: 'CalendarDays' },
      { name: 'Payroll Management', icon: 'Banknote' },
      { name: 'Pension & Gratuity Management', icon: 'PiggyBank' },
      { name: 'Recruitment Management', icon: 'UserPlus' },
      { name: 'ToT Management', icon: 'Workflow' },
    ],
  },
  {
    id: 'governance',
    icon: 'Building2',
    title: 'Governance',
    color: 'indigo',
    tagline: 'Transparent Operations',
    desc: 'Comprehensive modules covering affiliation, legal cases, file workflow tracking, and facility management.',
    modules: [
      { name: 'Affiliation Management', icon: 'Network' },
      { name: 'Content Management & Federation', icon: 'Database' },
      { name: 'Networking & Communication Management', icon: 'Megaphone' },
      { name: 'Endowment Management', icon: 'Gift' },
      { name: 'Essential Services Management', icon: 'ShieldAlert' },
      { name: 'Estate Management', icon: 'Building' },
      { name: 'File Management & Tracking', icon: 'FolderTree' },
      { name: 'Fleet Management', icon: 'Bus' },
      { name: 'Grievance Management', icon: 'ThumbsDown' },
      { name: 'Health Services Management', icon: 'HeartPulse' },
      { name: 'Hostel Management', icon: 'Home' },
      { name: 'Legal Case Management', icon: 'Scale' },
      { name: 'Minutes & Resolutions Archive Retrieval', icon: 'Archive' },
      { name: 'Residential Allocation Management', icon: 'DoorOpen' },
      { name: 'RTI Management', icon: 'FileWarning' },
      { name: 'Security Management', icon: 'Lock' },
      { name: 'Service Desk', icon: 'Headset' },
      { name: 'Sports Management', icon: 'Dumbbell' },
    ],
  },
] as const;

export const PILLARS = [
  {
    id: 'academics',
    color: 'blue',
    tagline: 'Admission to Graduation',
    title: 'Academic Management',
    desc: 'Complete lifecycle management for admissions, programmes, and examinations.',
  },
  {
    id: 'governance',
    color: 'indigo',
    tagline: 'Transparent Operations',
    title: 'Governance & Admin',
    desc: 'Comprehensive modules covering RTI, legal cases, and file workflow tracking.',
  },
  {
    id: 'finance',
    color: 'emerald',
    tagline: 'End-to-End Control',
    title: 'Finance & Fees',
    desc: 'Powerful finance modules with multi-channel payments and audit trails.',
  },
  {
    id: 'hr',
    color: 'orange',
    tagline: 'People-First System',
    title: 'HR & Employee',
    desc: 'Complete HR lifecycle from recruitment to retirement, payroll, and leave.',
  },
  {
    id: 'analytics',
    color: 'cyan',
    tagline: 'Data-Driven Decisions',
    title: 'Analytics & BI',
    desc: 'Real-time BI dashboards, custom query builder, and predictive insights.',
  },
  {
    id: 'research',
    color: 'purple',
    tagline: 'Funding & Projects',
    title: 'Research Management',
    desc: 'Track research grants, project lifecycles, publications, and funding allocation.',
  },
  {
    id: 'estate',
    color: 'rose',
    tagline: 'Campus Operations',
    title: 'Estate & Infrastructure',
    desc: 'Manage hostels, transport, inventory, and physical campus infrastructure seamlessly.',
  },
  {
    id: 'alumni',
    color: 'amber',
    tagline: 'Lifelong Connection',
    title: 'Alumni Relations',
    desc: 'Build and maintain strong alumni networks, donation portals, and event management.',
  },
] as const;

export const COMPARISON_ROWS = [
  {
    feature: 'UI / UX Experience',
    samarth: 'Complex, JSON-based config',
    octagon: 'Modern & intuitive interface',
    win: 'octagon',
  },
  {
    feature: 'System Configuration',
    samarth: 'Technical setup required',
    octagon: 'Simple UI-driven setup',
    win: 'octagon',
  },
  {
    feature: 'Governance Modules',
    samarth: 'Basic',
    octagon: 'Comprehensive (18+ modules)',
    win: 'octagon',
  },
  {
    feature: 'Analytics Dashboard',
    samarth: 'Limited reporting',
    octagon: 'Advanced BI + Tableau',
    win: 'octagon',
  },
  {
    feature: 'AI-Powered Attendance',
    samarth: 'Not Available',
    octagon: 'Available',
    win: 'octagon',
  },
  {
    feature: 'Blockchain Credentials',
    samarth: 'Not Available',
    octagon: 'Available',
    win: 'octagon',
  },
  {
    feature: 'WhatsApp Integration',
    samarth: 'Not Available',
    octagon: 'Available',
    win: 'octagon',
  },
  {
    feature: 'Mobile Application',
    samarth: 'Limited',
    octagon: 'Role-based dedicated app',
    win: 'octagon',
  },
  {
    feature: 'IVRS Integration',
    samarth: 'Limited',
    octagon: 'Full integration',
    win: 'octagon',
  },
  {
    feature: 'Legal Case Management',
    samarth: 'Basic',
    octagon: 'STQC Certified system',
    win: 'octagon',
  },
  {
    feature: 'APAAR / ABC',
    samarth: 'Supported',
    octagon: 'Supported',
    win: 'both',
  },
  {
    feature: 'NEP 2020 Compliance',
    samarth: 'Supported',
    octagon: 'Supported',
    win: 'both',
  },
] as const;

export const ADVANCED_FEATURES = [
  {
    icon: '🤖',
    title: 'AI-Powered Attendance',
    desc: 'Facial recognition based automated attendance system for students and staff — zero manual effort.',
    tag: 'Artificial Intelligence',
  },
  {
    icon: '⛓️',
    title: 'Blockchain Credentials',
    desc: 'Tamper-proof digital degrees and certificates stored on blockchain. Verifiable anywhere, forever.',
    tag: 'Blockchain',
  },
  {
    icon: '📱',
    title: 'Role-Based Mobile App',
    desc: 'Dedicated interfaces for Admin, Faculty, and Students. Notifications, approvals, and data — on the go.',
    tag: 'Mobile',
  },
  {
    icon: '📊',
    title: 'Advanced BI Dashboards',
    desc: 'Tableau-powered real-time monitoring. Custom reports, executive summaries, and predictive insights.',
    tag: 'Business Intelligence',
  },
] as const;

export const INTEGRATIONS = [
  { name: 'APAAR', icon: '🏫' },
  { name: 'ABC', icon: '📚' },
  { name: 'Payment Gateway', icon: '💳' },
  { name: 'WhatsApp', icon: '💬' },
  { name: 'SMS', icon: '📱' },
  { name: 'Email', icon: '📧' },
  { name: 'IVRS', icon: '📞' },
  { name: 'DigiLocker', icon: '🔐' },
  { name: 'UGC', icon: '🎓' },
  { name: 'AICTE', icon: '⚙️' },
] as const;

export const STATS = [
  { number: '43+', label: 'Modules', sub: 'Across all departments' },
  { number: '5', label: 'Core Pillars', sub: 'Complete coverage' },
  { number: '100%', label: 'NEP 2020 Ready', sub: 'Future compliant' },
  { number: 'STQC', label: 'Certified', sub: 'Government grade quality' },
] as const;

export const ABOUT_CONTENT = {
  badge: 'About OCTAGON',
  headline: 'Bhopal se Shuru, India ke Liye',
  story:
    'OCTAGON is a Bhopal-based software company dedicated to transforming higher education administration across India. We believe that universities deserve technology that is as intelligent and ambitious as the students they nurture.',
  mission:
    'To deliver a unified, intelligent, and governance-focused ERP that empowers every university to run with transparency, efficiency, and excellence.',
  vision:
    'A digital India where every university operates on a single, powerful platform — removing friction, enabling decisions, and serving students better.',
  values: [
    {
      icon: '🎯',
      title: 'Precision',
      desc: 'Every module is built for the exact workflow of Indian universities.',
    },
    {
      icon: '🤝',
      title: 'Partnership',
      desc: "We don't just install software — we become your technology partner.",
    },
    {
      icon: '🚀',
      title: 'Innovation',
      desc: 'AI, blockchain, and BI built-in — not bolted on.',
    },
  ],
};
