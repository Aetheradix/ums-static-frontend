// ─── TRAINER DEVELOPMENT MANAGEMENT — MOCK DATA ──────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Trainer {
  id: string;
  trainerId: string;
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  qualification: string;
  experience: number;
  industryExperience: number;
  trainerType: 'Internal' | 'External' | 'Guest';
  employmentType: 'Regular' | 'Contract' | 'Visiting' | 'Adjunct';
  email: string;
  mobile: string;
  specialization: string[];
  skills: string[];
  languages: string[];
  status: 'Active' | 'Inactive' | 'On Deputation';
  rating: number;
  totalSessions: number;
  certifications: string[];
  profilePhoto?: string;
}

export interface TrainingProgram {
  id: string;
  trainingId: string;
  title: string;
  category: string;
  type: 'Workshop' | 'Seminar' | 'FDP' | 'Orientation' | 'MOOC' | 'Webinar' | 'Certification' | 'Conference';
  mode: 'Online' | 'Offline' | 'Hybrid';
  department: string;
  trainer: string;
  trainerId: string;
  venue: string;
  meetingLink?: string;
  platform?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  duration: number; // hours
  maxParticipants: number;
  registeredCount: number;
  status: 'Planned' | 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Postponed';
  objectives: string;
  outcomes: string;
  budget: number;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export interface TrainingSession {
  id: string;
  sessionId: string;
  trainingId: string;
  trainingTitle: string;
  sessionNo: number;
  date: string;
  startTime: string;
  endTime: string;
  trainer: string;
  venue: string;
  topic: string;
  attendanceCount: number;
  totalParticipants: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Ongoing';
  remarks?: string;
}

export interface TrainingAttendance {
  id: string;
  participantId: string;
  participantName: string;
  department: string;
  designation: string;
  sessionId: string;
  trainingTitle: string;
  date: string;
  punchIn: string;
  punchOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
}

export interface Competency {
  id: string;
  code: string;
  name: string;
  category: 'Technical' | 'Behavioral' | 'Leadership' | 'Domain' | 'Functional';
  description: string;
  levels: number;
  applicableTo: string[];
  status: 'Active' | 'Inactive';
}

export interface CompetencyMapping {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  competency: string;
  requiredLevel: number;
  currentLevel: number;
  gap: number;
  targetDate: string;
  status: 'Gap Identified' | 'In Progress' | 'Achieved' | 'Not Started';
}

export interface Assessment {
  id: string;
  assessmentId: string;
  trainingId: string;
  trainingTitle: string;
  participantName: string;
  department: string;
  type: 'Quiz' | 'Assignment' | 'Practical' | 'Presentation';
  maxMarks: number;
  obtainedMarks: number;
  passingMarks: number;
  result: 'Pass' | 'Fail' | 'Pending';
  submittedOn: string;
  evaluatedBy: string;
}

export interface FeedbackRecord {
  id: string;
  trainingId: string;
  trainingTitle: string;
  participantName: string;
  department: string;
  trainerName: string;
  date: string;
  sessionRating: number;
  trainerRating: number;
  communicationRating: number;
  knowledgeRating: number;
  practicalRating: number;
  contentQuality: number;
  overallRating: number;
  suggestions: string;
  comments: string;
}

export interface Certificate {
  id: string;
  certificateNo: string;
  participantId: string;
  participantName: string;
  department: string;
  trainingId: string;
  trainingTitle: string;
  trainerId: string;
  trainerName: string;
  issueDate: string;
  expiryDate?: string;
  status: 'Issued' | 'Revoked' | 'Expired' | 'Renewed' | 'Pending';
  verificationUrl: string;
  type: 'Completion' | 'Excellence' | 'Participation' | 'Appreciation';
}

export interface ApprovalRequest {
  id: string;
  requestNo: string;
  type: 'Training Approval' | 'Trainer Approval' | 'Budget Approval' | 'Certificate Approval' | 'Completion Approval';
  title: string;
  requestedBy: string;
  requestedDate: string;
  department: string;
  currentApprover: string;
  level: number;
  totalLevels: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Forwarded';
  remarks?: string;
  amount?: number;
  approvedBy?: string;
}

export interface TrainingCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  status: 'Active' | 'Inactive';
}

export interface TrainingMode {
  id: string;
  name: string;
  code: string;
  description: string;
  attendanceType: 'Online Tracking' | 'QR Code' | 'Manual' | 'Hybrid';
  status: 'Active' | 'Inactive';
}

export interface CertificationMaster {
  id: string;
  name: string;
  code: string;
  validityMonths: number;
  templateType: 'Standard' | 'Custom' | 'External';
  approvalRequired: boolean;
  status: 'Active' | 'Inactive';
}

export interface VenueMaster {
  id: string;
  code: string;
  name: string;
  building: string;
  room: string;
  capacity: number;
  facilities: string[];
  status: 'Available' | 'Occupied' | 'Under Maintenance';
}

export interface Honorarium {
  id: string;
  trainerId: string;
  trainerName: string;
  trainingId: string;
  trainingTitle: string;
  sessions: number;
  ratePerSession: number;
  totalAmount: number;
  tdsDeducted: number;
  netPayable: number;
  paymentDate?: string;
  status: 'Pending' | 'Processed' | 'Paid';
  bankAccount: string;
}

// ─── Departments ─────────────────────────────────────────────────────────────

export const departments = [
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Communication',
  'Information Technology',
  'MBA — Business Administration',
  'Mathematics & Statistics',
  'Physics',
  'Chemistry',
  'Biotechnology',
  'Architecture',
  'Library & Information Science',
  'Physical Education',
  'Administration',
];

// ─── Trainers ─────────────────────────────────────────────────────────────────

