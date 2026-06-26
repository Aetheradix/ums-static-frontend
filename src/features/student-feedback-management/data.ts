export interface FeedbackSession {
  id: string;
  sessionName: string;
  academicYear: string;
  semesters: string[];
  departments: string[];
  programmes: string[];
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Scheduled' | 'Published' | 'Open' | 'Closed' | 'Archived';
  isAnonymous: boolean;
  responseCount: number;
  targetCount: number;
  templateId: string;
}

export interface FeedbackQuestion {
  id: string;
  templateId: string;
  question: string;
  category: string;
  questionType: 'Rating' | 'Yes/No' | 'Text' | 'Paragraph' | 'MCQ';
  options: string[];
  ratingScale: number;
  isMandatory: boolean;
  status: 'Active' | 'Archived';
}

export interface FeedbackTemplate {
  id: string;
  name: string;
  questionCount: number;
  version: number;
  status: 'Draft' | 'Published' | 'Archived';
  lastUpdated: string;
}

export interface FeedbackAssignment {
  id: string;
  academicYear: string;
  semester: string;
  department: string;
  programme: string;
  section: string;
  course: string;
  faculty: string;
  templateId: string;
  studentsCount: number;
}

export interface StudentResponse {
  id: string;
  sessionId: string;
  studentId: string;
  department: string;
  programme: string;
  faculty: string;
  course: string;
  submittedOn: string;
  completionStatus: 'Completed' | 'Partial' | 'Pending';
}

export interface NotificationTemplate {
  id: string;
  event: 'Feedback Open' | 'Reminder' | 'Last Reminder' | 'Feedback Closed';
  subject: string;
  body: string;
  emailEnabled: boolean;
  erpEnabled: boolean;
}

export interface FeedbackSettings {
  anonymousEnabled: boolean;
  draftSave: boolean;
  autoSubmitOnEndDate: boolean;
  studentCanEditBeforeDeadline: boolean;
  showProgressBar: boolean;
  ratingScale: 5 | 10;
  oneSubmissionOnly: boolean;
  allowResume: boolean;
  autoSave: boolean;
}

export const feedbackSessions: FeedbackSession[] = [
  {
    id: 'S1',
    sessionName: 'Faculty Feedback Odd 2024-25',
    academicYear: '2024-25',
    semesters: ['3', '5', '7'],
    departments: ['Computer Science', 'Electronics'],
    programmes: ['B.Tech'],
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    status: 'Open',
    isAnonymous: true,
    responseCount: 342,
    targetCount: 500,
    templateId: 'T1',
  },
  {
    id: 'S2',
    sessionName: 'Course Feedback Even 2024-25',
    academicYear: '2024-25',
    semesters: ['2', '4', '6'],
    departments: ['Electronics'],
    programmes: ['B.Tech'],
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    status: 'Draft',
    isAnonymous: false,
    responseCount: 0,
    targetCount: 400,
    templateId: 'T2',
  },
  {
    id: 'S3',
    sessionName: 'Infrastructure Feedback 2024',
    academicYear: '2024-25',
    semesters: ['1', '2', '3', '4', '5', '6', '7', '8'],
    departments: ['Computer Science', 'Electronics', 'Mechanical', 'Civil'],
    programmes: ['B.Tech', 'M.Tech'],
    startDate: '2024-11-01',
    endDate: '2024-12-15',
    status: 'Closed',
    isAnonymous: true,
    responseCount: 189,
    targetCount: 200,
    templateId: 'T3',
  },
  {
    id: 'S4',
    sessionName: 'Lab Facilities Feedback',
    academicYear: '2024-25',
    semesters: ['3', '5', '7'],
    departments: ['Mechanical'],
    programmes: ['B.Tech'],
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    status: 'Archived',
    isAnonymous: true,
    responseCount: 0,
    targetCount: 60,
    templateId: 'T1',
  },
  {
    id: 'S5',
    sessionName: 'Library Services Feedback 2025',
    academicYear: '2025-26',
    semesters: ['1', '3', '5', '7'],
    departments: [
      'Computer Science',
      'Electronics',
      'Mechanical',
      'Civil',
      'Electrical',
    ],
    programmes: ['B.Tech', 'M.Tech', 'BCA', 'MCA'],
    startDate: '2025-04-01',
    endDate: '2025-04-30',
    status: 'Scheduled',
    isAnonymous: true,
    responseCount: 0,
    targetCount: 1000,
    templateId: 'T4',
  },
  {
    id: 'S6',
    sessionName: 'Faculty Feedback Even 2024-25',
    academicYear: '2024-25',
    semesters: ['2', '4', '6'],
    departments: ['Computer Science'],
    programmes: ['B.Tech'],
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    status: 'Published',
    isAnonymous: false,
    responseCount: 0,
    targetCount: 450,
    templateId: 'T2',
  },
];

