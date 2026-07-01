// LMS Mock Data Database

export interface Course {
  id: string;
  code: string;
  name: string;
  category: string;
  duration: string;
  status: 'Active' | 'Inactive';
  modulesCount: number;
  enrolledStudents: number;
}

export const mockCourses: Course[] = [
  {
    id: 'c1',
    code: 'BCA',
    name: 'Bachelor of Computer Applications',
    category: 'Technical',
    duration: '3 Years',
    status: 'Active',
    modulesCount: 6,
    enrolledStudents: 120,
  },
  {
    id: 'c2',
    code: 'MBA',
    name: 'Master of Business Administration',
    category: 'Management',
    duration: '2 Years',
    status: 'Active',
    modulesCount: 8,
    enrolledStudents: 85,
  },
  {
    id: 'c3',
    code: 'BTECH-CS',
    name: 'B.Tech Computer Science',
    category: 'Technical',
    duration: '4 Years',
    status: 'Active',
    modulesCount: 12,
    enrolledStudents: 240,
  },
  {
    id: 'c4',
    code: 'BCOM',
    name: 'Bachelor of Commerce',
    category: 'Commerce',
    duration: '3 Years',
    status: 'Active',
    modulesCount: 5,
    enrolledStudents: 150,
  },
  {
    id: 'c5',
    code: 'MCA',
    name: 'Master of Computer Applications',
    category: 'Technical',
    duration: '2 Years',
    status: 'Active',
    modulesCount: 9,
    enrolledStudents: 60,
  },
  {
    id: 'c6',
    code: 'MTECH-AI',
    name: 'M.Tech AI & ML',
    category: 'Technical',
    duration: '2 Years',
    status: 'Inactive',
    modulesCount: 10,
    enrolledStudents: 0,
  },
];

export interface Module {
  id: string;
  courseId: string;
  name: string;
  description: string;
  order: number;
}

export const mockModules: Module[] = [
  {
    id: 'm1',
    courseId: 'c3',
    name: 'Programming Basics',
    description: 'Fundamentals of C++ and flowcharts',
    order: 1,
  },
  {
    id: 'm2',
    courseId: 'c3',
    name: 'Database Management Systems',
    description: 'Relational algebra, SQL, and indexing',
    order: 2,
  },
  {
    id: 'm3',
    courseId: 'c3',
    name: 'Data Structures & Algorithms',
    description: 'Lists, Trees, Graphs, Sorting & Searching',
    order: 3,
  },
  {
    id: 'm4',
    courseId: 'c3',
    name: 'Computer Networks',
    description: 'TCP/IP Model, routing protocols, DNS',
    order: 4,
  },
  {
    id: 'm5',
    courseId: 'c1',
    name: 'Web Technologies',
    description: 'HTML5, CSS3, ES6 JavaScript, and DOM Manipulation',
    order: 1,
  },
  {
    id: 'm6',
    courseId: 'c1',
    name: 'Software Engineering',
    description: 'SDLC models, agile practices, testing',
    order: 2,
  },
];

export interface Topic {
  id: string;
  moduleId: string;
  name: string;
  contentCount: number;
}

export const mockTopics: Topic[] = [
  { id: 't1', moduleId: 'm1', name: 'Introduction to C++', contentCount: 2 },
  { id: 't2', moduleId: 'm1', name: 'Variables & Data Types', contentCount: 3 },
  {
    id: 't3',
    moduleId: 'm1',
    name: 'Control Structures & Loops',
    contentCount: 4,
  },
  { id: 't4', moduleId: 'm2', name: 'Relational Model', contentCount: 2 },
  { id: 't5', moduleId: 'm2', name: 'SQL Query Optimization', contentCount: 3 },
  { id: 't6', moduleId: 'm3', name: 'Binary Search Trees', contentCount: 2 },
];

export interface ContentItem {
  id: string;
  topicId: string;
  title: string;
  type: 'Video' | 'PDF' | 'Notes' | 'PPT';
  url: string;
  duration?: string;
  size?: string;
  description: string;
}

export const mockContent: ContentItem[] = [
  {
    id: 'con1',
    topicId: 't1',
    title: 'C++ Environment Setup Lecture',
    type: 'Video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '12:45',
    description: 'Step-by-step setup guide for MinGW and VS Code.',
  },
  {
    id: 'con2',
    topicId: 't1',
    title: 'C++ Syntax & Boilerplate Cheat Sheet',
    type: 'PDF',
    url: 'https://pdfobject.com/pdf/sample.pdf',
    size: '1.2 MB',
    description: 'Reference sheet covering basic C++ components.',
  },
  {
    id: 'con3',
    topicId: 't2',
    title: 'Understanding Memory Allocation',
    type: 'Notes',
    url: '#',
    description: 'Details on stack vs heap memory for primitive variables.',
  },
  {
    id: 'con4',
    topicId: 't2',
    title: 'Data Types Presentation',
    type: 'PPT',
    url: '#',
    description:
      'Visual lecture slides for primitive, derived, and user-defined data types.',
  },
  {
    id: 'con5',
    topicId: 't3',
    title: 'Loops & Conditionals Explained',
    type: 'Video',
    url: 'https://www.w3schools.com/html/movie.mp4',
    duration: '18:20',
    description:
      'Advanced look at nested loops, while loops, and switch-case blocks.',
  },
  {
    id: 'con6',
    topicId: 't3',
    title: 'Loop Coding Practice Problems',
    type: 'PDF',
    url: 'https://pdfobject.com/pdf/sample.pdf',
    size: '780 KB',
    description: '20 hands-on algorithmic problems focusing on loops.',
  },
];

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  dueDate: string;
}