export const trainers: Trainer[] = [
  {
    id: 'T001', trainerId: 'TDM-TR-001', employeeId: 'EMP-1042',
    name: 'Dr. Rajesh Kumar Sharma', department: 'Computer Science & Engineering',
    designation: 'Professor & Head', qualification: 'Ph.D (Computer Science), M.Tech, B.E.',
    experience: 18, industryExperience: 5, trainerType: 'Internal', employmentType: 'Regular',
    email: 'rajesh.sharma@university.edu', mobile: '9876543210',
    specialization: ['Machine Learning', 'Data Science', 'Python', 'Deep Learning'],
    skills: ['Python', 'TensorFlow', 'Keras', 'R', 'Tableau', 'SQL'],
    languages: ['English', 'Hindi', 'Telugu'],
    status: 'Active', rating: 4.8, totalSessions: 47,
    certifications: ['AWS ML Specialty', 'Google TensorFlow Developer', 'Coursera Deep Learning'],
  },
  {
    id: 'T002', trainerId: 'TDM-TR-002', employeeId: 'EMP-1087',
    name: 'Dr. Priya Venkataraman', department: 'Information Technology',
    designation: 'Associate Professor', qualification: 'Ph.D (IT), M.Tech, B.Tech',
    experience: 14, industryExperience: 3, trainerType: 'Internal', employmentType: 'Regular',
    email: 'priya.venkataraman@university.edu', mobile: '9823456710',
    specialization: ['Cybersecurity', 'Cloud Computing', 'DevOps', 'Networking'],
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Linux', 'Ethical Hacking'],
    languages: ['English', 'Tamil', 'Hindi'],
    status: 'Active', rating: 4.7, totalSessions: 32,
    certifications: ['CEH v11', 'AWS Solutions Architect', 'CISSP'],
  },
  {
    id: 'T003', trainerId: 'TDM-TR-003', employeeId: 'EMP-2031',
    name: 'Prof. Suresh Babu Naidu', department: 'Mechanical Engineering',
    designation: 'Professor', qualification: 'Ph.D (Mechanical), M.E., B.E.',
    experience: 22, industryExperience: 8, trainerType: 'Internal', employmentType: 'Regular',
    email: 'suresh.naidu@university.edu', mobile: '9745612380',
    specialization: ['CAD/CAM', 'Manufacturing Processes', 'Robotics', 'Industry 4.0'],
    skills: ['AutoCAD', 'SolidWorks', 'CATIA', 'ANSYS', 'PLC Programming'],
    languages: ['English', 'Telugu', 'Kannada'],
    status: 'Active', rating: 4.6, totalSessions: 58,
    certifications: ['Siemens NX Certified', 'SOLIDWORKS Professional', 'PLC Programming'],
  },
  {
    id: 'T004', trainerId: 'TDM-TR-004', employeeId: 'EMP-3012',
    name: 'Dr. Anjali Singh Patel', department: 'MBA — Business Administration',
    designation: 'Associate Professor', qualification: 'Ph.D (Management), MBA, B.Com (Hons.)',
    experience: 12, industryExperience: 7, trainerType: 'Internal', employmentType: 'Regular',
    email: 'anjali.patel@university.edu', mobile: '9654321870',
    specialization: ['Leadership Development', 'Organizational Behavior', 'HR Management', 'Soft Skills'],
    skills: ['Corporate Training', 'NLP', 'Psychometric Assessment', 'Change Management'],
    languages: ['English', 'Hindi', 'Gujarati'],
    status: 'Active', rating: 4.9, totalSessions: 64,
    certifications: ['ICF Certified Coach', 'SHRM-SCP', 'NLP Practitioner'],
  },
  {
    id: 'T005', trainerId: 'TDM-TR-005', employeeId: 'EMP-4089',
    name: 'Dr. Mohammed Irfan Khan', department: 'Electronics & Communication',
    designation: 'Assistant Professor', qualification: 'Ph.D (ECE), M.Tech, B.E.',
    experience: 9, industryExperience: 4, trainerType: 'Internal', employmentType: 'Regular',
    email: 'irfan.khan@university.edu', mobile: '9512345678',
    specialization: ['Embedded Systems', 'IoT', 'VLSI Design', 'Signal Processing'],
    skills: ['Arduino', 'Raspberry Pi', 'MATLAB', 'Verilog', 'FPGA', 'LabVIEW'],
    languages: ['English', 'Hindi', 'Urdu'],
    status: 'Active', rating: 4.5, totalSessions: 28,
    certifications: ['Texas Instruments Certified', 'Cisco IoT', 'ARM Cortex Expert'],
  },
  {
    id: 'T006', trainerId: 'TDM-TR-006', employeeId: 'EXT-001',
    name: 'Mr. Vikram Anand Mehta', department: 'Industry Expert',
    designation: 'Senior Consultant', qualification: 'M.Tech (IIT Delhi), MBA (IIM-A)',
    experience: 20, industryExperience: 18, trainerType: 'External', employmentType: 'Visiting',
    email: 'vikram.mehta@techconsult.in', mobile: '9800123456',
    specialization: ['Blockchain', 'Web3', 'Fintech', 'Digital Transformation'],
    skills: ['Blockchain', 'Solidity', 'DeFi', 'Agile', 'Scrum', 'Product Management'],
    languages: ['English', 'Hindi'],
    status: 'Active', rating: 4.7, totalSessions: 15,
    certifications: ['Certified Blockchain Expert', 'PMP', 'SAFe Agilist'],
  },
  {
    id: 'T007', trainerId: 'TDM-TR-007', employeeId: 'EMP-1156',
    name: 'Dr. Lakshmi Devi Krishnamurthy', department: 'Mathematics & Statistics',
    designation: 'Professor', qualification: 'Ph.D (Statistics), M.Sc, B.Sc',
    experience: 20, industryExperience: 2, trainerType: 'Internal', employmentType: 'Regular',
    email: 'lakshmi.krishnamurthy@university.edu', mobile: '9432167890',
    specialization: ['Statistical Analysis', 'Research Methodology', 'Data Analytics', 'SPSS'],
    skills: ['SPSS', 'R Studio', 'Python', 'Excel Advanced', 'SAS', 'Minitab'],
    languages: ['English', 'Telugu', 'Kannada', 'Tamil'],
    status: 'Active', rating: 4.6, totalSessions: 39,
    certifications: ['SAS Certified', 'IBM SPSS Certified', 'ASQ Six Sigma'],
  },
  {
    id: 'T008', trainerId: 'TDM-TR-008', employeeId: 'EXT-002',
    name: 'Ms. Ritu Sharma Agarwal', department: 'Corporate Training',
    designation: 'Executive Trainer', qualification: 'MBA (HR), M.Sc (Psychology)',
    experience: 15, industryExperience: 15, trainerType: 'External', employmentType: 'Contract',
    email: 'ritu.agarwal@softskillpro.com', mobile: '9088765432',
    specialization: ['Communication Skills', 'Interview Skills', 'Personality Development', 'Public Speaking'],
    skills: ['Corporate Training', 'Presentation Skills', 'Group Dynamics', 'Conflict Resolution'],
    languages: ['English', 'Hindi', 'Marathi'],
    status: 'Active', rating: 4.8, totalSessions: 22,
    certifications: ['Toastmasters DTM', 'ICF ACC', 'POSH Trainer'],
  },
];

// ─── Training Programs ────────────────────────────────────────────────────────

