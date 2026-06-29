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

interface MockLeaveRequest {
  id: string;
  employeeCode: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedOn: string;
}

const MOCK_LEAVES: MockLeaveRequest[] = [
  {
    id: 'LV-1024',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    leaveType: 'Casual Leave',
    startDate: '2026-05-10',
    endDate: '2026-05-11',
    days: 2,
    reason: 'Family function at hometown.',
    status: 'Approved',
    appliedOn: '2026-05-01',
  },
  {
    id: 'LV-0985',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    leaveType: 'Medical Leave',
    startDate: '2026-04-12',
    endDate: '2026-04-15',
    days: 4,
    reason: 'Severe throat infection and fever.',
    status: 'Approved',
    appliedOn: '2026-04-10',
  },
  {
    id: 'LV-1120',
    employeeCode: 'EMP-002',
    employeeName: 'Prof. Jane Smith',
    leaveType: 'Earned Leave',
    startDate: '2026-07-01',
    endDate: '2026-07-05',
    days: 5,
    reason: 'Personal relocation work.',
    status: 'Pending',
    appliedOn: '2026-06-20',
  },
  {
    id: 'LV-1215',
    employeeCode: 'EMP-003',
    employeeName: 'Mr. Alice R. Johnson',
    leaveType: 'Casual Leave',
    startDate: '2026-06-15',
    endDate: '2026-06-16',
    days: 2,
    reason: 'Personal work.',
    status: 'Approved',
    appliedOn: '2026-06-12',
  },
  {
    id: 'LV-1250',
    employeeCode: 'EMP-004',
    employeeName: 'Dr. Bob Williams',
    leaveType: 'Casual Leave',
    startDate: '2026-08-01',
    endDate: '2026-08-03',
    days: 3,
    reason: 'Paternity leave.',
    status: 'Pending',
    appliedOn: '2026-06-25',
  },
  {
    id: 'LV-1288',
    employeeCode: 'EMP-005',
    employeeName: 'Ms. Charlie M. Brown',
    leaveType: 'Casual Leave',
    startDate: '2026-06-28',
    endDate: '2026-06-29',
    days: 2,
    reason: 'Attending relative marriage.',
    status: 'Rejected',
    appliedOn: '2026-06-22',
  },
  {
    id: 'LV-1304',
    employeeCode: 'EMP-006',
    employeeName: 'Prof. David Davis',
    leaveType: 'Medical Leave',
    startDate: '2026-06-24',
    endDate: '2026-06-25',
    days: 2,
    reason: 'Medical checkup.',
    status: 'Approved',
    appliedOn: '2026-06-23',
  },
  {
    id: 'LV-1322',
    employeeCode: 'EMP-007',
    employeeName: 'Dr. Eve L. Miller',
    leaveType: 'Earned Leave',
    startDate: '2026-07-10',
    endDate: '2026-07-15',
    days: 5,
    reason: 'Relocation setup.',
    status: 'Pending',
    appliedOn: '2026-06-24',
  },
];

