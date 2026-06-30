export interface SeedFAQ {
  id: string;
  question: string;
  solution: string;
  category: string;
  status: 'Active' | 'Inactive';
}

export interface SeedNotification {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;
  status: 'Published' | 'Draft';
  featured: boolean;
  publishedAt: string;
}

export interface SeedPortalSettings {
  institutionIntro: string;
  prospectusLink: string;
  registrationDeadline: string;
  registrationInstructions: string;
  formDeclaration: string;
  supportAddress: string;
  contactUsFooterAddress: string;
}

export interface SeedProgrammeConfig {
  id: string;
  programmeName: string;
  admissionCriteria: 'Entrance' | 'Merit' | 'Both';
}

export interface SeedFeeConfig {
  id: string;
  programmeName: string;
  category: 'General' | 'OBC' | 'SC' | 'ST';
  registrationFee: number;
  recurringFee: number;
}

let MOCK_FAQS: SeedFAQ[] = [
  {
    id: 'FAQ001',
    question: 'What documents are required for admission?',
    solution:
      '10th marksheet, 12th marksheet, Aadhar card, passport size photo, and category certificate (if applicable).',
    category: 'Documents',
    status: 'Active',
  },
  {
    id: 'FAQ002',
    question: 'What is the last date to apply?',
    solution:
      'The last date for submitting online applications is 30th July 2024.',
    category: 'Deadline',
    status: 'Active',
  },
  {
    id: 'FAQ003',
    question: 'Is there a reservation policy?',
    solution:
      'Yes, seats are reserved as per government norms: OBC 27%, SC 15%, ST 7.5%.',
    category: 'Policy',
    status: 'Active',
  },
  {
    id: 'FAQ004',
    question: 'Can I apply for multiple programmes?',
    solution:
      'Yes, you can apply for up to 3 programmes in a single registration.',
    category: 'General',
    status: 'Active',
  },
  {
    id: 'FAQ005',
    question: 'How will I know if my application is approved?',
    solution:
      'You will receive an SMS and email notification on your registered mobile number and email address.',
    category: 'Process',
    status: 'Active',
  },
];

let MOCK_NOTIFICATIONS: SeedNotification[] = [
  {
    id: 'NOT001',
    title: 'Admission Open 2024-25',
    description:
      'Online admissions are now open for all UG and PG programmes for the academic session 2024-25. Apply before 30th July.',
    status: 'Published',
    featured: true,
    publishedAt: '2024-06-01',
  },
  {
    id: 'NOT002',
    title: 'Entrance Exam Schedule Released',
    description:
      'The schedule for the University Entrance Examination (UEE 2024) has been released. Check the timetable on the official portal.',
    fileUrl: 'https://example.com/uee-schedule.pdf',
    status: 'Published',
    featured: true,
    publishedAt: '2024-06-10',
  },
  {
    id: 'NOT003',
    title: 'Fee Concession for EWS Category',
    description:
      'Students from Economically Weaker Section (EWS) are eligible for a 10% concession on the registration fee.',
    status: 'Published',
    featured: false,
    publishedAt: '2024-06-15',
  },
  {
    id: 'NOT004',
    title: 'Prospectus 2024-25 Available',
    description:
      'The digital prospectus for 2024-25 is now available for download. It contains details about all programmes, fees, and eligibility.',
    fileUrl: 'https://example.com/prospectus-2024.pdf',
    status: 'Draft',
    featured: false,
    publishedAt: '2024-06-20',
  },
];

let MOCK_PORTAL_SETTINGS: SeedPortalSettings = {
  institutionIntro:
    'Welcome to the University of Excellence — a premier institution committed to academic excellence, research, and holistic development. We offer a wide range of UG, PG, and doctoral programmes.',
  prospectusLink: 'https://example.com/prospectus-2024.pdf',
  registrationDeadline: '2024-07-30',
  registrationInstructions:
    '1. Read the eligibility criteria carefully.\n2. Fill in all required personal and academic details.\n3. Upload scanned copies of required documents.\n4. Pay the registration fee online.\n5. Take a printout of the filled application form.',
  formDeclaration:
    'I hereby declare that all information provided in this application form is true and correct to the best of my knowledge. I understand that any false information may result in the cancellation of my admission.',
  supportAddress:
    'Admission Cell, Main Building, University of Excellence, City - 400001',
  contactUsFooterAddress: 'admissions@university.edu | +91-22-12345678',
};

let MOCK_PROGRAMME_CONFIG: SeedProgrammeConfig[] = [
  {
    id: 'PC001',
    programmeName: 'B.Tech Computer Science',
    admissionCriteria: 'Entrance',
  },
  { id: 'PC002', programmeName: 'MBA Finance', admissionCriteria: 'Both' },
  { id: 'PC003', programmeName: 'B.Sc Physics', admissionCriteria: 'Merit' },
];