export const feedbackQuestions: FeedbackQuestion[] = [
  {
    id: 'Q1',
    templateId: 'T1',
    question: 'Rate the overall teaching quality.',
    category: 'Teaching',
    questionType: 'Rating',
    options: [],
    ratingScale: 5,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q2',
    templateId: 'T1',
    question: 'Is the faculty punctual?',
    category: 'Discipline',
    questionType: 'Yes/No',
    options: ['Yes', 'No'],
    ratingScale: 0,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q3',
    templateId: 'T1',
    question: 'Which areas need improvement?',
    category: 'Course Delivery',
    questionType: 'MCQ',
    options: ['Pacing', 'Clarity', 'Examples', 'Interaction', 'Assessment'],
    ratingScale: 0,
    isMandatory: false,
    status: 'Active',
  },
  {
    id: 'Q4',
    templateId: 'T1',
    question: 'Suggest any improvements for the faculty.',
    category: 'General',
    questionType: 'Paragraph',
    options: [],
    ratingScale: 0,
    isMandatory: false,
    status: 'Active',
  },
  {
    id: 'Q5',
    templateId: 'T1',
    question: 'How would you rate the course content relevance?',
    category: 'Curriculum',
    questionType: 'Rating',
    options: [],
    ratingScale: 5,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q6',
    templateId: 'T2',
    question: 'Rate the lab infrastructure.',
    category: 'Infrastructure',
    questionType: 'Rating',
    options: [],
    ratingScale: 5,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q7',
    templateId: 'T2',
    question: 'Is the lab equipment adequate?',
    category: 'Infrastructure',
    questionType: 'Yes/No',
    options: ['Yes', 'No'],
    ratingScale: 0,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q8',
    templateId: 'T2',
    question: 'Describe your overall lab experience.',
    category: 'General',
    questionType: 'Paragraph',
    options: [],
    ratingScale: 0,
    isMandatory: false,
    status: 'Active',
  },
  {
    id: 'Q9',
    templateId: 'T2',
    question: 'Which lab equipment needs upgrade?',
    category: 'Infrastructure',
    questionType: 'MCQ',
    options: [
      'Oscilloscopes',
      'Workstations',
      'Software Licenses',
      'Networking Gear',
      'Measurement Tools',
    ],
    ratingScale: 0,
    isMandatory: false,
    status: 'Active',
  },
  {
    id: 'Q10',
    templateId: 'T3',
    question: 'Rate the campus cleanliness.',
    category: 'Infrastructure',
    questionType: 'Rating',
    options: [],
    ratingScale: 5,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q11',
    templateId: 'T3',
    question: 'Which facility needs immediate attention?',
    category: 'Facilities',
    questionType: 'MCQ',
    options: [
      'Restrooms',
      'Cafeteria',
      'Parking',
      'Classrooms',
      'Sports Complex',
    ],
    ratingScale: 0,
    isMandatory: false,
    status: 'Active',
  },
  {
    id: 'Q12',
    templateId: 'T3',
    question: 'Rate the cafeteria food quality.',
    category: 'Facilities',
    questionType: 'Rating',
    options: [],
    ratingScale: 5,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q13',
    templateId: 'T3',
    question: 'Additional comments on infrastructure.',
    category: 'General',
    questionType: 'Text',
    options: [],
    ratingScale: 0,
    isMandatory: false,
    status: 'Active',
  },
  {
    id: 'Q14',
    templateId: 'T4',
    question: 'Rate the library resources.',
    category: 'Library',
    questionType: 'Rating',
    options: [],
    ratingScale: 5,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q15',
    templateId: 'T4',
    question: 'Is the library digital collection sufficient?',
    category: 'Library',
    questionType: 'Yes/No',
    options: ['Yes', 'No'],
    ratingScale: 0,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q16',
    templateId: 'T4',
    question: 'Suggest books or journals to add.',
    category: 'Library',
    questionType: 'Paragraph',
    options: [],
    ratingScale: 0,
    isMandatory: false,
    status: 'Active',
  },
  {
    id: 'Q17',
    templateId: 'T4',
    question: 'Rate the library timings.',
    category: 'Library',
    questionType: 'Rating',
    options: [],
    ratingScale: 5,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q18',
    templateId: 'T1',
    question: 'Rate the use of ICT tools in teaching.',
    category: 'Teaching',
    questionType: 'Rating',
    options: [],
    ratingScale: 5,
    isMandatory: false,
    status: 'Active',
  },
  {
    id: 'Q19',
    templateId: 'T2',
    question: 'Rate the industry relevance of the curriculum.',
    category: 'Curriculum',
    questionType: 'Rating',
    options: [],
    ratingScale: 5,
    isMandatory: true,
    status: 'Active',
  },
  {
    id: 'Q20',
    templateId: 'T4',
    question: 'Any other suggestions for the library.',
    category: 'General',
    questionType: 'Text',
    options: [],
    ratingScale: 0,
    isMandatory: false,
    status: 'Active',
  },
  {
    id: 'Q21',
    templateId: 'T1',
    question: 'How do you rate the availability of study materials?',
    category: 'Course Delivery',
    questionType: 'Rating',
    options: [],
    ratingScale: 5,
    isMandatory: true,
    status: 'Active',
  },
];

