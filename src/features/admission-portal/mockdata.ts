export const mockData = {
  // Mock endpoints and data for the Admission Portal feature
  'admission/protected/subject-selection/info': {
    studentName: 'Ravi Kumar',
    enrollmentNo: '0101CS211001',
    course: 'B.Tech CSE',
    semester: '6th Semester',
    canSelect: true,
  },
  'admission/protected/subject-selection/subjects': [
    {
      id: '1',
      code: 'CS601',
      name: 'Compiler Design',
      credits: 4,
      type: 'Theory',
    },
    {
      id: '2',
      code: 'CS602',
      name: 'Computer Networks',
      credits: 4,
      type: 'Theory',
    },
    {
      id: '3',
      code: 'CS603',
      name: 'Software Engineering',
      credits: 3,
      type: 'Theory',
    },
    {
      id: '4',
      code: 'CS604L',
      name: 'Networks Lab',
      credits: 2,
      type: 'Practical',
    },
  ],
  'admission/protected/fee-payment/status': {
    amountDue: 45000,
    dueDate: '2026-07-15',
    status: 'Pending',
  },
};