export const trainingPrograms: TrainingProgram[] = [
  {
    id: 'TP001', trainingId: 'TDM-2024-001',
    title: 'Faculty Development Programme on AI & Machine Learning',
    category: 'Faculty Development', type: 'FDP', mode: 'Offline',
    department: 'All Departments', trainer: 'Dr. Rajesh Kumar Sharma', trainerId: 'T001',
    venue: 'Seminar Hall A, Block-3', startDate: '2024-07-15', endDate: '2024-07-19',
    startTime: '09:00', endTime: '17:00', duration: 40, maxParticipants: 50, registeredCount: 47,
    status: 'Completed', objectives: 'To enhance faculty knowledge in AI/ML fundamentals and applications in education.',
    outcomes: 'Participants will be able to integrate AI tools in curriculum and research.',
    budget: 125000, approvalStatus: 'Approved', approvedBy: 'Dean Academics',
    meetingLink: undefined, platform: undefined,
  },
  {
    id: 'TP002', trainingId: 'TDM-2024-002',
    title: 'Cybersecurity Awareness & Ethical Hacking Workshop',
    category: 'Technical Skill', type: 'Workshop', mode: 'Hybrid',
    department: 'Information Technology', trainer: 'Dr. Priya Venkataraman', trainerId: 'T002',
    venue: 'Computer Lab-2, Block-1', meetingLink: 'https://meet.university.edu/cyber-workshop',
    platform: 'Zoom', startDate: '2024-08-05', endDate: '2024-08-07',
    startTime: '10:00', endTime: '16:00', duration: 18, maxParticipants: 30, registeredCount: 28,
    status: 'Completed', objectives: 'Practical training on penetration testing, vulnerability assessment.',
    outcomes: 'Faculty capable of teaching cybersecurity with hands-on lab experience.',
    budget: 45000, approvalStatus: 'Approved', approvedBy: 'Director IT',
  },
  {
    id: 'TP003', trainingId: 'TDM-2024-003',
    title: 'Industry 4.0 & Smart Manufacturing Technologies',
    category: 'Industry Exposure', type: 'Seminar', mode: 'Offline',
    department: 'Mechanical Engineering', trainer: 'Prof. Suresh Babu Naidu', trainerId: 'T003',
    venue: 'Conference Hall, Administrative Block', startDate: '2024-09-10', endDate: '2024-09-11',
    startTime: '09:30', endTime: '17:30', duration: 16, maxParticipants: 60, registeredCount: 55,
    status: 'Completed', objectives: 'Expose faculty to latest Industry 4.0 technologies and applications.',
    outcomes: 'Updated curriculum to include IoT, robotics, and smart manufacturing concepts.',
    budget: 80000, approvalStatus: 'Approved', approvedBy: 'Principal',
  },
  {
    id: 'TP004', trainingId: 'TDM-2024-004',
    title: 'NEP 2020 Implementation & Outcome Based Education',
    category: 'Policy & Compliance', type: 'Workshop', mode: 'Online',
    department: 'All Departments', trainer: 'Dr. Anjali Singh Patel', trainerId: 'T004',
    venue: 'Online', meetingLink: 'https://webinar.university.edu/nep-obe',
    platform: 'Google Meet', startDate: '2024-10-01', endDate: '2024-10-03',
    startTime: '09:00', endTime: '13:00', duration: 12, maxParticipants: 100, registeredCount: 94,
    status: 'Completed', objectives: 'Train faculty on NEP 2020 guidelines and OBE implementation.',
    outcomes: 'All departments aligned with NEP framework and NAAC compliance.',
    budget: 25000, approvalStatus: 'Approved', approvedBy: 'Vice Chancellor',
  },
  {
    id: 'TP005', trainingId: 'TDM-2024-005',
    title: 'Research Methodology & Publication Skills (Scopus & WoS)',
    category: 'Research & Publication', type: 'FDP', mode: 'Offline',
    department: 'All Departments', trainer: 'Dr. Lakshmi Devi Krishnamurthy', trainerId: 'T007',
    venue: 'Seminar Hall B, Library Block', startDate: '2024-11-18', endDate: '2024-11-22',
    startTime: '09:00', endTime: '17:00', duration: 40, maxParticipants: 45, registeredCount: 43,
    status: 'Completed', objectives: 'Develop research writing and publication skills for Scopus/WoS indexed journals.',
    outcomes: 'Minimum 15 research papers submitted to indexed journals within 3 months.',
    budget: 95000, approvalStatus: 'Approved', approvedBy: 'Dean Research',
  },
  {
    id: 'TP006', trainingId: 'TDM-2024-006',
    title: 'Blockchain & Web3 Technology Workshop',
    category: 'Emerging Technology', type: 'Workshop', mode: 'Offline',
    department: 'Computer Science & Engineering', trainer: 'Mr. Vikram Anand Mehta', trainerId: 'T006',
    venue: 'Innovation Lab, Block-5', startDate: '2024-12-09', endDate: '2024-12-10',
    startTime: '10:00', endTime: '17:00', duration: 14, maxParticipants: 35, registeredCount: 32,
    status: 'Completed', objectives: 'Hands-on experience with blockchain development and DeFi concepts.',
    outcomes: 'Prototype DApps developed by faculty teams.',
    budget: 65000, approvalStatus: 'Approved', approvedBy: 'Director Research',
  },
  {
    id: 'TP007', trainingId: 'TDM-2025-001',
    title: 'Communication & Presentation Skills for Faculty',
    category: 'Soft Skills', type: 'Workshop', mode: 'Hybrid',
    department: 'All Departments', trainer: 'Ms. Ritu Sharma Agarwal', trainerId: 'T008',
    venue: 'Auditorium, Main Block', meetingLink: 'https://meet.university.edu/comm-skills',
    platform: 'Teams', startDate: '2025-01-20', endDate: '2025-01-22',
    startTime: '09:00', endTime: '16:00', duration: 21, maxParticipants: 80, registeredCount: 72,
    status: 'Completed', objectives: 'Improve public speaking, classroom communication, and professional presentation.',
    outcomes: 'Measurable improvement in student feedback scores for communication.',
    budget: 55000, approvalStatus: 'Approved', approvedBy: 'Principal',
  },
  {
    id: 'TP008', trainingId: 'TDM-2025-002',
    title: 'IoT & Embedded Systems Development Bootcamp',
    category: 'Technical Skill', type: 'Workshop', mode: 'Offline',
    department: 'Electronics & Communication', trainer: 'Dr. Mohammed Irfan Khan', trainerId: 'T005',
    venue: 'Electronics Lab, Block-2', startDate: '2025-02-10', endDate: '2025-02-14',
    startTime: '09:00', endTime: '18:00', duration: 45, maxParticipants: 25, registeredCount: 24,
    status: 'Ongoing', objectives: 'Develop expertise in IoT system design and embedded programming.',
    outcomes: 'Working IoT prototypes built by each faculty member.',
    budget: 85000, approvalStatus: 'Approved', approvedBy: 'Director IT',
  },
  {
    id: 'TP009', trainingId: 'TDM-2025-003',
    title: 'NAAC Documentation & Quality Assurance Training',
    category: 'NAAC / Accreditation', type: 'Orientation', mode: 'Online',
    department: 'All Departments', trainer: 'Dr. Anjali Singh Patel', trainerId: 'T004',
    venue: 'Online', meetingLink: 'https://webinar.university.edu/naac-2025',
    platform: 'Zoom', startDate: '2025-03-03', endDate: '2025-03-05',
    startTime: '10:00', endTime: '14:00', duration: 12, maxParticipants: 120, registeredCount: 108,
    status: 'Scheduled', objectives: 'Prepare faculty and staff for NAAC peer team visit and documentation.',
    outcomes: 'Complete NAAC SSR documentation for all criteria.',
    budget: 18000, approvalStatus: 'Approved', approvedBy: 'IQAC Coordinator',
  },
  {
    id: 'TP010', trainingId: 'TDM-2025-004',
    title: 'Advanced Python for Data Analytics & Visualization',
    category: 'Technical Skill', type: 'FDP', mode: 'Offline',
    department: 'Computer Science & Engineering', trainer: 'Dr. Rajesh Kumar Sharma', trainerId: 'T001',
    venue: 'Data Science Lab, Block-1', startDate: '2025-04-07', endDate: '2025-04-11',
    startTime: '09:00', endTime: '17:00', duration: 40, maxParticipants: 40, registeredCount: 12,
    status: 'Planned', objectives: 'Advanced Python programming for data analytics with real-world datasets.',
    outcomes: 'Faculty capable of designing Python-based data analytics courses.',
    budget: 110000, approvalStatus: 'Pending',
  },
  {
    id: 'TP011', trainingId: 'TDM-2025-005',
    title: 'AICTE Faculty Development in Robotics & Automation',
    category: 'AICTE Mandated', type: 'FDP', mode: 'Offline',
    department: 'Mechanical Engineering', trainer: 'Prof. Suresh Babu Naidu', trainerId: 'T003',
    venue: 'Robotics Lab, Block-4', startDate: '2025-05-12', endDate: '2025-05-16',
    startTime: '09:00', endTime: '17:00', duration: 40, maxParticipants: 30, registeredCount: 0,
    status: 'Planned', objectives: 'AICTE mandated FDP on robotics and automation curriculum.',
    outcomes: 'Updated laboratory setup and curriculum as per AICTE guidelines.',
    budget: 150000, approvalStatus: 'Pending',
  },
];