export const feedbackTemplates: FeedbackTemplate[] = [
  {
    id: 'T1',
    name: 'Faculty Feedback Template',
    questionCount: 7,
    version: 3,
    status: 'Published',
    lastUpdated: '2025-06-01',
  },
  {
    id: 'T2',
    name: 'Course & Lab Feedback Template',
    questionCount: 5,
    version: 2,
    status: 'Published',
    lastUpdated: '2025-02-15',
  },
  {
    id: 'T3',
    name: 'Infrastructure Feedback Template',
    questionCount: 4,
    version: 1,
    status: 'Archived',
    lastUpdated: '2024-10-25',
  },
  {
    id: 'T4',
    name: 'Library Services Feedback Template',
    questionCount: 5,
    version: 1,
    status: 'Draft',
    lastUpdated: '2025-04-10',
  },
];

export const feedbackAssignments: FeedbackAssignment[] = [
  {
    id: 'A1',
    academicYear: '2024-25',
    semester: '3',
    department: 'Computer Science',
    programme: 'B.Tech',
    section: 'A',
    course: 'Data Structures',
    faculty: 'Dr. Sharma',
    templateId: 'T1',
    studentsCount: 65,
  },
  {
    id: 'A2',
    academicYear: '2024-25',
    semester: '5',
    department: 'Computer Science',
    programme: 'B.Tech',
    section: 'B',
    course: 'Algorithms',
    faculty: 'Prof. Verma',
    templateId: 'T1',
    studentsCount: 62,
  },
  {
    id: 'A3',
    academicYear: '2024-25',
    semester: '4',
    department: 'Electronics',
    programme: 'B.Tech',
    section: 'A',
    course: 'VLSI Design',
    faculty: 'Dr. Patel',
    templateId: 'T2',
    studentsCount: 55,
  },
  {
    id: 'A4',
    academicYear: '2024-25',
    semester: '1',
    department: 'All',
    programme: 'All',
    section: '',
    course: 'Infrastructure',
    faculty: 'Admin',
    templateId: 'T3',
    studentsCount: 200,
  },
  {
    id: 'A5',
    academicYear: '2025-26',
    semester: '1',
    department: 'All',
    programme: 'All',
    section: '',
    course: 'Library',
    faculty: 'Librarian',
    templateId: 'T4',
    studentsCount: 1000,
  },
  {
    id: 'A6',
    academicYear: '2024-25',
    semester: '5',
    department: 'Computer Science',
    programme: 'B.Tech',
    section: 'A',
    course: 'Java Programming',
    faculty: 'Dr. Sharma',
    templateId: 'T1',
    studentsCount: 65,
  },
  {
    id: 'A7',
    academicYear: '2024-25',
    semester: '5',
    department: 'Computer Science',
    programme: 'B.Tech',
    section: 'A',
    course: 'DBMS',
    faculty: 'Dr. Singh',
    templateId: 'T1',
    studentsCount: 60,
  },
  {
    id: 'A8',
    academicYear: '2024-25',
    semester: '5',
    department: 'Computer Science',
    programme: 'B.Tech',
    section: 'A',
    course: 'Operating System',
    faculty: 'Dr. Khan',
    templateId: 'T1',
    studentsCount: 55,
  },
];

