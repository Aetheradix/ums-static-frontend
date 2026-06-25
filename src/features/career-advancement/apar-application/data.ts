export const DUMMY_DEPARTMENTS: Data.DataItem<string>[] = [
  { id: 'CS', text: 'Computer Science' },
  { id: 'Math', text: 'Mathematics' },
  { id: 'Phy', text: 'Physics' },
  { id: 'Chem', text: 'Chemistry' },
  { id: 'Eng', text: 'English' },
];

export const DUMMY_SESSIONS: Data.DataItem<string>[] = [
  { id: '2024-25', text: 'APAR 2024-25' },
  { id: '2023-24', text: 'APAR 2023-24' },
  { id: '2022-23', text: 'APAR 2022-23' },
];

export const DUMMY_STATUSES: Data.DataItem<string>[] = [
  { id: 'Pending', text: 'Pending' },
  { id: 'Forwarded', text: 'Forwarded' },
  { id: 'Completed', text: 'Completed' },
];

export const DUMMY_EMPLOYEES: CareerAdvancement.AparApplication.AparApplicationItem[] =
  [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Dr. Ramesh Kumar',
      designation: 'Assistant Professor',
      department: 'Computer Science',
      session: 'APAR 2024-25',
      status: 'Pending',
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Prof. Sunita Verma',
      designation: 'Associate Professor',
      department: 'Mathematics',
      session: 'APAR 2024-25',
      status: 'Forwarded',
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Dr. Ajay Singh',
      designation: 'Assistant Professor',
      department: 'Physics',
      session: 'APAR 2024-25',
      status: 'Completed',
    },
  ];
