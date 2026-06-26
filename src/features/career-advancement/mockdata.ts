export const mockData = {
  // Mock endpoints and data for the Career Advancement feature
  'career/apar-applications': [
    { id: '1', employeeName: 'Amit Kumar', year: '2025', status: 'Submitted' },
    { id: '2', employeeName: 'Neha Gupta', year: '2024', status: 'Approved' },
  ],
  'career/sessions': [
    {
      id: '1',
      sessionName: '2024-2025 Annual',
      type: 'Annual',
      appStatus: 'Open',
      status: true,
      isActive: true,
    },
    {
      id: '2',
      sessionName: '2023-2024 Half-Yearly',
      type: 'Half-Yearly',
      appStatus: 'Closed',
      status: false,
      isActive: false,
    },
  ],
  'career/employee-self-assessment': [
    {
      id: '1',
      assessmentName: '2025 Self Assessment',
      status: 'Pending',
      isActive: true,
    },
    {
      id: '2',
      assessmentName: '2024 Self Assessment',
      status: 'Completed',
      isActive: true,
    },
  ],
};