let MOCK_FEE_CONFIG: SeedFeeConfig[] = [
  {
    id: 'FC001',
    programmeName: 'B.Tech Computer Science',
    category: 'General',
    registrationFee: 1500,
    recurringFee: 25000,
  },
  {
    id: 'FC002',
    programmeName: 'B.Tech Computer Science',
    category: 'OBC',
    registrationFee: 1000,
    recurringFee: 20000,
  },
  {
    id: 'FC003',
    programmeName: 'B.Tech Computer Science',
    category: 'SC',
    registrationFee: 500,
    recurringFee: 15000,
  },
  {
    id: 'FC004',
    programmeName: 'B.Tech Computer Science',
    category: 'ST',
    registrationFee: 500,
    recurringFee: 15000,
  },
  {
    id: 'FC005',
    programmeName: 'MBA Finance',
    category: 'General',
    registrationFee: 2000,
    recurringFee: 35000,
  },
  {
    id: 'FC006',
    programmeName: 'MBA Finance',
    category: 'OBC',
    registrationFee: 1500,
    recurringFee: 30000,
  },
  {
    id: 'FC007',
    programmeName: 'B.Sc Physics',
    category: 'General',
    registrationFee: 1000,
    recurringFee: 15000,
  },
  {
    id: 'FC008',
    programmeName: 'B.Sc Physics',
    category: 'SC',
    registrationFee: 500,
    recurringFee: 10000,
  },
];

export const FAQSeedService = {
  getAll: async () => Promise.resolve([...MOCK_FAQS]),
  add: async (faq: Omit<SeedFAQ, 'id'>) => {
    const newFaq = {
      ...faq,
      id: `FAQ${String(MOCK_FAQS.length + 1).padStart(3, '0')}`,
    };
    MOCK_FAQS.push(newFaq);
    return Promise.resolve(newFaq);
  },
  update: async (id: string, data: Partial<SeedFAQ>) => {
    MOCK_FAQS = MOCK_FAQS.map(f => (f.id === id ? { ...f, ...data } : f));
    return Promise.resolve(MOCK_FAQS.find(f => f.id === id) ?? null);
  },
  delete: async (id: string) => {
    MOCK_FAQS = MOCK_FAQS.filter(f => f.id !== id);
    return Promise.resolve(true);
  },
};

export const NotificationSeedService = {
  getAll: async () => Promise.resolve([...MOCK_NOTIFICATIONS]),
  add: async (n: Omit<SeedNotification, 'id'>) => {
    const newN = {
      ...n,
      id: `NOT${String(MOCK_NOTIFICATIONS.length + 1).padStart(3, '0')}`,
    };
    MOCK_NOTIFICATIONS.push(newN);
    return Promise.resolve(newN);
  },
  update: async (id: string, data: Partial<SeedNotification>) => {
    MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map(n =>
      n.id === id ? { ...n, ...data } : n
    );
    return Promise.resolve(MOCK_NOTIFICATIONS.find(n => n.id === id) ?? null);
  },
  delete: async (id: string) => {
    MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.filter(n => n.id !== id);
    return Promise.resolve(true);
  },
};

export const PortalSettingsSeedService = {
  get: async () => Promise.resolve({ ...MOCK_PORTAL_SETTINGS }),
  update: async (data: Partial<SeedPortalSettings>) => {
    MOCK_PORTAL_SETTINGS = { ...MOCK_PORTAL_SETTINGS, ...data };
    return Promise.resolve({ ...MOCK_PORTAL_SETTINGS });
  },
};

export const ProgrammeConfigSeedService = {
  getAll: async () => Promise.resolve([...MOCK_PROGRAMME_CONFIG]),
  update: async (id: string, data: Partial<SeedProgrammeConfig>) => {
    MOCK_PROGRAMME_CONFIG = MOCK_PROGRAMME_CONFIG.map(p =>
      p.id === id ? { ...p, ...data } : p
    );
    return Promise.resolve(
      MOCK_PROGRAMME_CONFIG.find(p => p.id === id) ?? null
    );
  },
};

export const FeeConfigSeedService = {
  getAll: async () => Promise.resolve([...MOCK_FEE_CONFIG]),
  update: async (id: string, data: Partial<SeedFeeConfig>) => {
    MOCK_FEE_CONFIG = MOCK_FEE_CONFIG.map(f =>
      f.id === id ? { ...f, ...data } : f
    );
    return Promise.resolve(MOCK_FEE_CONFIG.find(f => f.id === id) ?? null);
  },
};