export const studentResponses: StudentResponse[] = [
  {
    id: 'R2',
    sessionId: 'S1',
    studentId: 'STU002',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Dr. Sharma',
    course: 'Data Structures',
    submittedOn: '2025-06-05',
    completionStatus: 'Completed',
  },
  {
    id: 'R3',
    sessionId: 'S1',
    studentId: 'STU003',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Prof. Verma',
    course: 'Algorithms',
    submittedOn: '2025-06-07',
    completionStatus: 'Partial',
  },
  {
    id: 'R4',
    sessionId: 'S1',
    studentId: 'STU004',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Prof. Verma',
    course: 'Algorithms',
    submittedOn: '',
    completionStatus: 'Pending',
  },
  {
    id: 'R5',
    sessionId: 'S1',
    studentId: 'STU005',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Dr. Sharma',
    course: 'Data Structures',
    submittedOn: '2025-06-08',
    completionStatus: 'Completed',
  },
  {
    id: 'R6',
    sessionId: 'S1',
    studentId: 'STU006',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Dr. Sharma',
    course: 'Data Structures',
    submittedOn: '',
    completionStatus: 'Pending',
  },
  {
    id: 'R7',
    sessionId: 'S3',
    studentId: 'STU010',
    department: 'Mechanical',
    programme: 'B.Tech',
    faculty: 'Admin',
    course: 'Infrastructure',
    submittedOn: '2024-11-15',
    completionStatus: 'Completed',
  },
  {
    id: 'R8',
    sessionId: 'S3',
    studentId: 'STU011',
    department: 'Electronics',
    programme: 'B.Tech',
    faculty: 'Admin',
    course: 'Infrastructure',
    submittedOn: '2024-11-20',
    completionStatus: 'Completed',
  },
  {
    id: 'R9',
    sessionId: 'S3',
    studentId: 'STU012',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Admin',
    course: 'Infrastructure',
    submittedOn: '2024-12-01',
    completionStatus: 'Completed',
  },
  {
    id: 'R10',
    sessionId: 'S3',
    studentId: 'STU013',
    department: 'Civil',
    programme: 'B.Tech',
    faculty: 'Admin',
    course: 'Infrastructure',
    submittedOn: '',
    completionStatus: 'Pending',
  },
  {
    id: 'R11',
    sessionId: 'S1',
    studentId: 'STU007',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Dr. Sharma',
    course: 'Data Structures',
    submittedOn: '2025-06-10',
    completionStatus: 'Completed',
  },
  {
    id: 'R12',
    sessionId: 'S1',
    studentId: 'STU008',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Prof. Verma',
    course: 'Algorithms',
    submittedOn: '2025-06-12',
    completionStatus: 'Completed',
  },
  {
    id: 'R13',
    sessionId: 'S1',
    studentId: 'STU009',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Prof. Verma',
    course: 'Algorithms',
    submittedOn: '',
    completionStatus: 'Pending',
  },
  {
    id: 'R14',
    sessionId: 'S3',
    studentId: 'STU014',
    department: 'Electronics',
    programme: 'B.Tech',
    faculty: 'Admin',
    course: 'Infrastructure',
    submittedOn: '2024-12-05',
    completionStatus: 'Completed',
  },
  {
    id: 'R15',
    sessionId: 'S3',
    studentId: 'STU015',
    department: 'Mechanical',
    programme: 'B.Tech',
    faculty: 'Admin',
    course: 'Infrastructure',
    submittedOn: '2024-12-10',
    completionStatus: 'Completed',
  },
  {
    id: 'R16',
    sessionId: 'S1',
    studentId: 'STU001',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Dr. Sharma',
    course: 'Java Programming',
    submittedOn: '',
    completionStatus: 'Pending',
  },
  {
    id: 'R17',
    sessionId: 'S1',
    studentId: 'STU001',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Dr. Singh',
    course: 'DBMS',
    submittedOn: '2025-06-25',
    completionStatus: 'Completed',
  },
  {
    id: 'R18',
    sessionId: 'S1',
    studentId: 'STU001',
    department: 'Computer Science',
    programme: 'B.Tech',
    faculty: 'Dr. Khan',
    course: 'Operating System',
    submittedOn: '',
    completionStatus: 'Partial',
  },
];

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'N1',
    event: 'Feedback Open',
    subject: 'New Feedback Form Available',
    body: 'A new feedback form "{sessionName}" is now open. Please submit your feedback before {endDate}.',
    emailEnabled: true,
    erpEnabled: true,
  },
  {
    id: 'N2',
    event: 'Reminder',
    subject: 'Reminder: Feedback Pending',
    body: 'This is a reminder to complete your pending feedback for "{sessionName}".',
    emailEnabled: true,
    erpEnabled: true,
  },
  {
    id: 'N3',
    event: 'Last Reminder',
    subject: 'Final Reminder: Feedback Closing Soon',
    body: 'The feedback "{sessionName}" will close on {endDate}. Please submit your responses before the deadline.',
    emailEnabled: true,
    erpEnabled: false,
  },
  {
    id: 'N4',
    event: 'Feedback Closed',
    subject: 'Feedback Form Closed',
    body: 'The feedback "{sessionName}" has been closed. Thank you for your participation.',
    emailEnabled: true,
    erpEnabled: true,
  },
];

export const feedbackSettings: FeedbackSettings = {
  anonymousEnabled: true,
  draftSave: true,
  autoSubmitOnEndDate: false,
  studentCanEditBeforeDeadline: true,
  showProgressBar: true,
  ratingScale: 5,
  oneSubmissionOnly: true,
  allowResume: false,
  autoSave: false,
};

export const departmentOptions = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'All',
];

export const programmeOptions = [
  'B.Tech',
  'M.Tech',
  'BCA',
  'MCA',
  'B.Sc',
  'M.Sc',
  'All',
];

export const semesterOptions = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
];

export const academicYearOptions = ['2023-24', '2024-25', '2025-26'];

export const sectionOptions = ['A', 'B', 'C', ''];

export const facultyOptions = [
  'Dr. Sharma',
  'Prof. Verma',
  'Dr. Patel',
  'Admin',
  'Librarian',
  'Dr. Gupta',
  'Prof. Singh',
  'Dr. Singh',
  'Dr. Khan',
];

export const courseOptions = [
  'Data Structures',
  'Algorithms',
  'VLSI Design',
  'Infrastructure',
  'Library',
  'Computer Networks',
  'DBMS',
  'Java Programming',
  'Operating System',
];
