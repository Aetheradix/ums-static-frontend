export interface SeedStudent {
  id: string;
  enrolmentNo: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  programmeId: number;
  programmeName: string;
  academicSession: string;
  status: 'Active' | 'Inactive' | 'Pending';
  abcLinked: boolean;
  abcId?: string;
  password?: string; // Very simple mock auth
}

let MOCK_STUDENTS: SeedStudent[] = [
  {
    id: 'STU001',
    enrolmentNo: 'EN2024001',
    rollNo: 'RL2024001',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '9876543210',
    gender: 'Male',
    dateOfBirth: '2002-05-15',
    programmeId: 1,
    programmeName: 'B.Tech Computer Science',
    academicSession: '2024-2025',
    status: 'Active',
    abcLinked: true,
    abcId: 'ABC-123-456-789',
    password: 'password123',
  },
  {
    id: 'STU002',
    enrolmentNo: 'EN2024002',
    rollNo: 'RL2024002',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@example.com',
    phone: '9876543211',
    gender: 'Female',
    dateOfBirth: '2001-10-20',
    programmeId: 2,
    programmeName: 'MBA Finance',
    academicSession: '2024-2025',
    status: 'Active',
    abcLinked: false,
    password: 'password123',
  },
  {
    id: 'STU003',
    enrolmentNo: 'EN2024003',
    rollNo: 'RL2024003',
    firstName: 'Rohan',
    lastName: 'Gupta',
    email: 'rohan.gupta@example.com',
    phone: '9876543212',
    gender: 'Male',
    dateOfBirth: '2003-01-10',
    programmeId: 1,
    programmeName: 'B.Tech Computer Science',
    academicSession: '2024-2025',
    status: 'Pending',
    abcLinked: false,
    password: 'password123',
  },
  {
    id: 'STU004',
    enrolmentNo: 'EN2024004',
    rollNo: 'RL2024004',
    firstName: 'Neha',
    lastName: 'Singh',
    email: 'neha.singh@example.com',
    phone: '9876543213',
    gender: 'Female',
    dateOfBirth: '2002-08-25',
    programmeId: 3,
    programmeName: 'B.Sc Physics',
    academicSession: '2024-2025',
    status: 'Active',
    abcLinked: true,
    abcId: 'ABC-987-654-321',
    password: 'password123',
  },
  {
    id: 'STU005',
    enrolmentNo: 'EN2024005',
    rollNo: 'RL2024005',
    firstName: 'Vikram',
    lastName: 'Rathore',
    email: 'vikram.rathore@example.com',
    phone: '9876543214',
    gender: 'Male',
    dateOfBirth: '2001-12-05',
    programmeId: 2,
    programmeName: 'MBA Finance',
    academicSession: '2024-2025',
    status: 'Inactive',
    abcLinked: false,
    password: 'password123',
  },
];

export const StudentSeedService = {
  getAll: async () => {
    return Promise.resolve([...MOCK_STUDENTS]);
  },
  getById: async (id: string) => {
    const student = MOCK_STUDENTS.find(s => s.id === id);
    return Promise.resolve(student || null);
  },
  getByEnrolmentNo: async (enrolmentNo: string) => {
    const student = MOCK_STUDENTS.find(s => s.enrolmentNo === enrolmentNo);
    return Promise.resolve(student || null);
  },
  add: async (student: Omit<SeedStudent, 'id'>) => {
    const newStudent = {
      ...student,
      id: `STU${String(MOCK_STUDENTS.length + 1).padStart(3, '0')}`,
    };
    MOCK_STUDENTS.push(newStudent);
    return Promise.resolve(newStudent);
  },
  update: async (id: string, data: Partial<SeedStudent>) => {
    MOCK_STUDENTS = MOCK_STUDENTS.map(s =>
      s.id === id ? { ...s, ...data } : s
    );
    return Promise.resolve(MOCK_STUDENTS.find(s => s.id === id));
  },
  delete: async (id: string) => {
    MOCK_STUDENTS = MOCK_STUDENTS.filter(s => s.id !== id);
    return Promise.resolve(true);
  },
  bulkAdd: async (students: Omit<SeedStudent, 'id'>[]) => {
    const newStudents = students.map((s, index) => ({
      ...s,
      id: `STU${String(MOCK_STUDENTS.length + index + 1).padStart(3, '0')}`,
    }));
    MOCK_STUDENTS = [...MOCK_STUDENTS, ...newStudents];
    return Promise.resolve(newStudents);
  },
  enrollStudent: async (applicant: Partial<SeedStudent>) => {
    const newId = `STU${String(MOCK_STUDENTS.length + 1).padStart(3, '0')}`;
    const newStudent: SeedStudent = {
      id: newId,
      enrolmentNo: `EN${new Date().getFullYear()}${String(MOCK_STUDENTS.length + 1).padStart(3, '0')}`,
      rollNo: `RL${new Date().getFullYear()}${String(MOCK_STUDENTS.length + 1).padStart(3, '0')}`,
      firstName: applicant.firstName || 'New',
      lastName: applicant.lastName || 'Student',
      email: applicant.email || `${newId.toLowerCase()}@university.edu`,
      phone: applicant.phone || '0000000000',
      gender: applicant.gender || 'Unknown',
      dateOfBirth: applicant.dateOfBirth || '2000-01-01',
      programmeId: applicant.programmeId || 1,
      programmeName: applicant.programmeName || 'General',
      academicSession: applicant.academicSession || '2024-2025',
      status: 'Active',
      abcLinked: false,
      password: 'password123',
    };
    MOCK_STUDENTS.push(newStudent);
    return Promise.resolve(newStudent);
  },
};
