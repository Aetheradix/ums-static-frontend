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

interface MockTravelRecord {
  id: string;
  employeeCode: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  mode: string;
  sanctionedBy: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Completed';
}

const MOCK_TRAVELS: MockTravelRecord[] = [
  {
    id: 'TRV-4410',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    startDate: '2026-05-15',
    endDate: '2026-05-18',
    destination: 'New Delhi (JNU Campus)',
    purpose: 'Academic Conference Presentation',
    mode: 'Air',
    sanctionedBy: 'Registrar',
    status: 'Completed',
  },
  {
    id: 'TRV-4822',
    employeeCode: 'EMP-002',
    employeeName: 'Prof. Jane Smith',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    destination: 'Bhopal (RGPV University)',
    purpose: 'External PhD Viva Examination Duty',
    mode: 'Train',
    sanctionedBy: 'Dean Academics',
    status: 'Approved',
  },
  {
    id: 'TRV-4901',
    employeeCode: 'EMP-003',
    employeeName: 'Mr. Alice R. Johnson',
    startDate: '2026-06-28',
    endDate: '2026-06-30',
    destination: 'Mumbai (IIT Bombay)',
    purpose: 'Administrative Training Program',
    mode: 'Train',
    sanctionedBy: 'Registrar',
    status: 'Pending',
  },
  {
    id: 'TRV-4950',
    employeeCode: 'EMP-004',
    employeeName: 'Dr. Bob Williams',
    startDate: '2026-07-02',
    endDate: '2026-07-05',
    destination: 'Bangalore (IISc)',
    purpose: 'Collaborative Research Visit',
    mode: 'Air',
    sanctionedBy: 'Dean Academics',
    status: 'Approved',
  },
  {
    id: 'TRV-4999',
    employeeCode: 'EMP-005',
    employeeName: 'Ms. Charlie M. Brown',
    startDate: '2026-07-15',
    endDate: '2026-07-20',
    destination: 'Chennai (IIT Madras)',
    purpose: 'Workshop Attendance',
    mode: 'Road',
    sanctionedBy: 'Registrar',
    status: 'Rejected',
  },
];

