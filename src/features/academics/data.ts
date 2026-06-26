export interface Programme {
  id: string;
  code: string;
  title: string;
  mode: string;
  level: string;
  totalCredits: number;
  duration: string;
  coordinator: string;
  status: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  type: string;
  programme: string;
  semester: string;
  evaluatorName: string;
  status: string;
}

export interface EnrolledStudent {
  id: string;
  rollNo: string;
  name: string;
  programme: string;
  batch: string;
  section: string;
  term: string;
  status: string;
}

export interface AcademicSession {
  id: string;
  name: string;
  academicYear: string;
  type: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface EvaluationComponent {
  id: string;
  name: string;
  course: string;
  weightage: number;
  maxMarks: number;
  evaluationType: string;
  status: string;
}

export interface GradingScale {
  id: string;
  grade: string;
  minMarks: number;
  maxMarks: number;
  gradePoints: number;
  description: string;
}

export interface StudentCourse {
  id: string;
  code: string;
  title: string;
  credits: number;
  faculty: string;
  semester: string;
  attendance: number;
  status: string;
}

export interface StudentGrade {
  id: string;
  courseCode: string;
  courseTitle: string;
  midTerm: number;
  endTerm: number;
  assignment: number;
  total: number;
  grade: string;
  gradePoints: number;
  status: string;
}

export interface FacultyCourse {
  id: string;
  code: string;
  title: string;
  programme: string;
  semester: string;
  totalStudents: number;
  enrolledCount: number;
  status: string;
}

export interface MarkEntryStudent {
  id: string;
  rollNo: string;
  name: string;
  midTermMarks: number;
  endTermMarks: number;
  assignmentMarks: number;
  totalMarks: number;
  grade: string;
}

export const programmes: Programme[] = [
  {
    id: '1',
    code: 'BTCS',
    title: 'B.Tech Computer Science',
    mode: 'Regular',
    level: 'UG',
    totalCredits: 160,
    duration: '4 Years',
    coordinator: 'Dr. Rajesh Tiwari',
    status: 'Active',
  },
  {
    id: '2',
    code: 'MTAI',
    title: 'M.Tech AI & ML',
    mode: 'Regular',
    level: 'PG',
    totalCredits: 80,
    duration: '2 Years',
    coordinator: 'Prof. Meera Krishnan',
    status: 'Active',
  },
  {
    id: '3',
    code: 'BCA',
    title: 'Bachelor of Computer Applications',
    mode: 'Regular',
    level: 'UG',
    totalCredits: 120,
    duration: '3 Years',
    coordinator: 'Dr. Suresh Kumar',
    status: 'Active',
  },
  {
    id: '4',
    code: 'MCA',
    title: 'Master of Computer Applications',
    mode: 'Regular',
    level: 'PG',
    totalCredits: 80,
    duration: '2 Years',
    coordinator: 'Dr. Pooja Gupta',
    status: 'Active',
  },
  {
    id: '5',
    code: 'BSPH',
    title: 'B.Sc Physics',
    mode: 'Regular',
    level: 'UG',
    totalCredits: 120,
    duration: '3 Years',
    coordinator: 'Prof. Vikram Patel',
    status: 'Active',
  },
  {
    id: '6',
    code: 'MBA',
    title: 'Master of Business Administration',
    mode: 'Regular',
    level: 'PG',
    totalCredits: 100,
    duration: '2 Years',
    coordinator: 'Dr. Ananya Singh',
    status: 'Active',
  },
  {
    id: '7',
    code: 'BCOM',
    title: 'Bachelor of Commerce',
    mode: 'Distance',
    level: 'UG',
    totalCredits: 120,
    duration: '3 Years',
    coordinator: 'Dr. Deepika Nair',
    status: 'Inactive',
  },
];

export const courses: Course[] = [
  {
    id: '1',
    code: 'CS101',
    title: 'Data Structures',
    credits: 4,
    type: 'Core',
    programme: 'B.Tech Computer Science',
    semester: '2',
    evaluatorName: 'Dr. Rajesh Tiwari',
    status: 'Active',
  },
  {
    id: '2',
    code: 'CS102',
    title: 'Algorithms',
    credits: 4,
    type: 'Core',
    programme: 'B.Tech Computer Science',
    semester: '3',
    evaluatorName: 'Prof. Meera Krishnan',
    status: 'Active',
  },
  {
    id: '3',
    code: 'CS201',
    title: 'Database Management Systems',
    credits: 3,
    type: 'Core',
    programme: 'B.Tech Computer Science',
    semester: '3',
    evaluatorName: 'Dr. Suresh Kumar',
    status: 'Active',
  },
  {
    id: '4',
    code: 'CS202',
    title: 'Operating Systems',
    credits: 3,
    type: 'Core',
    programme: 'B.Tech Computer Science',
    semester: '4',
    evaluatorName: 'Dr. Pooja Gupta',
    status: 'Active',
  },
  {
    id: '5',
    code: 'CS203',
    title: 'Computer Networks',
    credits: 3,
    type: 'Core',
    programme: 'B.Tech Computer Science',
    semester: '5',
    evaluatorName: 'Prof. Vikram Patel',
    status: 'Active',
  },
  {
    id: '6',
    code: 'AI301',
    title: 'Machine Learning',
    credits: 4,
    type: 'Core',
    programme: 'M.Tech AI & ML',
    semester: '1',
    evaluatorName: 'Dr. Ananya Singh',
    status: 'Active',
  },
  {
    id: '7',
    code: 'AI302',
    title: 'Artificial Intelligence',
    credits: 4,
    type: 'Core',
    programme: 'M.Tech AI & ML',
    semester: '1',
    evaluatorName: 'Dr. Karan Mehta',
    status: 'Active',
  },
  {
    id: '8',
    code: 'CS401',
    title: 'Software Engineering',
    credits: 3,
    type: 'Core',
    programme: 'B.Tech Computer Science',
    semester: '5',
    evaluatorName: 'Dr. Harsh Pandey',
    status: 'Active',
  },
  {
    id: '9',
    code: 'CS402',
    title: 'Web Technologies',
    credits: 3,
    type: 'Elective',
    programme: 'B.Tech Computer Science',
    semester: '6',
    evaluatorName: 'Dr. Divya Agarwal',
    status: 'Active',
  },
  {
    id: '10',
    code: 'MA101',
    title: 'Discrete Mathematics',
    credits: 4,
    type: 'Core',
    programme: 'B.Tech Computer Science',
    semester: '1',
    evaluatorName: 'Prof. Kavya Reddy',
    status: 'Active',
  },
];

export const enrolledStudents: EnrolledStudent[] = [
  {
    id: '1',
    rollNo: 'BTCS2401',
    name: 'Arjun Sharma',
    programme: 'B.Tech Computer Science',
    batch: '2024-28',
    section: 'A',
    term: '1',
    status: 'Enrolled',
  },
  {
    id: '2',
    rollNo: 'BTCS2402',
    name: 'Priya Verma',
    programme: 'B.Tech Computer Science',
    batch: '2024-28',
    section: 'A',
    term: '1',
    status: 'Enrolled',
  },
  {
    id: '3',
    rollNo: 'BTCS2403',
    name: 'Rohit Mishra',
    programme: 'B.Tech Computer Science',
    batch: '2024-28',
    section: 'B',
    term: '1',
    status: 'Enrolled',
  },
  {
    id: '4',
    rollNo: 'MTAI2401',
    name: 'Sneha Iyer',
    programme: 'M.Tech AI & ML',
    batch: '2024-26',
    section: 'A',
    term: '1',
    status: 'Enrolled',
  },
  {
    id: '5',
    rollNo: 'MTAI2402',
    name: 'Vikram Patel',
    programme: 'M.Tech AI & ML',
    batch: '2024-26',
    section: 'A',
    term: '1',
    status: 'Pending',
  },
  {
    id: '6',
    rollNo: 'BCA2401',
    name: 'Ananya Singh',
    programme: 'BCA',
    batch: '2024-27',
    section: 'A',
    term: '1',
    status: 'Enrolled',
  },
  {
    id: '7',
    rollNo: 'MBA2401',
    name: 'Karan Mehta',
    programme: 'MBA',
    batch: '2024-26',
    section: 'A',
    term: '1',
    status: 'Enrolled',
  },
  {
    id: '8',
    rollNo: 'MCA2401',
    name: 'Deepika Nair',
    programme: 'MCA',
    batch: '2024-26',
    section: 'A',
    term: '1',
    status: 'Pending',
  },
];

export const academicSessions: AcademicSession[] = [
  {
    id: '1',
    name: '2024-25 Odd Semester',
    academicYear: '2024-25',
    type: 'Odd',
    startDate: '2024-07-15',
    endDate: '2024-11-30',
    isActive: true,
  },
  {
    id: '2',
    name: '2024-25 Even Semester',
    academicYear: '2024-25',
    type: 'Even',
    startDate: '2025-01-06',
    endDate: '2025-05-31',
    isActive: false,
  },
  {
    id: '3',
    name: '2023-24 Odd Semester',
    academicYear: '2023-24',
    type: 'Odd',
    startDate: '2023-07-17',
    endDate: '2023-11-30',
    isActive: false,
  },
  {
    id: '4',
    name: '2023-24 Even Semester',
    academicYear: '2023-24',
    type: 'Even',
    startDate: '2024-01-08',
    endDate: '2024-05-31',
    isActive: false,
  },
];

export const evaluationComponents: EvaluationComponent[] = [
  {
    id: '1',
    name: 'Mid-Term Exam',
    course: 'Data Structures',
    weightage: 30,
    maxMarks: 30,
    evaluationType: 'Internal',
    status: 'Active',
  },
  {
    id: '2',
    name: 'End-Term Exam',
    course: 'Data Structures',
    weightage: 50,
    maxMarks: 50,
    evaluationType: 'External',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Assignment',
    course: 'Algorithms',
    weightage: 10,
    maxMarks: 10,
    evaluationType: 'Internal',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Project',
    course: 'Machine Learning',
    weightage: 20,
    maxMarks: 20,
    evaluationType: 'Internal',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Lab Work',
    course: 'Computer Networks',
    weightage: 10,
    maxMarks: 10,
    evaluationType: 'Internal',
    status: 'Active',
  },
  {
    id: '6',
    name: 'Attendance',
    course: 'All Courses',
    weightage: 5,
    maxMarks: 5,
    evaluationType: 'Internal',
    status: 'Active',
  },
];

export const gradingScales: GradingScale[] = [
  {
    id: '1',
    grade: 'O',
    minMarks: 91,
    maxMarks: 100,
    gradePoints: 10,
    description: 'Outstanding',
  },
  {
    id: '2',
    grade: 'A+',
    minMarks: 81,
    maxMarks: 90,
    gradePoints: 9,
    description: 'Excellent',
  },
  {
    id: '3',
    grade: 'A',
    minMarks: 71,
    maxMarks: 80,
    gradePoints: 8,
    description: 'Very Good',
  },
  {
    id: '4',
    grade: 'B+',
    minMarks: 61,
    maxMarks: 70,
    gradePoints: 7,
    description: 'Good',
  },
  {
    id: '5',
    grade: 'B',
    minMarks: 51,
    maxMarks: 60,
    gradePoints: 6,
    description: 'Above Average',
  },
  {
    id: '6',
    grade: 'C',
    minMarks: 40,
    maxMarks: 50,
    gradePoints: 5,
    description: 'Average (Pass)',
  },
];

export const myStudentCourses: StudentCourse[] = [
  {
    id: '1',
    code: 'CS101',
    title: 'Data Structures',
    credits: 4,
    faculty: 'Dr. Rajesh Tiwari',
    semester: '2',
    attendance: 88,
    status: 'Ongoing',
  },
  {
    id: '2',
    code: 'CS102',
    title: 'Algorithms',
    credits: 4,
    faculty: 'Prof. Meera Krishnan',
    semester: '2',
    attendance: 92,
    status: 'Ongoing',
  },
  {
    id: '3',
    code: 'CS201',
    title: 'Database Management Systems',
    credits: 3,
    faculty: 'Dr. Suresh Kumar',
    semester: '2',
    attendance: 76,
    status: 'Ongoing',
  },
  {
    id: '4',
    code: 'MA101',
    title: 'Discrete Mathematics',
    credits: 4,
    faculty: 'Prof. Kavya Reddy',
    semester: '2',
    attendance: 95,
    status: 'Ongoing',
  },
  {
    id: '5',
    code: 'CS402',
    title: 'Web Technologies',
    credits: 3,
    faculty: 'Dr. Divya Agarwal',
    semester: '2',
    attendance: 83,
    status: 'Ongoing',
  },
];

export const myGrades: StudentGrade[] = [
  {
    id: '1',
    courseCode: 'CS101',
    courseTitle: 'Data Structures',
    midTerm: 26,
    endTerm: 42,
    assignment: 9,
    total: 77,
    grade: 'A',
    gradePoints: 8,
    status: 'Pass',
  },
  {
    id: '2',
    courseCode: 'CS102',
    courseTitle: 'Algorithms',
    midTerm: 28,
    endTerm: 45,
    assignment: 10,
    total: 83,
    grade: 'A+',
    gradePoints: 9,
    status: 'Pass',
  },
  {
    id: '3',
    courseCode: 'CS201',
    courseTitle: 'Database Management Systems',
    midTerm: 22,
    endTerm: 38,
    assignment: 8,
    total: 68,
    grade: 'B+',
    gradePoints: 7,
    status: 'Pass',
  },
  {
    id: '4',
    courseCode: 'MA101',
    courseTitle: 'Discrete Mathematics',
    midTerm: 29,
    endTerm: 48,
    assignment: 10,
    total: 87,
    grade: 'A+',
    gradePoints: 9,
    status: 'Pass',
  },
  {
    id: '5',
    courseCode: 'CS402',
    courseTitle: 'Web Technologies',
    midTerm: 24,
    endTerm: 40,
    assignment: 9,
    total: 73,
    grade: 'A',
    gradePoints: 8,
    status: 'Pass',
  },
];

export const facultyCourses: FacultyCourse[] = [
  {
    id: '1',
    code: 'CS101',
    title: 'Data Structures',
    programme: 'B.Tech Computer Science',
    semester: '2',
    totalStudents: 60,
    enrolledCount: 58,
    status: 'Active',
  },
  {
    id: '2',
    code: 'CS102',
    title: 'Algorithms',
    programme: 'B.Tech Computer Science',
    semester: '3',
    totalStudents: 60,
    enrolledCount: 55,
    status: 'Active',
  },
  {
    id: '3',
    code: 'AI301',
    title: 'Machine Learning',
    programme: 'M.Tech AI & ML',
    semester: '1',
    totalStudents: 30,
    enrolledCount: 30,
    status: 'Active',
  },
  {
    id: '4',
    code: 'AI302',
    title: 'Artificial Intelligence',
    programme: 'M.Tech AI & ML',
    semester: '1',
    totalStudents: 30,
    enrolledCount: 28,
    status: 'Active',
  },
];

export const markEntryStudents: MarkEntryStudent[] = [
  {
    id: '1',
    rollNo: 'BTCS2401',
    name: 'Arjun Sharma',
    midTermMarks: 26,
    endTermMarks: 42,
    assignmentMarks: 9,
    totalMarks: 77,
    grade: 'A',
  },
  {
    id: '2',
    rollNo: 'BTCS2402',
    name: 'Priya Verma',
    midTermMarks: 28,
    endTermMarks: 45,
    assignmentMarks: 10,
    totalMarks: 83,
    grade: 'A+',
  },
  {
    id: '3',
    rollNo: 'BTCS2403',
    name: 'Rohit Mishra',
    midTermMarks: 22,
    endTermMarks: 36,
    assignmentMarks: 8,
    totalMarks: 66,
    grade: 'B+',
  },
  {
    id: '4',
    rollNo: 'BTCS2404',
    name: 'Sneha Iyer',
    midTermMarks: 29,
    endTermMarks: 48,
    assignmentMarks: 10,
    totalMarks: 87,
    grade: 'A+',
  },
  {
    id: '5',
    rollNo: 'BTCS2405',
    name: 'Vikram Patel',
    midTermMarks: 18,
    endTermMarks: 30,
    assignmentMarks: 7,
    totalMarks: 55,
    grade: 'B',
  },
  {
    id: '6',
    rollNo: 'BTCS2406',
    name: 'Ananya Singh',
    midTermMarks: 25,
    endTermMarks: 43,
    assignmentMarks: 9,
    totalMarks: 77,
    grade: 'A',
  },
  {
    id: '7',
    rollNo: 'BTCS2407',
    name: 'Karan Mehta',
    midTermMarks: 20,
    endTermMarks: 32,
    assignmentMarks: 6,
    totalMarks: 58,
    grade: 'B',
  },
  {
    id: '8',
    rollNo: 'BTCS2408',
    name: 'Deepika Nair',
    midTermMarks: 27,
    endTermMarks: 44,
    assignmentMarks: 10,
    totalMarks: 81,
    grade: 'A+',
  },
];
