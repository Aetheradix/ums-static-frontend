import { useMemo, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';

interface MockAppraisalRecord {
  id: string;
  employeeCode: string;
  employeeName: string;
  period: string;
  reviewer: string;
  reviewerRating: string | number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Completed';
  submissionDate: string;
}

const MOCK_APPRAISALS: MockAppraisalRecord[] = [
  {
    id: 'SAR-2024-001',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    period: 'April 2024 - March 2025',
    reviewer: 'Dr. Robert Carter (HOD)',
    reviewerRating: 4,
    status: 'Completed',
    submissionDate: '2025-04-10',
  },
  {
    id: 'SAR-2025-001',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    period: 'April 2025 - March 2026',
    reviewer: 'Dr. Robert Carter (HOD)',
    reviewerRating: 'Pending',
    status: 'Under Review',
    submissionDate: '2026-04-12',
  },
  {
    id: 'SAR-2024-002',
    employeeCode: 'EMP-002',
    employeeName: 'Prof. Jane Smith',
    period: 'April 2024 - March 2025',
    reviewer: 'Dr. Arthur Pendelton',
    reviewerRating: 5,
    status: 'Completed',
    submissionDate: '2025-04-15',
  },
  {
    id: 'SAR-2025-002',
    employeeCode: 'EMP-002',
    employeeName: 'Prof. Jane Smith',
    period: 'April 2025 - March 2026',
    reviewer: 'Dr. Arthur Pendelton',
    reviewerRating: 'Pending',
    status: 'Under Review',
    submissionDate: '2026-04-20',
  },
  {
    id: 'SAR-2025-003',
    employeeCode: 'EMP-004',
    employeeName: 'Dr. Bob Williams',
    period: 'April 2025 - March 2026',
    reviewer: 'Dr. Arthur Pendelton',
    reviewerRating: 3,
    status: 'Completed',
    submissionDate: '2026-05-02',
  },
  {
    id: 'SAR-2025-004',
    employeeCode: 'EMP-005',
    employeeName: 'Ms. Charlie M. Brown',
    period: 'April 2025 - March 2026',
    reviewer: 'Dr. Robert Carter (HOD)',
    reviewerRating: 'Pending',
    status: 'Submitted',
    submissionDate: '2026-05-15',
  },
];

export default function AppraisalReports() {
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>('All');
  const [filterPeriod, setFilterPeriod] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);

  // Applied filter states
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string>('All');
  const [appliedPeriod, setAppliedPeriod] = useState<string | null>(null);
  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(null);
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(null);

  const periods = [
    { id: 'April 2024 - March 2025', name: 'April 2024 - March 2025' },
    { id: 'April 2025 - March 2026', name: 'April 2025 - March 2026' },
  ];

  const statuses = [
    { id: 'Completed', name: 'Completed' },
    { id: 'Under Review', name: 'Under Review' },
    { id: 'Submitted', name: 'Submitted' },
    { id: 'Draft', name: 'Draft' },
  ];

  const formatDateToString = (date: Date | null | undefined) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const stats = useMemo(() => {
    const total = MOCK_APPRAISALS.length;
    const completed = MOCK_APPRAISALS.filter(
      a => a.status === 'Completed'
    ).length;
    const pending = MOCK_APPRAISALS.filter(
      a => a.status !== 'Completed'
    ).length;
    return { total, completed, pending };
  }, []);

  const filteredAppraisals = useMemo(() => {
    if (!hasSearched) return [];
    const fromDateStr = formatDateToString(appliedFromDate);
    const toDateStr = formatDateToString(appliedToDate);

    return MOCK_APPRAISALS.filter(item => {
      if (appliedPeriod && item.period !== appliedPeriod) return false;
      if (appliedStatusFilter !== 'All') {
        if (appliedStatusFilter === 'Awaiting Approval') {
          if (item.status === 'Completed') return false;
        } else if (item.status !== appliedStatusFilter) {
          return false;
        }
      }
      if (fromDateStr && item.submissionDate < fromDateStr) return false;
      if (toDateStr && item.submissionDate > toDateStr) return false;
      return true;
    });
  }, [
    hasSearched,
    appliedPeriod,
    appliedStatusFilter,
    appliedFromDate,
    appliedToDate,
  ]);

  const handleSearch = () => {
    setAppliedPeriod(filterPeriod);
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
    setAppliedStatusFilter(selectedStatusFilter);
    setHasSearched(true);
  };

  const handleStatCardClick = (status: string) => {
    setSelectedStatusFilter(status);
    setAppliedStatusFilter(status);
    setAppliedPeriod(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
    setFilterPeriod(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilterPeriod(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setSelectedStatusFilter('All');

    setAppliedPeriod(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
    setAppliedStatusFilter('All');
    setHasSearched(false);
  };

  return (
    <FormPage
      title="Appraisal Status Reports"
      description="Track annual performance reviews, status logs, ratings, and self-appraisal submissions (SAR)."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Employee Services', to: '/home/sub-menu/employee-services' },
        { label: 'Employee Reports', to: '/home/sub-menu/employee-reports' },
        { label: 'Appraisal Reports', to: '#' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => handleStatCardClick('All')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              selectedStatusFilter === 'All'
                ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Total Appraisals"
              value={stats.total}
              icon="file"
              colorScheme="blue"
              subtitle="All logged submissions"
            />
          </div>
          <div
            onClick={() => handleStatCardClick('Completed')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              selectedStatusFilter === 'Completed'
                ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Completed Reviews"
              value={stats.completed}
              icon="check-circle"
              colorScheme="green"
              subtitle="Final scores locked"
            />
          </div>
          <div
            onClick={() => handleStatCardClick('Awaiting Approval')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              selectedStatusFilter === 'Awaiting Approval'
                ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Awaiting Approval"
              value={stats.pending}
              icon="clock"
              colorScheme="amber"
              subtitle="Under review or submitted"
            />
          </div>
        </div>

        {/* Filter Panel Card */}
        <FormCard title="Report Filters" icon="filter">
          <FormGrid columns={4}>
            <DropDownList
              label="Appraisal Period"
              placeholder="Select Period"
              data={periods}
              textField="name"
              valueField="id"
              value={filterPeriod}
              onChange={val => setFilterPeriod(val as string)}
            />
            <DropDownList
              label="Status"
              placeholder="Select Status"
              data={statuses}
              textField="name"
              valueField="id"
              value={
                selectedStatusFilter === 'All' ||
                selectedStatusFilter === 'Awaiting Approval'
                  ? null
                  : selectedStatusFilter
              }
              onChange={val =>
                setSelectedStatusFilter((val as string) || 'All')
              }
            />
            <DatePicker
              label="Submitted From"
              placeholder="Select start date"
              value={filterFromDate ?? undefined}
              onChange={date => setFilterFromDate(date ?? null)}
            />
            <DatePicker
              label="Submitted To"
              placeholder="Select end date"
              value={filterToDate ?? undefined}
              onChange={date => setFilterToDate(date ?? null)}
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

        {/* Appraisal Records */}
        {hasSearched && (
          <FormCard
            title={`${appliedStatusFilter === 'All' ? 'Total' : appliedStatusFilter} Appraisal Report Grid`}
            subtitle="Filtered results matching criteria above."
            headerAction={
              (appliedStatusFilter !== 'All' ||
                appliedPeriod ||
                appliedFromDate ||
                appliedToDate) && (
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
              data={filteredAppraisals}
              columns={[
                {
                  cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                  width: '40px',
                },
                { field: 'id', header: 'Ref ID' },
                { field: 'employeeCode', header: 'Code' },
                {
                  field: 'employeeName',
                  header: 'Employee Name',
                  cell: (item: MockAppraisalRecord) => (
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.employeeName}
                    </span>
                  ),
                },
                { field: 'period', header: 'Review Period' },
                { field: 'reviewer', header: 'Reviewer (HOD)' },
                {
                  field: 'reviewerRating',
                  header: 'Reviewer Rating',
                  cell: (item: MockAppraisalRecord) => (
                    <span className="font-bold text-gray-800 dark:text-zinc-200">
                      {typeof item.reviewerRating === 'number'
                        ? `${item.reviewerRating} / 5`
                        : item.reviewerRating}
                    </span>
                  ),
                },
                {
                  field: 'submissionDate',
                  header: 'Submitted On',
                  cell: (item: MockAppraisalRecord) => (
                    <span className="text-xs text-gray-500">
                      {item.submissionDate}
                    </span>
                  ),
                },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (item: MockAppraisalRecord) => {
                    let variant: 'approved' | 'pending' | 'neutral' = 'neutral';
                    if (item.status === 'Completed') variant = 'approved';
                    if (
                      item.status === 'Under Review' ||
                      item.status === 'Submitted'
                    ) {
                      variant = 'pending';
                    }
                    return (
                      <StatusBadge variant={variant} label={item.status} />
                    );
                  },
                },
              ]}
              searchBox
              searchPlaceholder="Search by name, code, reviewer..."
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