export default function TravelReports() {
  const [filterMode, setFilterMode] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);

  // Applied filter states
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedMode, setAppliedMode] = useState<string | null>(null);
  const [appliedStatus, setAppliedStatus] = useState<string | null>(null);
  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(null);
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(null);

  const travelModes = [
    { id: 'Air', name: 'Air' },
    { id: 'Train', name: 'Train' },
    { id: 'Road', name: 'Road' },
  ];

  const statuses = [
    { id: 'Completed', name: 'Completed' },
    { id: 'Approved', name: 'Approved' },
    { id: 'Pending', name: 'Pending' },
    { id: 'Rejected', name: 'Rejected' },
  ];

  const formatDateToString = (date: Date | null | undefined) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const stats = useMemo(() => {
    const total = MOCK_TRAVELS.length;
    const approved = MOCK_TRAVELS.filter(
      t => t.status === 'Approved' || t.status === 'Completed'
    ).length;
    const pending = MOCK_TRAVELS.filter(t => t.status === 'Pending').length;
    const rejected = MOCK_TRAVELS.filter(t => t.status === 'Rejected').length;
    return { total, approved, pending, rejected };
  }, []);

  const filteredTravels = useMemo(() => {
    if (!hasSearched) return [];
    const fromDateStr = formatDateToString(appliedFromDate);
    const toDateStr = formatDateToString(appliedToDate);

    return MOCK_TRAVELS.filter(item => {
      if (appliedMode && item.mode !== appliedMode) return false;
      if (appliedStatus) {
        if (appliedStatus === 'ApprovedOrCompleted') {
          if (item.status !== 'Approved' && item.status !== 'Completed')
            return false;
        } else if (item.status !== appliedStatus) {
          return false;
        }
      }
      if (fromDateStr && item.startDate < fromDateStr) return false;
      if (toDateStr && item.startDate > toDateStr) return false;
      return true;
    });
  }, [hasSearched, appliedMode, appliedStatus, appliedFromDate, appliedToDate]);

  const handleSearch = () => {
    setAppliedMode(filterMode);
    setAppliedStatus(filterStatus);
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
    setHasSearched(true);
  };

  const handleStatCardClick = (status: string | null) => {
    setFilterStatus(
      status === 'ApprovedOrCompleted' ? 'Approved' : status || null
    );
    setAppliedStatus(status);
    setAppliedMode(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
    setFilterMode(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilterMode(null);
    setFilterStatus(null);
    setFilterFromDate(null);
    setFilterToDate(null);

    setAppliedMode(null);
    setAppliedStatus(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
    setHasSearched(false);
  };

  return (
    <FormPage
      title="Travel Sanction & Log Reports"
      description="Monitor official duty tours, travel sanctions, approved routes, and status logs."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Employee Services', to: '/home/sub-menu/employee-services' },
        { label: 'Employee Reports', to: '/home/sub-menu/employee-reports' },
        { label: 'Travel Reports', to: '#' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Metric summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            onClick={() => handleStatCardClick(null)}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              hasSearched && appliedStatus === null
                ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Total Travel Logs"
              value={stats.total}
              icon="compass"
              colorScheme="blue"
              subtitle="All logged tours"
            />
          </div>

          <div
            onClick={() => handleStatCardClick('ApprovedOrCompleted')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              hasSearched && appliedStatus === 'ApprovedOrCompleted'
                ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Sanctioned Tours"
              value={stats.approved}
              icon="check"
              colorScheme="green"
              subtitle="Approved or completed"
            />
          </div>

          <div
            onClick={() => handleStatCardClick('Pending')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              hasSearched && appliedStatus === 'Pending'
                ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Awaiting Sanction"
              value={stats.pending}
              icon="clock"
              colorScheme="amber"
              subtitle="In pending queue"
            />
          </div>

          <div
            onClick={() => handleStatCardClick('Rejected')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              hasSearched && appliedStatus === 'Rejected'
                ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Declined Sanctions"
              value={stats.rejected}
              icon="ban"
              colorScheme="red"
              subtitle="Rejected requests"
            />
          </div>
        </div>

        {/* Filter Card */}
        <FormCard title="Report Filters" icon="filter">
          <FormGrid columns={4}>
            <DropDownList
              label="Travel Mode"
              placeholder="Select Mode"
              data={travelModes}
              textField="name"
              valueField="id"
              value={filterMode}
              onChange={val => setFilterMode(val as string)}
            />
            <DropDownList
              label="Status"
              placeholder="Select Status"
              data={statuses}
              textField="name"
              valueField="id"
              value={filterStatus}
              onChange={val => setFilterStatus(val as string)}
            />
            <DatePicker
              label="Departure From"
              placeholder="Select start date"
              value={filterFromDate ?? undefined}
              onChange={date => setFilterFromDate(date ?? null)}
            />
            <DatePicker
              label="Departure To"
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

        {/* Results grid */}
        {hasSearched && (
          <FormCard
            title="Travel Report Grid"
            subtitle="Filtered results matching criteria above."
          >
            <GridPanel
              data={filteredTravels}
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
                  cell: (item: MockTravelRecord) => (
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.employeeName}
                    </span>
                  ),
                },
                { field: 'destination', header: 'Destination' },
                {
                  header: 'Tour Dates',
                  cell: (item: MockTravelRecord) => (
                    <span className="text-xs text-gray-700 dark:text-zinc-300">
                      {item.startDate} to {item.endDate}
                    </span>
                  ),
                },
                {
                  field: 'purpose',
                  header: 'Purpose',
                  cell: (item: MockTravelRecord) => (
                    <span
                      className="truncate max-w-xs block"
                      title={item.purpose}
                    >
                      {item.purpose}
                    </span>
                  ),
                },
                {
                  field: 'mode',
                  header: 'Mode',
                  cell: (item: MockTravelRecord) => (
                    <span className="font-bold text-gray-800 dark:text-zinc-200">
                      {item.mode}
                    </span>
                  ),
                },
                { field: 'sanctionedBy', header: 'Authority' },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (item: MockTravelRecord) => {
                    let variant: 'approved' | 'pending' | 'rejected' =
                      'pending';
                    if (
                      item.status === 'Completed' ||
                      item.status === 'Approved'
                    ) {
                      variant = 'approved';
                    }
                    if (item.status === 'Rejected') variant = 'rejected';
                    return (
                      <StatusBadge variant={variant} label={item.status} />
                    );
                  },
                },
              ]}
              searchBox
              searchPlaceholder="Search by destination, authority, purpose..."
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
