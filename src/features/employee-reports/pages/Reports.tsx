import { mockGetBasicEmployees } from 'features/employee-management/mockData';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList } from 'shared/components/forms';
import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';

type RegistrationStatus =
  | 'Quick Onboarding done'
  | 'Full Onboarding done'
  | 'Complete onboarding done';

interface EmployeeReportItem {
  employeeId: number;
  employeeCode: string;
  fullName: string;
  onboardingType: string;
  organizationUnit: string;
  post: string;
  bankName?: string;
  accountNumber?: string;
  dateOfBirth: string;
  registrationStatus: RegistrationStatus;
}

export default function Reports() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeeReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    RegistrationStatus | 'All'
  >('All');

  const [filterDept, setFilterDept] = useState<string | null>(null);
  const [filterStep, setFilterStep] = useState<string | null>(null);
  const [filterDobFrom, setFilterDobFrom] = useState<Date | null>(null);
  const [filterDobTo, setFilterDobTo] = useState<Date | null>(null);

  // Applied filter states
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedDept, setAppliedDept] = useState<string | null>(null);
  const [appliedStep, setAppliedStep] = useState<string | null>(null);
  const [appliedDobFrom, setAppliedDobFrom] = useState<Date | null>(null);
  const [appliedDobTo, setAppliedDobTo] = useState<Date | null>(null);
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<
    RegistrationStatus | 'All'
  >('All');

  const departments = [
    { id: 'Computer Science', name: 'Computer Science' },
    { id: 'Physics', name: 'Physics' },
    { id: 'Administration', name: 'Administration' },
  ];

  const onboardingSteps = [
    { id: 'Quick Onboarding', name: 'Quick Onboarding' },
    { id: 'Full Onboarding', name: 'Full Onboarding' },
  ];

  const formatDateToString = (date: Date | null | undefined) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    mockGetBasicEmployees().then(res => {
      const processed: EmployeeReportItem[] = res.map((emp: any) => {
        let registrationStatus: RegistrationStatus = 'Quick Onboarding done';
        if (emp.bankName && emp.accountNumber) {
          registrationStatus = 'Complete onboarding done';
        } else if (emp.onboardingType === 'Full Onboarding') {
          registrationStatus = 'Full Onboarding done';
        } else {
          registrationStatus = 'Quick Onboarding done';
        }

        return {
          ...emp,
          registrationStatus,
        };
      });
      setEmployees(processed);
      setIsLoading(false);
    });
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    const quick = employees.filter(
      e => e.registrationStatus === 'Quick Onboarding done'
    ).length;
    const full = employees.filter(
      e => e.registrationStatus === 'Full Onboarding done'
    ).length;
    const complete = employees.filter(
      e => e.registrationStatus === 'Complete onboarding done'
    ).length;

    return { quick, full, complete, total: employees.length };
  }, [employees]);

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    if (!hasSearched) return [];
    const dobFromStr = formatDateToString(appliedDobFrom);
    const dobToStr = formatDateToString(appliedDobTo);
    return employees.filter(item => {
      if (
        appliedStatusFilter !== 'All' &&
        item.registrationStatus !== appliedStatusFilter
      )
        return false;
      if (appliedDept && item.organizationUnit !== appliedDept) return false;
      if (appliedStep && item.onboardingType !== appliedStep) return false;
      if (dobFromStr && item.dateOfBirth < dobFromStr) return false;
      if (dobToStr && item.dateOfBirth > dobToStr) return false;
      return true;
    });
  }, [
    employees,
    hasSearched,
    appliedStatusFilter,
    appliedDept,
    appliedStep,
    appliedDobFrom,
    appliedDobTo,
  ]);

  const handleSearch = () => {
    setAppliedDept(filterDept);
    setAppliedStep(filterStep);
    setAppliedDobFrom(filterDobFrom);
    setAppliedDobTo(filterDobTo);
    setAppliedStatusFilter(selectedStatusFilter);
    setHasSearched(true);
  };

  const handleStatCardClick = (status: RegistrationStatus | 'All') => {
    setSelectedStatusFilter(status);
    setAppliedStatusFilter(status);
    setAppliedDept(null);
    setAppliedStep(null);
    setAppliedDobFrom(null);
    setAppliedDobTo(null);
    setFilterDept(null);
    setFilterStep(null);
    setFilterDobFrom(null);
    setFilterDobTo(null);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilterDept(null);
    setFilterStep(null);
    setFilterDobFrom(null);
    setFilterDobTo(null);
    setSelectedStatusFilter('All');

    setAppliedDept(null);
    setAppliedStep(null);
    setAppliedDobFrom(null);
    setAppliedDobTo(null);
    setAppliedStatusFilter('All');
    setHasSearched(false);
  };

  return (
    <FormPage
      title="Registration & Onboarding Reports"
      description="Track status summaries and audit completion metrics across different onboarding phases."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Employee Services', to: '/home/sub-menu/employee-services' },
        { label: 'Employee Reports', to: '/home/sub-menu/employee-reports' },
        { label: 'Registration Reports', to: '#' },
      ]}
    >
      {isLoading && <Loader />}

      {!isLoading && (
        <div className="flex flex-col gap-6">
          {/* Metrics Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              onClick={() => handleStatCardClick('All')}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                selectedStatusFilter === 'All'
                  ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-950'
                  : ''
              }`}
            >
              <StatCard
                title="Total Employees"
                value={stats.total}
                icon="users"
                colorScheme="blue"
                subtitle="All registered staff"
              />
            </div>

            <div
              onClick={() => handleStatCardClick('Quick Onboarding done')}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                selectedStatusFilter === 'Quick Onboarding done'
                  ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-950'
                  : ''
              }`}
            >
              <StatCard
                title="Quick Onboarded"
                value={stats.quick}
                icon="user-minus"
                colorScheme="amber"
                subtitle="Bank details pending"
              />
            </div>

            <div
              onClick={() => handleStatCardClick('Full Onboarding done')}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                selectedStatusFilter === 'Full Onboarding done'
                  ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-950'
                  : ''
              }`}
            >
              <StatCard
                title="Fully Onboarded"
                value={stats.full}
                icon="user-edit"
                colorScheme="indigo"
                subtitle="Bank details pending"
              />
            </div>

            <div
              onClick={() => handleStatCardClick('Complete onboarding done')}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                selectedStatusFilter === 'Complete onboarding done'
                  ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-950'
                  : ''
              }`}
            >
              <StatCard
                title="Completed Onboarding"
                value={stats.complete}
                icon="user-check"
                colorScheme="green"
                subtitle="Bank details filled"
              />
            </div>
          </div>

          {/* Filter Card */}
          <FormCard title="Report Filters" icon="filter">
            <FormGrid columns={4}>
              <DropDownList
                label="Department"
                placeholder="Select Department"
                data={departments}
                textField="name"
                valueField="id"
                value={filterDept}
                onChange={val => setFilterDept(val as string)}
              />
              <DropDownList
                label="Onboarding Step"
                placeholder="Select Step"
                data={onboardingSteps}
                textField="name"
                valueField="id"
                value={filterStep}
                onChange={val => setFilterStep(val as string)}
              />
              <DatePicker
                label="Birth Date From"
                placeholder="Select start date"
                value={filterDobFrom ?? undefined}
                onChange={date => setFilterDobFrom(date ?? null)}
              />
              <DatePicker
                label="Birth Date To"
                placeholder="Select end date"
                value={filterDobTo ?? undefined}
                onChange={date => setFilterDobTo(date ?? null)}
              />
            </FormGrid>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Reset Filters"
                variant="outlined"
                size="small"
                onClick={handleReset}
              />
              <Button
                label="Search"
                variant="primary"
                size="small"
                onClick={handleSearch}
                icon="search"
              />
            </div>
          </FormCard>

          {/* Interactive Report Table */}
          {hasSearched && (
            <FormCard
              title={`${appliedStatusFilter} Report List`}
              subtitle="Click on any summary card above to filter the report table below."
              headerAction={
                (appliedStatusFilter !== 'All' ||
                  appliedDept ||
                  appliedStep ||
                  appliedDobFrom ||
                  appliedDobTo) && (
                  <Button
                    label="Clear All Filters"
                    variant="outlined"
                    size="small"
                    onClick={handleReset}
                  />
                )
              }
            >
              <GridPanel
                data={filteredEmployees}
                columns={[
                  {
                    cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                    width: '40px',
                  },
                  { field: 'employeeCode', header: 'Code' },
                  {
                    field: 'fullName',
                    header: 'Full Name',
                    cell: (item: EmployeeReportItem) => (
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.fullName}
                      </span>
                    ),
                  },
                  { field: 'onboardingType', header: 'Step' },
                  { field: 'organizationUnit', header: 'Department' },
                  { field: 'post', header: 'Designation' },
                  {
                    header: 'Birth Date',
                    cell: (item: EmployeeReportItem) => (
                      <span className="text-xs text-gray-500">
                        {item.dateOfBirth}
                      </span>
                    ),
                  },
                  {
                    header: 'Bank Details',
                    cell: (item: EmployeeReportItem) => (
                      <span
                        className={`text-xs font-semibold ${
                          item.bankName
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {item.bankName ? 'Filled' : 'Pending'}
                      </span>
                    ),
                  },
                  {
                    field: 'registrationStatus',
                    header: 'Registration Status',
                    cell: (item: EmployeeReportItem) => {
                      let variant: 'approved' | 'pending' | 'neutral' =
                        'neutral';
                      if (
                        item.registrationStatus === 'Complete onboarding done'
                      ) {
                        variant = 'approved';
                      } else if (
                        item.registrationStatus === 'Quick Onboarding done'
                      ) {
                        variant = 'pending';
                      }
                      return (
                        <StatusBadge
                          variant={variant}
                          label={item.registrationStatus}
                        />
                      );
                    },
                  },
                  {
                    header: 'Action',
                    cell: (item: EmployeeReportItem) => (
                      <Button
                        label="View Profile"
                        icon="eye"
                        variant="text"
                        size="small"
                        onClick={() =>
                          navigate(
                            `/settings/employee-profile/${item.employeeId}`
                          )
                        }
                      />
                    ),
                  },
                ]}
                searchBox
                searchPlaceholder="Search by name, code, department, designation..."
              />
            </FormCard>
          )}
        </div>
      )}
    </FormPage>
  );
}
