export const academicMocks = {
  'faculty-management/faculty': [
    {
      id: '1',
      name: 'Dr. Anand Tiwari',
      department: 'Computer Science',
      designation: 'Professor',
      email: 'anand.tiwari@example.in',
      isActive: true,
    },
    {
      id: '2',
      name: 'Dr. Smriti Irani',
      department: 'Mechanical Engineering',
      designation: 'Associate Professor',
      email: 'smriti.irani@example.in',
      isActive: true,
    },
    {
      id: '3',
      name: 'Mr. Rohan Gupta',
      department: 'Information Technology',
      designation: 'Assistant Professor',
      email: 'rohan.gupta@example.in',
      isActive: false,
    },
  ],
  'faculty-management/department': [
    {
      id: '1',
      name: 'Computer Science & Engineering',
      code: 'CSE',
      head: 'Dr. Anand Tiwari',
      isActive: true,
    },
    {
      id: '2',
      name: 'Mechanical Engineering',
      code: 'ME',
      head: 'Dr. Smriti Irani',
      isActive: true,
    },
  ],
  'faculty-management/designation': [
    { id: '1', name: 'Professor', code: 'PROF', level: 1, isActive: true },
    {
      id: '2',
      name: 'Associate Professor',
      code: 'ASSOC_PROF',
      level: 2,
      isActive: true,
    },
    {
      id: '3',
      name: 'Assistant Professor',
      code: 'ASST_PROF',
      level: 3,
      isActive: true,
    },
  ],
  'scheme/scheme': [
    {
      id: '1',
      name: 'Post Matric Scholarship for SC',
      code: 'PMS-SC',
      provider: 'Govt. of India',
      isActive: true,
    },
    {
      id: '2',
      name: 'Mukhyamantri Medhavi Vidyarthi Yojana',
      code: 'MMVY',
      provider: 'Govt. of Madhya Pradesh',
      isActive: true,
    },
  ],
  'scheme/scheme-type': [
    { id: '1', name: 'Central Government', code: 'CEN', isActive: true },
    { id: '2', name: 'State Government', code: 'STATE', isActive: true },
    { id: '3', name: 'Institutional', code: 'INST', isActive: true },
  ],
  'college/college-category': [
    { id: '1', name: 'Co-Education', code: 'COED', isActive: true },
    { id: '2', name: 'Women Only', code: 'WMN', isActive: true },
    { id: '3', name: 'Men Only', code: 'MEN', isActive: true },
  ],
  'grant/grant-type': [
    { id: '1', name: 'Research Project Grant', code: 'RPG', isActive: true },
    {
      id: '2',
      name: 'Infrastructure Development',
      code: 'INFRA',
      isActive: true,
    },
    {
      id: '3',
      name: 'Faculty Development Program',
      code: 'FDP',
      isActive: true,
    },
  ],
};
