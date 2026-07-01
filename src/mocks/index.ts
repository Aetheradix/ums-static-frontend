import { masterMocks } from './masterMocks';
import { employeeMocks } from './employeeMocks';
import { sisMocks } from './sisMocks';
import { academicMocks } from './academicMocks';
import { mockRegistry as examMockRegistry } from '../features/examination-management/mocks';

// Dynamically import all mockdata.ts files in the features directory
const featureMocks = import.meta.glob('../features/**/mockdata.ts', {
  eager: true,
});
const dynamicMocks = Object.values(featureMocks).reduce<Record<string, any>>(
  (acc, module: any) => {
    return { ...acc, ...(module.default || module.mockData || module) };
  },
  {}
);

console.log('Registered Feature Mocks:', Object.keys(dynamicMocks));

export const mockRegistry: Record<string, any> = {
  'dashboard/stats': {
    totalStudents: 15200,
    activeCourses: 145,
    upcomingExams: 12,
  },
  // Spread legacy centralized mocks
  ...masterMocks,
  ...employeeMocks,
  ...sisMocks,
  ...academicMocks,
  ...examMockRegistry,
  // Spread dynamically loaded feature mocks (they will override legacy if keys overlap)
  ...dynamicMocks,
};

export const findMock = (url: string) => {
  const sortedKeys = Object.keys(mockRegistry).sort(
    (a, b) => b.length - a.length
  );
  for (const key of sortedKeys) {
    if (url.includes(key)) {
      return mockRegistry[key];
    }
  }
  return null;
};