// ─── Training Sessions ────────────────────────────────────────────────────────

export const trainingSessions: TrainingSession[] = [
  { id: 'TS001', sessionId: 'SES-001', trainingId: 'TP001', trainingTitle: 'FDP on AI & Machine Learning', sessionNo: 1, date: '2024-07-15', startTime: '09:00', endTime: '13:00', trainer: 'Dr. Rajesh Kumar Sharma', venue: 'Seminar Hall A', topic: 'Introduction to AI & ML Fundamentals', attendanceCount: 45, totalParticipants: 47, status: 'Completed' },
  { id: 'TS002', sessionId: 'SES-002', trainingId: 'TP001', trainingTitle: 'FDP on AI & Machine Learning', sessionNo: 2, date: '2024-07-16', startTime: '09:00', endTime: '17:00', trainer: 'Dr. Rajesh Kumar Sharma', venue: 'Seminar Hall A', topic: 'Supervised Learning & Classification Algorithms', attendanceCount: 46, totalParticipants: 47, status: 'Completed' },
  { id: 'TS003', sessionId: 'SES-003', trainingId: 'TP001', trainingTitle: 'FDP on AI & Machine Learning', sessionNo: 3, date: '2024-07-17', startTime: '09:00', endTime: '17:00', trainer: 'Dr. Rajesh Kumar Sharma', venue: 'Seminar Hall A', topic: 'Neural Networks & Deep Learning', attendanceCount: 44, totalParticipants: 47, status: 'Completed' },
  { id: 'TS004', sessionId: 'SES-004', trainingId: 'TP002', trainingTitle: 'Cybersecurity Workshop', sessionNo: 1, date: '2024-08-05', startTime: '10:00', endTime: '16:00', trainer: 'Dr. Priya Venkataraman', venue: 'Computer Lab-2', topic: 'Ethical Hacking Fundamentals & Kali Linux', attendanceCount: 27, totalParticipants: 28, status: 'Completed' },
  { id: 'TS005', sessionId: 'SES-005', trainingId: 'TP002', trainingTitle: 'Cybersecurity Workshop', sessionNo: 2, date: '2024-08-06', startTime: '10:00', endTime: '16:00', trainer: 'Dr. Priya Venkataraman', venue: 'Computer Lab-2', topic: 'Vulnerability Assessment & Penetration Testing', attendanceCount: 26, totalParticipants: 28, status: 'Completed' },
  { id: 'TS006', sessionId: 'SES-006', trainingId: 'TP008', trainingTitle: 'IoT & Embedded Bootcamp', sessionNo: 1, date: '2025-02-10', startTime: '09:00', endTime: '18:00', trainer: 'Dr. Mohammed Irfan Khan', venue: 'Electronics Lab', topic: 'Arduino & Microcontroller Basics', attendanceCount: 24, totalParticipants: 24, status: 'Completed' },
  { id: 'TS007', sessionId: 'SES-007', trainingId: 'TP008', trainingTitle: 'IoT & Embedded Bootcamp', sessionNo: 2, date: '2025-02-11', startTime: '09:00', endTime: '18:00', trainer: 'Dr. Mohammed Irfan Khan', venue: 'Electronics Lab', topic: 'Raspberry Pi & Linux for IoT', attendanceCount: 23, totalParticipants: 24, status: 'Completed' },
  { id: 'TS008', sessionId: 'SES-008', trainingId: 'TP008', trainingTitle: 'IoT & Embedded Bootcamp', sessionNo: 3, date: '2025-02-12', startTime: '09:00', endTime: '18:00', trainer: 'Dr. Mohammed Irfan Khan', venue: 'Electronics Lab', topic: 'Sensor Integration & Data Acquisition', attendanceCount: 22, totalParticipants: 24, status: 'Ongoing', remarks: 'Lab exercise ongoing' },
];

// ─── Attendance ───────────────────────────────────────────────────────────────

export const trainingAttendance: TrainingAttendance[] = [
  { id: 'A001', participantId: 'EMP-1201', participantName: 'Dr. Amrita Nair', department: 'CSE', designation: 'Asst. Professor', sessionId: 'SES-001', trainingTitle: 'FDP on AI & ML', date: '2024-07-15', punchIn: '08:52', punchOut: '13:05', status: 'Present' },
  { id: 'A002', participantId: 'EMP-1302', participantName: 'Prof. Girish Patil', department: 'IT', designation: 'Associate Professor', sessionId: 'SES-001', trainingTitle: 'FDP on AI & ML', date: '2024-07-15', punchIn: '09:12', punchOut: '13:10', status: 'Late' },
  { id: 'A003', participantId: 'EMP-2115', participantName: 'Dr. Sunita Mishra', department: 'Mathematics', designation: 'Professor', sessionId: 'SES-001', trainingTitle: 'FDP on AI & ML', date: '2024-07-15', punchIn: '08:58', punchOut: '13:00', status: 'Present' },
  { id: 'A004', participantId: 'EMP-3021', participantName: 'Mr. Rajan Tiwari', department: 'Physics', designation: 'Asst. Professor', sessionId: 'SES-001', trainingTitle: 'FDP on AI & ML', date: '2024-07-15', punchIn: '—', punchOut: '—', status: 'Absent', remarks: 'Medical emergency' },
  { id: 'A005', participantId: 'EMP-4056', participantName: 'Dr. Kavitha Ramachandran', department: 'Chemistry', designation: 'Associate Professor', sessionId: 'SES-001', trainingTitle: 'FDP on AI & ML', date: '2024-07-15', punchIn: '09:00', punchOut: '13:02', status: 'Present' },
  { id: 'A006', participantId: 'EMP-1201', participantName: 'Dr. Amrita Nair', department: 'CSE', designation: 'Asst. Professor', sessionId: 'SES-006', trainingTitle: 'IoT & Embedded Bootcamp', date: '2025-02-10', punchIn: '08:50', punchOut: '18:05', status: 'Present' },
  { id: 'A007', participantId: 'EMP-5012', participantName: 'Dr. Pranav Desai', department: 'ECE', designation: 'Professor', sessionId: 'SES-006', trainingTitle: 'IoT & Embedded Bootcamp', date: '2025-02-10', punchIn: '09:05', punchOut: '18:00', status: 'Present' },
  { id: 'A008', participantId: 'EMP-1042', participantName: 'Dr. Rajesh Kumar Sharma', department: 'CSE', designation: 'Professor & Head', sessionId: 'SES-001', trainingTitle: 'FDP on AI & ML', date: '2024-07-15', punchIn: '08:45', punchOut: '13:15', status: 'Present', remarks: 'Good session' },
  { id: 'A009', participantId: 'EMP-1042', participantName: 'Dr. Rajesh Kumar Sharma', department: 'CSE', designation: 'Professor & Head', sessionId: 'SES-004', trainingTitle: 'Cybersecurity Workshop', date: '2024-08-05', punchIn: '09:55', punchOut: '16:10', status: 'Present' },
];

