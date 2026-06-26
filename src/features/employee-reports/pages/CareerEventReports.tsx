import { useMemo, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';

interface CareerEventRecord {
  id: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  eventType: string;
  eventDate: string;
  previousDesignation: string;
  newDesignation: string;
  orderRef: string;
  remarks: string;
}

const MOCK_CAREER_EVENTS: CareerEventRecord[] = [
  {
    id: 'CE-001',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    department: 'Computer Science',
    designation: 'Professor',
    eventType: 'Promotion',
    eventDate: '2025-07-01',
    previousDesignation: 'Associate Professor',
    newDesignation: 'Professor',
    orderRef: 'UNI/EST/2025/994',
    remarks: 'Promoted under Career Advancement Scheme (CAS).',
  },
  {
    id: 'CE-002',
    employeeCode: 'EMP-002',
    employeeName: 'Prof. Jane Smith',
    department: 'Physics',
    designation: 'Associate Professor',
    eventType: 'Transfer',
    eventDate: '2025-01-15',
    previousDesignation: 'Associate Professor',
    newDesignation: 'Associate Professor',
    orderRef: 'UNI/EST/2025/112',
    remarks: 'Transferred due to departmental restructuring.',
  },
  {
    id: 'CE-003',
    employeeCode: 'EMP-003',
    employeeName: 'Mr. Alice R. Johnson',
    department: 'Mathematics',
    designation: 'Lecturer',
    eventType: 'Deputation',
    eventDate: '2025-03-10',
    previousDesignation: 'Lecturer',
    newDesignation: 'Lecturer',
    orderRef: 'UNI/EST/2025/305',
    remarks: 'Deputed to Examination Controller Office.',
  },
  {
    id: 'CE-004',
    employeeCode: 'EMP-004',
    employeeName: 'Dr. Bob Williams',
    department: 'Chemistry',
    designation: 'Associate Professor',
    eventType: 'Retirement',
    eventDate: '2026-01-31',
    previousDesignation: 'Associate Professor',
    newDesignation: '—',
    orderRef: 'UNI/EST/2026/002',
    remarks: 'Superannuation retirement effective 31 Jan 2026.',
  },
  {
    id: 'CE-005',
    employeeCode: 'EMP-005',
    employeeName: 'Ms. Clara M. Davis',
    department: 'Administration',
    designation: 'Assistant Professor',
    eventType: 'Reinstatement',
    eventDate: '2025-09-01',
    previousDesignation: 'Assistant Professor',
    newDesignation: 'Assistant Professor',
    orderRef: 'UNI/EST/2025/852',
    remarks: 'Reinstated following leave completion.',
  },
];

const EVENT_TYPE_OPTIONS = [
  { name: 'All', value: 'All' },
  { name: 'Promotion', value: 'Promotion' },
  { name: 'Transfer', value: 'Transfer' },
  { name: 'Deputation', value: 'Deputation' },
  { name: 'Separation', value: 'Separation' },
  { name: 'Retirement', value: 'Retirement' },
  { name: 'Reinstatement', value: 'Reinstatement' },
];

const DEPT_OPTIONS = [
  { name: 'All', value: 'All' },
  { name: 'Computer Science', value: 'Computer Science' },
  { name: 'Physics', value: 'Physics' },
  { name: 'Chemistry', value: 'Chemistry' },
  { name: 'Mathematics', value: 'Mathematics' },
  { name: 'Administration', value: 'Administration' },
];

const eventVariant = (
  type: string
): 'approved' | 'pending' | 'rejected' | 'neutral' => {
  if (type === 'Promotion' || type === 'Reinstatement') return 'approved';
  if (type === 'Transfer' || type === 'Deputation') return 'pending';
  if (type === 'Separation' || type === 'Retirement') return 'rejected';
  return 'neutral';
};

export default function CareerEventReports() {
  const [filterEmpCode, setFilterEmpCode] = useState('');
  const [filterEventType, setFilterEventType] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);

  // Applied states
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedEmpCode, setAppliedEmpCode] = useState('');
  const [appliedEventType, setAppliedEventType] = useState('All');
  const [appliedDept, setAppliedDept] = useState('All');
  const [appliedDateFrom, setAppliedDateFrom] = useState<Date | null>(null);
  const [appliedDateTo, setAppliedDateTo] = useState<Date | null>(null);

  const stats = useMemo(() => {
    const promotions = MOCK_CAREER_EVENTS.filter(
      e => e.eventType === 'Promotion'
    ).length;
    const transfers = MOCK_CAREER_EVENTS.filter(
      e => e.eventType === 'Transfer' || e.eventType === 'Deputation'
    ).length;
    const separations = MOCK_CAREER_EVENTS.filter(
      e => e.eventType === 'Separation' || e.eventType === 'Retirement'
    ).length;
    return {
      total: MOCK_CAREER_EVENTS.length,
      promotions,
      transfers,
      separations,
    };
  }, []);

  const filteredEvents = useMemo(() => {
    if (!hasSearched) return [];
    return MOCK_CAREER_EVENTS.filter(e => {
      if (
        appliedEmpCode &&
        !e.employeeCode.toLowerCase().includes(appliedEmpCode.toLowerCase()) &&
        !e.employeeName.toLowerCase().includes(appliedEmpCode.toLowerCase())
      )
        return false;
      if (appliedEventType !== 'All' && e.eventType !== appliedEventType)
        return false;
      if (appliedDept !== 'All' && e.department !== appliedDept) return false;
      if (
        appliedDateFrom &&
        e.eventDate < appliedDateFrom.toISOString().split('T')[0]
      )
        return false;
      if (
        appliedDateTo &&
        e.eventDate > appliedDateTo.toISOString().split('T')[0]
      )
        return false;
      return true;
    });
  }, [
    hasSearched,
    appliedEmpCode,
    appliedEventType,
    appliedDept,
    appliedDateFrom,
    appliedDateTo,
  ]);

  const handleSearch = () => {
    setAppliedEmpCode(filterEmpCode);
    setAppliedEventType(filterEventType);
    setAppliedDept(filterDept);
    setAppliedDateFrom(filterDateFrom);
    setAppliedDateTo(filterDateTo);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilterEmpCode('');
    setFilterEventType('All');
    setFilterDept('All');
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setAppliedEmpCode('');
    setAppliedEventType('All');
    setAppliedDept('All');
    setAppliedDateFrom(null);
    setAppliedDateTo(null);
    setHasSearched(false);
  };

  const columns: Controls.ColumnProps<CareerEventRecord>[] = [
    { field: 'employeeCode', header: 'Emp Code' },
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'department', header: 'Department' },
    {
      field: 'eventType',
      header: 'Event Type',
      cell: item => (
        <StatusBadge
          label={item.eventType}
          variant={eventVariant(item.eventType)}
        />
      ),
    },
    { field: 'eventDate', header: 'Effective Date' },
    { field: 'previousDesignation', header: 'From Designation' },
    { field: 'newDesignation', header: 'To Designation' },
    { field: 'orderRef', header: 'Order Ref.' },
    { field: 'remarks', header: 'Remarks' },
  ];

  return (
    <FormPage
      title="Career Event Reports"
      description="Audit all employee career lifecycle events — promotions, transfers, deputation, retirement, and reinstatements."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Employee Services', to: '/home/sub-menu/employee-services' },
        { label: 'Employee Reports', to: '/home/sub-menu/employee-reports' },
        { label: 'Career Event Reports', to: '#' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Events Logged"
            value={stats.total}
            icon="timeline"
            colorScheme="blue"
            subtitle="All career lifecycle events"
          />
          <StatCard
            title="Promotions"
            value={stats.promotions}
            icon="trending_up"
            colorScheme="green"
            subtitle="Career advancement events"
          />
          <StatCard
            title="Transfers / Deputation"
            value={stats.transfers}
            icon="swap_horiz"
            colorScheme="orange"
            subtitle="Movement across departments"
          />
          <StatCard
            title="Separations / Retirement"
            value={stats.separations}
            icon="logout"
            colorScheme="red"
            subtitle="Exits from the institution"
          />
        </div>

        {/* Filters */}
        <FormCard title="Report Filters" icon="filter">
          <FormGrid columns={3}>
            <TextBox
              label="Employee Name / Code"
              placeholder="Search by name or code"
              value={filterEmpCode}
              onChange={v => setFilterEmpCode(v)}
            />
            <DropDownList
              label="Event Type"
              data={EVENT_TYPE_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="All Event Types"
              value={filterEventType}
              onChange={v => setFilterEventType(String(v ?? 'All'))}
            />
            <DropDownList
              label="Department"
              data={DEPT_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="All Departments"
              value={filterDept}
              onChange={v => setFilterDept(String(v ?? 'All'))}
            />
            <DatePicker
              label="Event Date From"
              placeholder="Select start date"
              value={filterDateFrom ?? undefined}
              onChange={d => setFilterDateFrom(d ?? null)}
            />
            <DatePicker
              label="Event Date To"
              placeholder="Select end date"
              value={filterDateTo ?? undefined}
              onChange={d => setFilterDateTo(d ?? null)}
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
              icon="search"
              onClick={handleSearch}
            />
          </div>
        </FormCard>

        {/* Results Grid */}
        {hasSearched && (
          <FormCard
            title="Career Event Audit Log"
            subtitle="Showing filtered career events from the system."
          >
            <GridPanel
              data={filteredEvents}
              columns={columns}
              searchBox
              searchPlaceholder="Search by name, code, event type..."
              emptyMessage="No career events match your filter criteria."
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