export default function LeaveReports() {
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>('All');
  const [filterLeaveType, setFilterLeaveType] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);

  // Applied filter states
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string>('All');
  const [appliedLeaveType, setAppliedLeaveType] = useState<string | null>(null);
  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(null);
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(null);

  const leaveTypes = [
    { id: 'Casual Leave', name: 'Casual Leave' },
    { id: 'Medical Leave', name: 'Medical Leave' },
    { id: 'Earned Leave', name: 'Earned Leave' },
  ];

  const formatDateToString = (date: Date | null | undefined) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const stats = useMemo(() => {
    const total = MOCK_LEAVES.length;
    const approved = MOCK_LEAVES.filter(l => l.status === 'Approved').length;
    const pending = MOCK_LEAVES.filter(l => l.status === 'Pending').length;
    const rejected = MOCK_LEAVES.filter(l => l.status === 'Rejected').length;
    return { total, approved, pending, rejected };
  }, []);

  const filteredLeaves = useMemo(() => {
    if (!hasSearched) return [];
    const fromDateStr = formatDateToString(appliedFromDate);
    const toDateStr = formatDateToString(appliedToDate);
    return MOCK_LEAVES.filter(item => {
      if (appliedStatusFilter !== 'All' && item.status !== appliedStatusFilter)
        return false;
      if (appliedLeaveType && item.leaveType !== appliedLeaveType) return false;
      if (fromDateStr && item.startDate < fromDateStr) return false;
      if (toDateStr && item.startDate > toDateStr) return false;
      return true;
    });
  }, [
    hasSearched,
    appliedStatusFilter,
    appliedLeaveType,
    appliedFromDate,
    appliedToDate,
  ]);

  const handleSearch = () => {
    setAppliedLeaveType(filterLeaveType);
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
    setAppliedStatusFilter(selectedStatusFilter);
    setHasSearched(true);
  };

  const handleStatCardClick = (status: string) => {
    setSelectedStatusFilter(status);
    setAppliedStatusFilter(status);
    setAppliedLeaveType(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
    setFilterLeaveType(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilterLeaveType(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setSelectedStatusFilter('All');

    setAppliedLeaveType(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
    setAppliedStatusFilter('All');
    setHasSearched(false);
  };

  return (
    <FormPage
      title="Employee Leave Reports"
      description="Analyze applied leaves, approval metrics, and individual request details across all departments."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Employee Services', to: '/home/sub-menu/employee-services' },
        { label: 'Employee Reports', to: '/home/sub-menu/employee-reports' },
        { label: 'Leave Reports', to: '#' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Leave Balances Summary */}
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
              title="Total Applications"
              value={stats.total}
              icon="calendar"
              colorScheme="blue"
              subtitle="All requests logged"
            />
          </div>

          <div
            onClick={() => handleStatCardClick('Approved')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              selectedStatusFilter === 'Approved'
                ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Approved Leaves"
              value={stats.approved}
              icon="calendar-plus"
              colorScheme="green"
              subtitle="Completed sanctions"
            />
          </div>

          <div
            onClick={() => handleStatCardClick('Pending')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              selectedStatusFilter === 'Pending'
                ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Pending Approval"
              value={stats.pending}
              icon="clock"
              colorScheme="amber"
              subtitle="Awaiting HOD action"
            />
          </div>

          <div
            onClick={() => handleStatCardClick('Rejected')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              selectedStatusFilter === 'Rejected'
                ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Rejected Leaves"
              value={stats.rejected}
              icon="calendar-times"
              colorScheme="red"
              subtitle="Declined applications"
            />
          </div>
        </div>

        {/* Filter Card */}
        <FormCard title="Report Filters" icon="filter">
          <FormGrid columns={3}>
            <DropDownList
              label="Leave Type"
              placeholder="Select Leave Type"
              data={leaveTypes}
              textField="name"
              valueField="id"
              value={filterLeaveType}
              onChange={val => setFilterLeaveType(val as string)}
            />
            <DatePicker
              label="Leave Date From"
              placeholder="Select start date"
              value={filterFromDate ?? undefined}
              onChange={date => setFilterFromDate(date ?? null)}
            />
            <DatePicker
              label="Leave Date To"
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

        {/* Leave Requests Table */}
        {hasSearched && (
          <FormCard
            title={`${appliedStatusFilter} Leave Requests`}
            subtitle="Click on any summary card above to filter the report table below."
            headerAction={
              (appliedStatusFilter !== 'All' ||
                appliedLeaveType ||
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
              data={filteredLeaves}
              columns={[
                {
                  cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                  width: '40px',
                },
                { field: 'id', header: 'Ref ID' },
                { field: 'employeeCode', header: 'Code' },
                {
                  field: 'employeeName',
                  header: 'Employee',
                  cell: (item: MockLeaveRequest) => (
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.employeeName}
                    </span>
                  ),
                },
                { field: 'leaveType', header: 'Leave Type' },
                {
                  header: 'Duration',
                  cell: (item: MockLeaveRequest) => (
                    <span className="text-xs text-gray-700 dark:text-zinc-300">
                      {item.startDate} to {item.endDate}
                    </span>
                  ),
                },
                {
                  field: 'days',
                  header: 'Days',
                  cell: (item: MockLeaveRequest) => (
                    <span className="font-bold text-gray-800 dark:text-zinc-200">
                      {item.days}
                    </span>
                  ),
                },
                {
                  field: 'reason',
                  header: 'Reason',
                  cell: (item: MockLeaveRequest) => (
                    <span
                      className="truncate max-w-xs block"
                      title={item.reason}
                    >
                      {item.reason}
                    </span>
                  ),
                },
                {
                  field: 'appliedOn',
                  header: 'Applied On',
                  cell: (item: MockLeaveRequest) => (
                    <span className="text-xs text-gray-500">
                      {item.appliedOn}
                    </span>
                  ),
                },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (item: MockLeaveRequest) => {
                    let variant: 'approved' | 'pending' | 'rejected' =
                      'pending';
                    if (item.status === 'Approved') variant = 'approved';
                    if (item.status === 'Rejected') variant = 'rejected';
                    return (
                      <StatusBadge variant={variant} label={item.status} />
                    );
                  },
                },
              ]}
              searchBox
              searchPlaceholder="Search by name, code, type, reason..."
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