// ─── Competencies ─────────────────────────────────────────────────────────────

export const competencies: Competency[] = [
  { id: 'C001', code: 'COMP-TEC-001', name: 'Programming & Software Development', category: 'Technical', description: 'Ability to develop software applications using modern programming languages.', levels: 5, applicableTo: ['CSE', 'IT', 'ECE'], status: 'Active' },
  { id: 'C002', code: 'COMP-TEC-002', name: 'Data Analysis & Research', category: 'Technical', description: 'Competency in statistical analysis, research design and data interpretation.', levels: 5, applicableTo: ['All Departments'], status: 'Active' },
  { id: 'C003', code: 'COMP-BEH-001', name: 'Communication & Interpersonal Skills', category: 'Behavioral', description: 'Effective oral and written communication, active listening and interpersonal ability.', levels: 4, applicableTo: ['All Departments'], status: 'Active' },
  { id: 'C004', code: 'COMP-LED-001', name: 'Leadership & Team Management', category: 'Leadership', description: 'Ability to lead teams, manage projects and motivate stakeholders.', levels: 4, applicableTo: ['All Departments'], status: 'Active' },
  { id: 'C005', code: 'COMP-TEC-003', name: 'Emerging Technologies', category: 'Technical', description: 'Knowledge of AI, IoT, Blockchain, Cloud and other emerging technologies.', levels: 5, applicableTo: ['CSE', 'IT', 'ECE', 'ME'], status: 'Active' },
  { id: 'C006', code: 'COMP-DOM-001', name: 'Industry & Domain Expertise', category: 'Domain', description: 'Real-world industry experience and domain-specific technical knowledge.', levels: 4, applicableTo: ['All Departments'], status: 'Active' },
  { id: 'C007', code: 'COMP-FUN-001', name: 'Curriculum Design & OBE', category: 'Functional', description: 'Ability to design outcome-based curriculum aligned with NEP 2020 and AICTE norms.', levels: 4, applicableTo: ['All Departments'], status: 'Active' },
  { id: 'C008', code: 'COMP-TEC-004', name: 'Research & Publication', category: 'Technical', description: 'Capability to conduct research and publish in Scopus/WoS indexed journals.', levels: 5, applicableTo: ['All Departments'], status: 'Active' },
];

// ─── Competency Mappings ───────────────────────────────────────────────────────

export const competencyMappings: CompetencyMapping[] = [
  { id: 'CM001', employeeId: 'EMP-1201', employeeName: 'Dr. Amrita Nair', department: 'CSE', designation: 'Asst. Professor', competency: 'Emerging Technologies', requiredLevel: 4, currentLevel: 2, gap: 2, targetDate: '2025-06-30', status: 'Gap Identified' },
  { id: 'CM002', employeeId: 'EMP-1302', employeeName: 'Prof. Girish Patil', department: 'IT', designation: 'Associate Professor', competency: 'Research & Publication', requiredLevel: 4, currentLevel: 3, gap: 1, targetDate: '2025-03-31', status: 'In Progress' },
  { id: 'CM003', employeeId: 'EMP-2115', employeeName: 'Dr. Sunita Mishra', department: 'Mathematics', designation: 'Professor', competency: 'Data Analysis & Research', requiredLevel: 5, currentLevel: 5, gap: 0, targetDate: '2024-12-31', status: 'Achieved' },
  { id: 'CM004', employeeId: 'EMP-3021', employeeName: 'Mr. Rajan Tiwari', department: 'Physics', designation: 'Asst. Professor', competency: 'Curriculum Design & OBE', requiredLevel: 3, currentLevel: 1, gap: 2, targetDate: '2025-04-30', status: 'Gap Identified' },
  { id: 'CM005', employeeId: 'EMP-4056', employeeName: 'Dr. Kavitha Ramachandran', department: 'Chemistry', designation: 'Associate Professor', competency: 'Communication & Interpersonal Skills', requiredLevel: 4, currentLevel: 3, gap: 1, targetDate: '2025-02-28', status: 'In Progress' },
  { id: 'CM006', employeeId: 'EMP-5012', employeeName: 'Dr. Pranav Desai', department: 'ECE', designation: 'Professor', competency: 'Leadership & Team Management', requiredLevel: 4, currentLevel: 4, gap: 0, targetDate: '2024-11-30', status: 'Achieved' },
  { id: 'CM007', employeeId: 'EMP-6034', employeeName: 'Dr. Meena Joshi', department: 'Civil', designation: 'Asst. Professor', competency: 'Emerging Technologies', requiredLevel: 3, currentLevel: 1, gap: 2, targetDate: '2025-07-31', status: 'Not Started' },
  { id: 'CM008', employeeId: 'EMP-7088', employeeName: 'Prof. Anil Verma', department: 'MBA', designation: 'Associate Professor', competency: 'Industry & Domain Expertise', requiredLevel: 4, currentLevel: 3, gap: 1, targetDate: '2025-05-31', status: 'In Progress' },
  { id: 'CM009', employeeId: 'EMP-1042', employeeName: 'Dr. Rajesh Kumar Sharma', department: 'CSE', designation: 'Professor & Head', competency: 'Emerging Technologies', requiredLevel: 5, currentLevel: 3, gap: 2, targetDate: '2025-10-31', status: 'Gap Identified' },
  { id: 'CM010', employeeId: 'EMP-1042', employeeName: 'Dr. Rajesh Kumar Sharma', department: 'CSE', designation: 'Professor & Head', competency: 'Leadership & Team Management', requiredLevel: 5, currentLevel: 4, gap: 1, targetDate: '2025-08-15', status: 'In Progress' },
];

// ─── Assessments ──────────────────────────────────────────────────────────────

