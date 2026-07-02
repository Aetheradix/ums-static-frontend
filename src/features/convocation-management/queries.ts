import { useQuery } from '@tanstack/react-query';
import { MOCK_CONVOCATION_EVENTS, MOCK_STATS, MOCK_STUDENTS } from './mocks';

export function useConvocationEvents() {
  return useQuery({
    queryKey: ['convocation', 'events'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_CONVOCATION_EVENTS;
    },
  });
}

export function useConvocationStats() {
  return useQuery({
    queryKey: ['convocation', 'stats'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_STATS;
    },
  });
}

export function useEligibleStudents() {
  return useQuery({
    queryKey: ['convocation', 'students'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_STUDENTS;
    },
  });
}