export const mockQuizzes: Quiz[] = [
  {
    id: 'q1',
    courseId: 'c3',
    title: 'Quiz 1: C++ Syntax & Basics',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 7,
    dueDate: '2026-07-15',
  },
  {
    id: 'q2',
    courseId: 'c3',
    title: 'Quiz 2: DBMS Joins & Subqueries',
    durationMinutes: 20,
    totalQuestions: 15,
    passingScore: 10,
    dueDate: '2026-07-18',
  },
  {
    id: 'q3',
    courseId: 'c1',
    title: 'Quiz 1: HTML & CSS Selectors',
    durationMinutes: 10,
    totalQuestions: 5,
    passingScore: 4,
    dueDate: '2026-07-12',
  },
];

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // index
}

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'qq1',
    quizId: 'q1',
    questionText: 'Which of the following is a correct comment syntax in C++?',
    options: ['/* comment */', '// comment', '# comment', 'Both A and B'],
    correctAnswer: 3,
  },
  {
    id: 'qq2',
    quizId: 'q1',
    questionText: 'What is the size of a "double" data type in C++?',
    options: ['2 bytes', '4 bytes', '8 bytes', '16 bytes'],
    correctAnswer: 2,
  },
  {
    id: 'qq3',
    quizId: 'q1',
    questionText:
      'Which keyword is used to allocate memory dynamically in C++?',
    options: ['malloc', 'alloc', 'create', 'new'],
    correctAnswer: 3,
  },
  {
    id: 'qq4',
    quizId: 'q1',
    questionText: 'Which header file is required to use std::cout?',
    options: ['<iostream>', '<stdio.h>', '<conio.h>', '<ostream>'],
    correctAnswer: 0,
  },
];

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  status: 'Pending' | 'Submitted' | 'Graded';
  submittedDate?: string;
  grade?: string;
  feedback?: string;
}

export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    courseId: 'c3',
    title: 'Assignment 1: Logic Building & Flowcharts',
    description:
      'Draw flowcharts and write pseudocode for 5 basic programming questions.',
    dueDate: '2026-07-10',
    totalPoints: 100,
    status: 'Graded',
    submittedDate: '2026-06-28',
    grade: '92/100',
    feedback: 'Great logic! Flowchart format was clean.',
  },
  {
    id: 'a2',
    courseId: 'c3',
    title: 'Assignment 2: Pointer Arithmetic & Functions',
    description:
      'Write a program to reverse an array using pointers and passing parameters by reference.',
    dueDate: '2026-07-01',
    totalPoints: 100,
    status: 'Submitted',
    submittedDate: '2026-07-01',
  },
  {
    id: 'a3',
    courseId: 'c3',
    title: 'Assignment 3: OOP Class Design & Inheritance',
    description:
      'Design a Payroll System using polymorphism, encapsulation, and single/multiple inheritance patterns.',
    dueDate: '2026-07-28',
    totalPoints: 150,
    status: 'Pending',
  },
];

export interface Certificate {
  id: string;
  courseName: string;
  issueDate: string;
  credentialId: string;
  recipientName: string;
  facultyName: string;
}

export const mockCertificates: Certificate[] = [
  {
    id: 'cert1',
    courseName: 'Introduction to Advanced Programming in C++',
    issueDate: '2026-05-12',
    credentialId: 'LMS-CS-2026-9921',
    recipientName: 'Arjun Sharma',
    facultyName: 'Dr. Amit Kumar',
  },
  {
    id: 'cert2',
    courseName: 'Database Management Systems & SQL',
    issueDate: '2026-06-18',
    credentialId: 'LMS-DB-2026-4402',
    recipientName: 'Arjun Sharma',
    facultyName: 'Prof. Priya Rawat',
  },
];

export const recentActivities = [
  {
    id: 1,
    user: 'Dr. Amit Kumar',
    action: 'Uploaded Video Lecture: Pointers in C++',
    time: '10 mins ago',
    role: 'Faculty',
  },
  {
    id: 2,
    user: 'Arjun Sharma',
    action: 'Submitted Quiz 1: C++ Syntax',
    time: '1 hour ago',
    role: 'Student',
  },
  {
    id: 3,
    user: 'System Admin',
    action: 'Mapped 15 new students to BCA Course',
    time: '2 hours ago',
    role: 'Admin',
  },
  {
    id: 4,
    user: 'Prof. Priya Rawat',
    action: 'Published results for SQL Assignment',
    time: '4 hours ago',
    role: 'Faculty',
  },
  {
    id: 5,
    user: 'Arjun Sharma',
    action: 'Completed Module: Web Technologies',
    time: '1 day ago',
    role: 'Student',
  },
];

export const studentProgress = [
  {
    courseId: 'c3',
    courseName: 'B.Tech Computer Science',
    progress: 78,
    completedModules: 4,
    totalModules: 6,
    status: 'Active',
  },
  {
    courseId: 'c1',
    courseName: 'Bachelor of Computer Applications',
    progress: 100,
    completedModules: 6,
    totalModules: 6,
    status: 'Completed',
  },
  {
    courseId: 'c2',
    courseName: 'Master of Business Administration',
    progress: 15,
    completedModules: 1,
    totalModules: 8,
    status: 'Active',
  },
];