export const assessments: Assessment[] = [
  { id: 'AS001', assessmentId: 'ASMT-001', trainingId: 'TP001', trainingTitle: 'FDP on AI & ML', participantName: 'Dr. Amrita Nair', department: 'CSE', type: 'Quiz', maxMarks: 50, obtainedMarks: 44, passingMarks: 25, result: 'Pass', submittedOn: '2024-07-19', evaluatedBy: 'Dr. Rajesh Kumar Sharma' },
  { id: 'AS002', assessmentId: 'ASMT-002', trainingId: 'TP001', trainingTitle: 'FDP on AI & ML', participantName: 'Prof. Girish Patil', department: 'IT', type: 'Assignment', maxMarks: 100, obtainedMarks: 78, passingMarks: 50, result: 'Pass', submittedOn: '2024-07-20', evaluatedBy: 'Dr. Rajesh Kumar Sharma' },
  { id: 'AS003', assessmentId: 'ASMT-003', trainingId: 'TP001', trainingTitle: 'FDP on AI & ML', participantName: 'Dr. Sunita Mishra', department: 'Mathematics', type: 'Practical', maxMarks: 50, obtainedMarks: 48, passingMarks: 25, result: 'Pass', submittedOn: '2024-07-19', evaluatedBy: 'Dr. Rajesh Kumar Sharma' },
  { id: 'AS004', assessmentId: 'ASMT-004', trainingId: 'TP002', trainingTitle: 'Cybersecurity Workshop', participantName: 'Mr. Vivek Sinha', department: 'CSE', type: 'Practical', maxMarks: 50, obtainedMarks: 38, passingMarks: 25, result: 'Pass', submittedOn: '2024-08-07', evaluatedBy: 'Dr. Priya Venkataraman' },
  { id: 'AS005', assessmentId: 'ASMT-005', trainingId: 'TP002', trainingTitle: 'Cybersecurity Workshop', participantName: 'Dr. Rohan Mehta', department: 'IT', type: 'Quiz', maxMarks: 50, obtainedMarks: 22, passingMarks: 25, result: 'Fail', submittedOn: '2024-08-07', evaluatedBy: 'Dr. Priya Venkataraman' },
  { id: 'AS006', assessmentId: 'ASMT-006', trainingId: 'TP007', trainingTitle: 'Communication Skills Workshop', participantName: 'Dr. Kavitha Ramachandran', department: 'Chemistry', type: 'Presentation', maxMarks: 50, obtainedMarks: 42, passingMarks: 25, result: 'Pass', submittedOn: '2025-01-22', evaluatedBy: 'Ms. Ritu Sharma Agarwal' },
];

// ─── Feedback ────────────────────────────────────────────────────────────────

export const feedbackRecords: FeedbackRecord[] = [
  { id: 'FB001', trainingId: 'TP001', trainingTitle: 'FDP on AI & ML', participantName: 'Dr. Amrita Nair', department: 'CSE', trainerName: 'Dr. Rajesh Kumar Sharma', date: '2024-07-19', sessionRating: 5, trainerRating: 5, communicationRating: 5, knowledgeRating: 5, practicalRating: 4, contentQuality: 5, overallRating: 4.8, suggestions: 'More hands-on projects required', comments: 'Excellent training. Very well structured and relevant to current industry needs.' },
  { id: 'FB002', trainingId: 'TP001', trainingTitle: 'FDP on AI & ML', participantName: 'Prof. Girish Patil', department: 'IT', trainerName: 'Dr. Rajesh Kumar Sharma', date: '2024-07-19', sessionRating: 4, trainerRating: 5, communicationRating: 4, knowledgeRating: 5, practicalRating: 4, contentQuality: 4, overallRating: 4.3, suggestions: 'Include more real-world case studies', comments: 'Good content coverage. Would benefit from more practical exercises.' },
  { id: 'FB003', trainingId: 'TP002', trainingTitle: 'Cybersecurity Workshop', participantName: 'Mr. Vivek Sinha', department: 'CSE', trainerName: 'Dr. Priya Venkataraman', date: '2024-08-07', sessionRating: 5, trainerRating: 5, communicationRating: 5, knowledgeRating: 5, practicalRating: 5, contentQuality: 5, overallRating: 5.0, suggestions: 'None, perfect workshop!', comments: 'Outstanding hands-on experience. The trainer is excellent and very knowledgeable.' },
  { id: 'FB004', trainingId: 'TP004', trainingTitle: 'NEP 2020 Workshop', participantName: 'Dr. Sunita Mishra', department: 'Mathematics', trainerName: 'Dr. Anjali Singh Patel', date: '2024-10-03', sessionRating: 4, trainerRating: 4, communicationRating: 5, knowledgeRating: 4, practicalRating: 3, contentQuality: 4, overallRating: 4.0, suggestions: 'Include more department-specific examples', comments: 'Very informative about NEP 2020 guidelines.' },
  { id: 'FB005', trainingId: 'TP007', trainingTitle: 'Communication Skills Workshop', participantName: 'Dr. Kavitha Ramachandran', department: 'Chemistry', trainerName: 'Ms. Ritu Sharma Agarwal', date: '2025-01-22', sessionRating: 5, trainerRating: 5, communicationRating: 5, knowledgeRating: 5, practicalRating: 5, contentQuality: 5, overallRating: 5.0, suggestions: 'Continue with advanced sessions', comments: 'Transformational training experience. Changed the way I present in class.' },
];

// ─── Certificates ────────────────────────────────────────────────────────────

export const certificates: Certificate[] = [
  { id: 'CERT001', certificateNo: 'TDM-CERT-2024-0001', participantId: 'EMP-1201', participantName: 'Dr. Amrita Nair', department: 'Computer Science & Engineering', trainingId: 'TP001', trainingTitle: 'Faculty Development Programme on AI & Machine Learning', trainerId: 'T001', trainerName: 'Dr. Rajesh Kumar Sharma', issueDate: '2024-07-25', status: 'Issued', verificationUrl: 'https://verify.university.edu/TDM-CERT-2024-0001', type: 'Completion' },
  { id: 'CERT002', certificateNo: 'TDM-CERT-2024-0002', participantId: 'EMP-1302', participantName: 'Prof. Girish Patil', department: 'Information Technology', trainingId: 'TP001', trainingTitle: 'Faculty Development Programme on AI & Machine Learning', trainerId: 'T001', trainerName: 'Dr. Rajesh Kumar Sharma', issueDate: '2024-07-25', status: 'Issued', verificationUrl: 'https://verify.university.edu/TDM-CERT-2024-0002', type: 'Completion' },
  { id: 'CERT003', certificateNo: 'TDM-CERT-2024-0003', participantId: 'EMP-2115', participantName: 'Dr. Sunita Mishra', department: 'Mathematics & Statistics', trainingId: 'TP001', trainingTitle: 'Faculty Development Programme on AI & Machine Learning', trainerId: 'T001', trainerName: 'Dr. Rajesh Kumar Sharma', issueDate: '2024-07-25', status: 'Issued', verificationUrl: 'https://verify.university.edu/TDM-CERT-2024-0003', type: 'Excellence' },
  { id: 'CERT004', certificateNo: 'TDM-CERT-2024-0042', participantId: 'EMP-1201', participantName: 'Dr. Amrita Nair', department: 'Computer Science & Engineering', trainingId: 'TP002', trainingTitle: 'Cybersecurity Awareness & Ethical Hacking Workshop', trainerId: 'T002', trainerName: 'Dr. Priya Venkataraman', issueDate: '2024-08-10', status: 'Issued', verificationUrl: 'https://verify.university.edu/TDM-CERT-2024-0042', type: 'Completion' },
  { id: 'CERT005', certificateNo: 'TDM-CERT-2024-0121', participantId: 'EMP-4056', participantName: 'Dr. Kavitha Ramachandran', department: 'Chemistry', trainingId: 'TP004', trainingTitle: 'NEP 2020 Implementation Workshop', trainerId: 'T004', trainerName: 'Dr. Anjali Singh Patel', issueDate: '2024-10-05', expiryDate: '2026-10-05', status: 'Issued', verificationUrl: 'https://verify.university.edu/TDM-CERT-2024-0121', type: 'Completion' },
  { id: 'CERT006', certificateNo: 'TDM-CERT-2024-0200', participantId: 'EMP-3021', participantName: 'Mr. Rajan Tiwari', department: 'Physics', trainingId: 'TP005', trainingTitle: 'Research Methodology & Publication Skills', trainerId: 'T007', trainerName: 'Dr. Lakshmi Devi Krishnamurthy', issueDate: '2024-11-25', status: 'Issued', verificationUrl: 'https://verify.university.edu/TDM-CERT-2024-0200', type: 'Participation' },
  { id: 'CERT007', certificateNo: 'TDM-CERT-2025-0015', participantId: 'EXT-001', participantName: 'Mr. Vikram Anand Mehta', department: 'External', trainingId: 'TP006', trainingTitle: 'Blockchain & Web3 Technology Workshop', trainerId: 'T006', trainerName: 'Mr. Vikram Anand Mehta', issueDate: '2024-12-12', status: 'Issued', verificationUrl: 'https://verify.university.edu/TDM-CERT-2025-0015', type: 'Appreciation' },
  { id: 'CERT008', certificateNo: 'TDM-CERT-2024-1042', participantId: 'EMP-1042', participantName: 'Dr. Rajesh Kumar Sharma', department: 'Computer Science & Engineering', trainingId: 'TP001', trainingTitle: 'Faculty Development Programme on AI & Machine Learning', trainerId: 'T001', trainerName: 'Dr. Rajesh Kumar Sharma', issueDate: '2024-07-25', status: 'Issued', verificationUrl: 'https://verify.university.edu/TDM-CERT-2024-1042', type: 'Excellence' },
  { id: 'CERT009', certificateNo: 'TDM-CERT-2024-1043', participantId: 'EMP-1042', participantName: 'Dr. Rajesh Kumar Sharma', department: 'Computer Science & Engineering', trainingId: 'TP002', trainingTitle: 'Cybersecurity Awareness & Ethical Hacking Workshop', trainerId: 'T002', trainerName: 'Dr. Priya Venkataraman', issueDate: '2024-08-10', status: 'Issued', verificationUrl: 'https://verify.university.edu/TDM-CERT-2024-1043', type: 'Completion' },
];

