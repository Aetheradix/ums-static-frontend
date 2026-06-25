import { masterMocks } from './masterMocks';
import { employeeMocks } from './employeeMocks';
import { sisMocks } from './sisMocks';
import { academicMocks } from './academicMocks';

export const mockRegistry: Record<string, any> = {
  'dashboard/stats': {
    totalStudents: 15200,
    activeCourses: 145,
    upcomingExams: 12,
  },
  ...masterMocks,
  ...employeeMocks,
  ...sisMocks,
  ...academicMocks,
};

export const findMock = (url: string) => {
  for (const key of Object.keys(mockRegistry)) {
    if (url.includes(key)) {
      return mockRegistry[key];
    }
  }
  return null;
};
