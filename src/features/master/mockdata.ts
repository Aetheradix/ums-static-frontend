export const mockData = {
  // Location
  'master/state': [
    { id: 1, code: 'MP', name: 'Madhya Pradesh', isActive: true },
    { id: 2, code: 'MH', name: 'Maharashtra', isActive: true },
  ],
  'master/divisions': [
    {
      id: 1,
      code: 'BPL',
      name: 'Bhopal Division',
      stateId: 1,
      stateName: 'Madhya Pradesh',
      isActive: true,
    },
    {
      id: 2,
      code: 'IND',
      name: 'Indore Division',
      stateId: 1,
      stateName: 'Madhya Pradesh',
      isActive: true,
    },
  ],
  'master/districts': [
    {
      id: 1,
      code: 'BPL-D',
      name: 'Bhopal',
      divisionId: 1,
      divisionName: 'Bhopal Division',
      isActive: true,
    },
    {
      id: 2,
      code: 'IND-D',
      name: 'Indore',
      divisionId: 2,
      divisionName: 'Indore Division',
      isActive: true,
    },
  ],
  'master/tehsil': [
    {
      id: 1,
      code: 'HUZ',
      name: 'Huzur',
      districtId: 1,
      districtName: 'Bhopal',
      isActive: true,
    },
  ],
  'master/blocks': [
    {
      id: 1,
      code: 'PHA',
      name: 'Phanda',
      districtId: 1,
      districtName: 'Bhopal',
      tehsilId: 1,
      tehsilName: 'Huzur',
      isActive: true,
    },
  ],

  // HR
  'master/castes': [
    { id: 1, name: 'General', isActive: true },
    { id: 2, name: 'OBC', isActive: true },
    { id: 3, name: 'SC', isActive: true },
    { id: 4, name: 'ST', isActive: true },
  ],
  'master/posts': [
    { id: 1, code: 'PROF', name: 'Professor', isActive: true },
    { id: 2, code: 'ASST_PROF', name: 'Assistant Professor', isActive: true },
  ],
  'master/qualifications': [
    {
      id: 1,
      code: 'PHD',
      name: 'Ph.D',
      subject: 'Computer Science',
      isActive: true,
    },
    {
      id: 2,
      code: 'MTECH',
      name: 'M.Tech',
      subject: 'Computer Science',
      isActive: true,
    },
  ],
  'master/religions': [
    { id: 1, name: 'Hinduism', isActive: true },
    { id: 2, name: 'Islam', isActive: true },
  ],
  'master/designation-types': [
    { id: 1, code: 'ACAD', name: 'Academic', isActive: true },
    { id: 2, code: 'ADMIN', name: 'Administrative', isActive: true },
  ],
  'master/designations': [
    {
      id: 1,
      code: 'HOD',
      name: 'Head of Department',
      classId: 1,
      postId: 1,
      designationTypeId: 1,
      sequenceNumber: 1,
      isActive: true,
    },
  ],
  'master/sections': [
    { id: 1, code: 'EST', name: 'Establishment', isActive: true },
    { id: 2, code: 'ACAD', name: 'Academics', isActive: true },
  ],
  'master/classes': [
    { id: 1, code: 'CL-A', name: 'Class A', isActive: true },
    { id: 2, code: 'CL-B', name: 'Class B', isActive: true },
  ],

  // College
  'master/college-types': [
    { id: 1, name: 'Government', isActive: true },
    { id: 2, name: 'Private', isActive: true },
  ],
  'master/college-categories': [
    { id: 1, name: 'Engineering', collegeTypeId: 1, isActive: true },
    { id: 2, name: 'Medical', collegeTypeId: 1, isActive: true },
  ],

  // Faculty Management
  'master/office-type': [
    { id: 1, code: 'HOD', name: 'Head of Department', isActive: true },
    { id: 2, code: 'DEAN', name: 'Dean Office', isActive: true },
  ],
  'master/department': [
    {
      id: 1,
      code: 'CSE',
      name: 'Computer Science',
      officeTypeId: 1,
      hodName: 'Dr. Sharma',
      contactNumber: '9876543210',
      isActive: true,
    },
  ],
  'master/faculty-designation': [
    { id: 1, name: 'Professor', isActive: true },
    { id: 2, name: 'Assistant Professor', isActive: true },
  ],
  'master/faculty': [
    {
      id: 1,
      code: 'F001',
      name: 'Dr. Sharma',
      officeTypeId: 1,
      departmentId: 1,
      designationId: 1,
      joiningDate: new Date().toISOString(),
      mobile: '9876543210',
      email: 'sharma@example.com',
      isActive: true,
    },
  ],

  // Other Masters
  'master/degree-level': [
    { id: 1, code: 'UG', name: 'Undergraduate', isActive: true },
    { id: 2, code: 'PG', name: 'Postgraduate', isActive: true },
  ],
  'master/academic-year': [
    { id: 1, code: '2025', name: '2025-2026', isActive: true },
  ],
  'master/programme': [
    { id: 1, code: 'BTECH', name: 'B.Tech', isActive: true },
  ],
  'master/specialisation': [
    { id: 1, code: 'CSE', name: 'Computer Science', isActive: true },
  ],
  'master/nationality': [{ id: 1, code: 'IN', name: 'Indian', isActive: true }],

  // Grant
  'master/grant-types': [{ id: 1, name: 'Research Grant', isActive: true }],
  'master/grant-categories': [{ id: 1, name: 'AI & ML', isActive: true }],
  'master/eligibility-application-process': [
    { id: 1, name: 'Standard Procedure', isActive: true },
  ],

  // Scheme
  'master/scheme-types': [{ id: 1, name: 'Scholarship', isActive: true }],
  'master/scheme-categories': [{ id: 1, name: 'Merit Based', isActive: true }],
  'master/scheme': [
    { id: 1, name: 'National Merit Scholarship', isActive: true },
  ],

  // Subject
  'master/programme-modes-of-education': [
    { id: 1, name: 'Full Time', isActive: true },
    { id: 2, name: 'Part Time', isActive: true },
  ],
  'master/subject-categories': [
    { id: 1, name: 'Core', isActive: true },
    { id: 2, name: 'Elective', isActive: true },
  ],

  // Employee Settings
  'master/nature-of-employments': [
    { id: 1, name: 'Permanent', isActive: true },
    { id: 2, name: 'Contractual', isActive: true },
  ],
  'master/organization-units': [{ id: 1, name: 'Main Campus', isActive: true }],
  'master/action-options': [{ id: 1, name: 'Transfer', isActive: true }],
  'master/subject-specializations': [{ id: 1, name: 'AI', isActive: true }],
  'master/action-option-reasons': [
    { id: 1, name: 'Promotion', isActive: true },
  ],
  'master/travel-purpose': [{ id: 1, name: 'Conference', isActive: true }],
  'master/employee-groups': [
    { id: 1, name: 'Teaching', isActive: true },
    { id: 2, name: 'Non-Teaching', isActive: true },
  ],

  // Career Advancement Specific Dropdowns
  'master/performance-rating': [
    { id: 1, name: 'Outstanding', text: 'Outstanding', isActive: true },
    { id: 2, name: 'Very Good', text: 'Very Good', isActive: true },
    { id: 3, name: 'Good', text: 'Good', isActive: true },
    { id: 4, name: 'Average', text: 'Average', isActive: true },
  ],
  'master/employee-type': [
    { id: 1, name: 'Permanent', text: 'Permanent', isActive: true },
    { id: 2, name: 'Temporary', text: 'Temporary', isActive: true },
  ],
  'master/group-type': [
    { id: 1, name: 'Group A', text: 'Group A', isActive: true },
    { id: 2, name: 'Group B', text: 'Group B', isActive: true },
  ],
  'master/appraisal-application-status': [
    { id: 1, name: 'Pending', text: 'Pending', isActive: true },
    { id: 2, name: 'Under Review', text: 'Under Review', isActive: true },
    { id: 3, name: 'Completed', text: 'Completed', isActive: true },
  ],
  'master/appraisal-type': [
    { id: 1, name: 'Annual', text: 'Annual', isActive: true },
    { id: 2, name: 'Half-Yearly', text: 'Half-Yearly', isActive: true },
  ],
};