// ─── Approval Requests ────────────────────────────────────────────────────────

export const approvalRequests: ApprovalRequest[] = [
  { id: 'APR001', requestNo: 'APR-2025-001', type: 'Training Approval', title: 'Advanced Python FDP — Approval', requestedBy: 'Dr. Rajesh Kumar Sharma', requestedDate: '2025-03-15', department: 'CSE', currentApprover: 'Principal', level: 2, totalLevels: 3, status: 'Pending', amount: 110000 },
  { id: 'APR002', requestNo: 'APR-2025-002', type: 'Trainer Approval', title: 'External Trainer — Dr. Sunil Kapoor (AI Expert)', requestedBy: 'Training Coordinator', requestedDate: '2025-03-18', department: 'All', currentApprover: 'Director Academics', level: 1, totalLevels: 2, status: 'Pending' },
  { id: 'APR003', requestNo: 'APR-2025-003', type: 'Budget Approval', title: 'AICTE Robotics FDP Budget Allocation', requestedBy: 'Prof. Suresh Babu Naidu', requestedDate: '2025-03-20', department: 'Mechanical Engineering', currentApprover: 'Finance Committee', level: 3, totalLevels: 3, status: 'Pending', amount: 150000 },
  { id: 'APR004', requestNo: 'APR-2025-004', type: 'Certificate Approval', title: 'Bulk Certificate Generation — NAAC FDP', requestedBy: 'IQAC Coordinator', requestedDate: '2025-03-10', department: 'All', currentApprover: 'Registrar', level: 1, totalLevels: 2, status: 'Approved', approvedBy: 'Registrar', remarks: 'Approved. Certificate template verified.' },
  { id: 'APR005', requestNo: 'APR-2025-005', type: 'Completion Approval', title: 'IoT Bootcamp — Completion Certificate', requestedBy: 'Dr. Mohammed Irfan Khan', requestedDate: '2025-02-15', department: 'ECE', currentApprover: 'Dean Academics', level: 2, totalLevels: 2, status: 'Approved', remarks: 'Approved with commendation.' },
  { id: 'APR006', requestNo: 'APR-2025-006', type: 'Budget Approval', title: 'Communication Skills Workshop — Honorarium', requestedBy: 'Training Cell', requestedDate: '2025-01-25', department: 'All', currentApprover: 'Accounts', level: 2, totalLevels: 2, status: 'Rejected', remarks: 'Exceeds quarterly training budget. Resubmit next quarter.' },
];

// ─── Training Categories ───────────────────────────────────────────────────────

export const trainingCategories: TrainingCategory[] = [
  { id: 'TC001', code: 'FDP', name: 'Faculty Development Programme', description: 'AICTE/UGC approved FDPs for teaching faculty.', icon: 'school', status: 'Active' },
  { id: 'TC002', code: 'TECH', name: 'Technical Skill Enhancement', description: 'Technical workshops to upgrade domain and software skills.', icon: 'computer', status: 'Active' },
  { id: 'TC003', code: 'SOFT', name: 'Soft Skills & Communication', description: 'Personality development, communication and leadership training.', icon: 'record_voice_over', status: 'Active' },
  { id: 'TC004', code: 'RES', name: 'Research & Publication', description: 'Research methodology, paper writing and journal publication skills.', icon: 'science', status: 'Active' },
  { id: 'TC005', code: 'NAAC', name: 'NAAC / Accreditation', description: 'Training on NAAC criteria, documentation and quality practices.', icon: 'verified', status: 'Active' },
  { id: 'TC006', code: 'AICTE', name: 'AICTE Mandated Training', description: 'Mandatory AICTE training programmes for technical institutions.', icon: 'account_balance', status: 'Active' },
  { id: 'TC007', code: 'IND', name: 'Industry Exposure', description: 'Industry visits, guest lectures, and corporate training.', icon: 'factory', status: 'Active' },
  { id: 'TC008', code: 'EMERG', name: 'Emerging Technologies', description: 'AI, Blockchain, IoT, AR/VR and next-generation technologies.', icon: 'memory', status: 'Active' },
  { id: 'TC009', code: 'POLICY', name: 'Policy & Compliance', description: 'NEP 2020, POSH, RTI, and governance training.', icon: 'policy', status: 'Active' },
  { id: 'TC010', code: 'LEAD', name: 'Leadership Development', description: 'Middle management and academic leadership programmes.', icon: 'groups', status: 'Active' },
];

// ─── Training Modes ──────────────────────────────────────────────────────────

export const trainingModes: TrainingMode[] = [
  { id: 'TM001', code: 'ONL', name: 'Online', description: 'Fully online via Teams/Zoom', attendanceType: 'Online Tracking', status: 'Active' },
  { id: 'TM002', code: 'OFF', name: 'Offline', description: 'In-person physical attendance required', attendanceType: 'QR Code', status: 'Active' },
  { id: 'TM003', code: 'HYB', name: 'Hybrid', description: 'Both physical and online modes', attendanceType: 'Hybrid', status: 'Active' },
];

// ─── Certification Masters ───────────────────────────────────────────────────

