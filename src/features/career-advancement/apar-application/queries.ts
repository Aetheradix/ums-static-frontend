import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DUMMY_EMPLOYEES } from './data';
import { initiateAparApplication } from './api';

const QUERY_KEY = ['@career-advancement/apar-applications'];

export function useAparApplicationsQuery(
  filter?: Partial<CareerAdvancement.AparApplication.AparSearchFilter>
) {
  const {
    data = DUMMY_EMPLOYEES,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [...QUERY_KEY, filter],
    queryFn: () => {
      // TODO: Replace with real API call once endpoints are available:
      // return getAparApplications();
      return Promise.resolve(
        DUMMY_EMPLOYEES.filter(emp => {
          const matchesSearch =
            !filter?.employeeSearch ||
            emp.employeeName
              .toLowerCase()
              .includes(filter.employeeSearch.toLowerCase()) ||
            emp.employeeId
              .toLowerCase()
              .includes(filter.employeeSearch.toLowerCase());

          const matchesDepartment =
            !filter?.departmentId ||
            emp.department ===
              DUMMY_EMPLOYEES.find(e => e.department === filter.departmentId)
                ?.department;

          const matchesStatus =
            !filter?.statusId || emp.status === filter.statusId;

          return matchesSearch && matchesDepartment && matchesStatus;
        })
      );
    },
  });

  return { data, isLoading, refetch };
}

export function useInitiateAparMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CareerAdvancement.AparApplication.InitiateAparCommand
    ) => await initiateAparApplication(data),

    onSuccess(data) {
      if (!data) return;

      const result =
        queryClient.getQueryData<
          CareerAdvancement.AparApplication.AparApplicationItem[]
        >(QUERY_KEY) ?? [];

      queryClient.setQueryData(QUERY_KEY, [...result, data]);
    },
  });
}