export const certificationMasters: CertificationMaster[] = [
  { id: 'CM001', code: 'CERT-COMP', name: 'Completion Certificate', validityMonths: 60, templateType: 'Standard', approvalRequired: false, status: 'Active' },
  { id: 'CM002', code: 'CERT-EXC', name: 'Certificate of Excellence', validityMonths: 120, templateType: 'Custom', approvalRequired: true, status: 'Active' },
  { id: 'CM003', code: 'CERT-PART', name: 'Participation Certificate', validityMonths: 24, templateType: 'Standard', approvalRequired: false, status: 'Active' },
  { id: 'CM004', code: 'CERT-APP', name: 'Letter of Appreciation', validityMonths: 120, templateType: 'Custom', approvalRequired: true, status: 'Active' },
];

// ─── Venue Masters ────────────────────────────────────────────────────────────

export const venueMasters: VenueMaster[] = [
  { id: 'V001', code: 'SHA', name: 'Seminar Hall A', building: 'Block-3', room: '301', capacity: 80, facilities: ['Projector', 'Wi-Fi', 'AC', 'Audio System', 'Podium'], status: 'Available' },
  { id: 'V002', code: 'SHB', name: 'Seminar Hall B', building: 'Library Block', room: 'Ground Floor', capacity: 60, facilities: ['Projector', 'Wi-Fi', 'AC', 'Whiteboard'], status: 'Occupied' },
  { id: 'V003', code: 'CONF', name: 'Conference Hall', building: 'Administrative Block', room: '201', capacity: 120, facilities: ['Projector', 'Wi-Fi', 'AC', 'Video Conferencing', 'Stage', 'Recording'], status: 'Available' },
  { id: 'V004', code: 'AUD', name: 'Main Auditorium', building: 'Main Block', room: 'Ground Floor', capacity: 500, facilities: ['Stage', 'AC', 'Sound System', 'Projector', 'Live Stream'], status: 'Available' },
  { id: 'V005', code: 'LAB1', name: 'Computer Lab-1', building: 'Block-1', room: '105', capacity: 40, facilities: ['60 PCs', 'Wi-Fi', 'AC', 'Projector', 'UPS'], status: 'Available' },
  { id: 'V006', code: 'LAB2', name: 'Computer Lab-2', building: 'Block-1', room: '106', capacity: 40, facilities: ['60 PCs', 'Wi-Fi', 'AC', 'Linux/Windows', 'Server'], status: 'Available' },
  { id: 'V007', code: 'INNO', name: 'Innovation Lab', building: 'Block-5', room: '001', capacity: 35, facilities: ['3D Printers', 'PCB Lab', 'IoT Equipment', 'Drone Bay', 'VR Kits'], status: 'Available' },
  { id: 'V008', code: 'ELAB', name: 'Electronics Lab', building: 'Block-2', room: '301', capacity: 25, facilities: ['Oscilloscopes', 'Function Generators', 'PCB Tools', 'Arduino Kits', 'IoT Boards'], status: 'Under Maintenance' },
];

// ─── Honorarium ───────────────────────────────────────────────────────────────

export const honorariumRecords: Honorarium[] = [
  { id: 'HON001', trainerId: 'T006', trainerName: 'Mr. Vikram Anand Mehta', trainingId: 'TP006', trainingTitle: 'Blockchain & Web3 Workshop', sessions: 4, ratePerSession: 8000, totalAmount: 32000, tdsDeducted: 3200, netPayable: 28800, paymentDate: '2024-12-15', status: 'Paid', bankAccount: 'HDFC XXXX 4521' },
  { id: 'HON002', trainerId: 'T008', trainerName: 'Ms. Ritu Sharma Agarwal', trainingId: 'TP007', trainingTitle: 'Communication Skills Workshop', sessions: 6, ratePerSession: 6000, totalAmount: 36000, tdsDeducted: 3600, netPayable: 32400, status: 'Processed', bankAccount: 'SBI XXXX 8832' },
  { id: 'HON003', trainerId: 'T006', trainerName: 'Mr. Vikram Anand Mehta', trainingId: 'TP010', trainingTitle: 'Advanced Python FDP', sessions: 5, ratePerSession: 8000, totalAmount: 40000, tdsDeducted: 4000, netPayable: 36000, status: 'Pending', bankAccount: 'HDFC XXXX 4521' },
];

// ─── Monthly Training Trend ───────────────────────────────────────────────────

export const monthlyTrainingTrend = [
  { month: 'Jul', offline: 2, online: 1, hybrid: 0 },
  { month: 'Aug', offline: 1, online: 1, hybrid: 1 },
  { month: 'Sep', offline: 2, online: 0, hybrid: 0 },
  { month: 'Oct', offline: 0, online: 2, hybrid: 0 },
  { month: 'Nov', offline: 2, online: 0, hybrid: 1 },
  { month: 'Dec', offline: 1, online: 0, hybrid: 1 },
  { month: 'Jan', offline: 0, online: 1, hybrid: 2 },
  { month: 'Feb', offline: 1, online: 1, hybrid: 0 },
  { month: 'Mar', offline: 1, online: 2, hybrid: 0 },
];

// ─── Department-wise Training ─────────────────────────────────────────────────

export const departmentWiseTraining = [
  { dept: 'CSE', count: 18, color: '#3b82f6' },
  { dept: 'IT', count: 14, color: '#8b5cf6' },
  { dept: 'ME', count: 12, color: '#f59e0b' },
  { dept: 'ECE', count: 10, color: '#10b981' },
  { dept: 'MBA', count: 9, color: '#ef4444' },
  { dept: 'Math', count: 8, color: '#06b6d4' },
  { dept: 'Civil', count: 6, color: '#f97316' },
  { dept: 'Physics', count: 5, color: '#84cc16' },
];

// ─── Certification Status ──────────────────────────────────────────────────────

export const certificationStatus = [
  { label: 'Issued', count: 187, pct: 62, color: '#16a34a' },
  { label: 'Pending', count: 45, pct: 15, color: '#f59e0b' },
  { label: 'Expired', count: 38, pct: 13, color: '#ef4444' },
  { label: 'Renewed', count: 31, pct: 10, color: '#3b82f6' },
];

// ─── Faculty my training data (for current user: Dr. Amrita Nair) ─────────────

export const MY_FACULTY = {
  id: 'EMP-1201',
  name: 'Dr. Amrita Nair',
  designation: 'Assistant Professor',
  department: 'Computer Science & Engineering',
  email: 'amrita.nair@university.edu',
  mobile: '9876501234',
  qualification: 'Ph.D (CS), M.Tech (AI), B.Tech',
  experience: 8,
  teachingExperience: 8,
  industryExperience: 2,
  specialization: ['Machine Learning', 'Algorithms', 'Python', 'DBMS'],
  skills: ['Python', 'Machine Learning', 'DBMS', 'Java', 'Data Structures'],
  languages: ['English', 'Hindi', 'Malayalam'],
  publications: 7,
  certifications: ['AWS Cloud Practitioner', 'Google Data Analytics'],
  rating: 4.6,
  trainingHours: 128,
  completedTrainings: 6,
};

// ─── External Trainer (current user: Mr. Vikram Anand Mehta) ─────────────────

export const MY_EXTERNAL_TRAINER = trainers[5]; // Vikram Mehta
