import { useMemo, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';

interface HeadcountReportItem {
  positionCode: string;
  department: string;
  designation: string;
  employmentType: string;
  sanctionedCount: number;
  recruitedCount: number;
  vacantCount: number;
  financialYear: string;
  govtOrderRef: string;
  status: 'Active' | 'Frozen' | 'Abolished';
}

const MOCK_HEADCOUNT: HeadcountReportItem[] = [
  {
    positionCode: 'POS-CS-PROF',
    department: 'Computer Science',
    designation: 'Professor',
    employmentType: 'Permanent',
    sanctionedCount: 3,
    recruitedCount: 2,
    vacantCount: 1,
    financialYear: '2025-2026',
    govtOrderRef: 'GO/EST/2024/782',
    status: 'Active',
  },
  {
    positionCode: 'POS-PH-AP',
    department: 'Physics',
    designation: 'Assistant Professor',
    employmentType: 'Permanent',
    sanctionedCount: 5,
    recruitedCount: 5,
    vacantCount: 0,
    financialYear: '2025-2026',
    govtOrderRef: 'GO/EST/2024/783',
    status: 'Active',
  },
  {
    positionCode: 'POS-MA-LECT',
    department: 'Mathematics',
    designation: 'Lecturer',
    employmentType: 'Contractual',
    sanctionedCount: 2,
    recruitedCount: 3,
    vacantCount: -1,
    financialYear: '2025-2026',
    govtOrderRef: 'GO/EST/2024/801',
    status: 'Frozen',
  },
  {
    positionCode: 'POS-CH-ASSOC',
    department: 'Chemistry',
    designation: 'Associate Professor',
    employmentType: 'Permanent',
    sanctionedCount: 4,
    recruitedCount: 3,
    vacantCount: 1,
    financialYear: '2025-2026',
    govtOrderRef: 'GO/EST/2024/850',
    status: 'Active',
  },
  {
    positionCode: 'POS-ADM-REG',
    department: 'Administration',
    designation: 'Registrar',
    employmentType: 'Permanent',
    sanctionedCount: 1,
    recruitedCount: 1,
    vacantCount: 0,
    financialYear: '2025-2026',
    govtOrderRef: 'GO/EST/2024/900',
    status: 'Active',
  },
  {
    positionCode: 'POS-CS-LECT',
    department: 'Computer Science',
    designation: 'Lecturer',
    employmentType: 'Guest',
    sanctionedCount: 6,
    recruitedCount: 4,
    vacantCount: 2,
    financialYear: '2025-2026',
    govtOrderRef: 'GO/EST/2024/912',
    status: 'Active',
  },
];

const DEPT_OPTIONS = [
  { name: 'All Departments', value: 'All' },
  { name: 'Computer Science', value: 'Computer Science' },
  { name: 'Physics', value: 'Physics' },
  { name: 'Chemistry', value: 'Chemistry' },
  { name: 'Mathematics', value: 'Mathematics' },
  { name: 'Administration', value: 'Administration' },
];

const STATUS_OPTIONS = [
  { name: 'All Statuses', value: 'All' },
  { name: 'Active', value: 'Active' },
  { name: 'Frozen', value: 'Frozen' },
  { name: 'Abolished', value: 'Abolished' },
];

const EMP_TYPE_OPTIONS = [
  { name: 'All Types', value: 'All' },
  { name: 'Permanent', value: 'Permanent' },
  { name: 'Contractual', value: 'Contractual' },
  { name: 'Guest', value: 'Guest' },
];

const FY_OPTIONS = [
  { name: 'All FY', value: 'All' },
  { name: '2025-2026', value: '2025-2026' },
  { name: '2026-2027', value: '2026-2027' },
];

export default function HeadcountReports() {
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterEmpType, setFilterEmpType] = useState('All');
  const [filterFy, setFilterFy] = useState('All');

  const [hasSearched, setHasSearched] = useState(false);
  const [appliedDept, setAppliedDept] = useState('All');
  const [appliedStatus, setAppliedStatus] = useState('All');
  const [appliedEmpType, setAppliedEmpType] = useState('All');
  const [appliedFy, setAppliedFy] = useState('All');

  const stats = useMemo(() => {
    const totalSanctioned = MOCK_HEADCOUNT.reduce(
      (a, c) => a + c.sanctionedCount,
      0
    );
    const totalRecruited = MOCK_HEADCOUNT.reduce(
      (a, c) => a + c.recruitedCount,
      0
    );
    const totalVacant = MOCK_HEADCOUNT.reduce(
      (a, c) => a + (c.vacantCount > 0 ? c.vacantCount : 0),
      0
    );
    const overAllocated = MOCK_HEADCOUNT.filter(p => p.vacantCount < 0).length;
    return { totalSanctioned, totalRecruited, totalVacant, overAllocated };
  }, []);

  const filteredData = useMemo(() => {
    if (!hasSearched) return [];
    return MOCK_HEADCOUNT.filter(p => {
      if (appliedDept !== 'All' && p.department !== appliedDept) return false;
      if (appliedStatus !== 'All' && p.status !== appliedStatus) return false;
      if (appliedEmpType !== 'All' && p.employmentType !== appliedEmpType)
        return false;
      if (appliedFy !== 'All' && p.financialYear !== appliedFy) return false;
      return true;
    });
  }, [hasSearched, appliedDept, appliedStatus, appliedEmpType, appliedFy]);

  const handleSearch = () => {
    setAppliedDept(filterDept);
    setAppliedStatus(filterStatus);
    setAppliedEmpType(filterEmpType);
    setAppliedFy(filterFy);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilterDept('All');
    setFilterStatus('All');
    setFilterEmpType('All');
    setFilterFy('All');
    setAppliedDept('All');
    setAppliedStatus('All');
    setAppliedEmpType('All');
    setAppliedFy('All');
    setHasSearched(false);
  };

  const columns: Controls.ColumnProps<HeadcountReportItem>[] = [
    { field: 'positionCode', header: 'Position Code' },
    { field: 'department', header: 'Department / Unit' },
    { field: 'designation', header: 'Designation' },
    { field: 'employmentType', header: 'Type' },
    { field: 'sanctionedCount', header: 'Sanctioned' },
    { field: 'recruitedCount', header: 'Recruited' },
    {
      field: 'vacantCount',
      header: 'Vacant',
      cell: item => {
        const isNegative = item.vacantCount < 0;
        return (
          <span
            className={
              isNegative
                ? 'text-red-600 font-semibold'
                : item.vacantCount === 0
                  ? 'text-slate-500'
                  : 'text-green-600 font-semibold'
            }
          >
            {item.vacantCount < 0
              ? `Over by ${Math.abs(item.vacantCount)}`
              : item.vacantCount}
          </span>
        );
      },
    },
    { field: 'financialYear', header: 'Financial Year' },
    { field: 'govtOrderRef', header: 'Govt. Order Ref.' },
    {
      field: 'status',
      header: 'Status',
      cell: item => {
        let variant: 'approved' | 'pending' | 'rejected' | 'neutral' =
          'neutral';
        if (item.status === 'Active') variant = 'approved';
        if (item.status === 'Frozen') variant = 'pending';
        if (item.status === 'Abolished') variant = 'rejected';
        return <StatusBadge label={item.status} variant={variant} />;
      },
    },
  ];

  return (
    <FormPage
      title="Headcount Control Reports"
      description="Audit sanctioned positions, recruited headcounts, vacancies, and over-allocation flags across all units."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Employee Services', to: '/home/sub-menu/employee-services' },
        { label: 'Employee Reports', to: '/home/sub-menu/employee-reports' },
        { label: 'Headcount Reports', to: '#' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Sanctioned"
            value={stats.totalSanctioned}
            icon="assignment"
            colorScheme="blue"
            subtitle="Government-approved positions"
          />
          <StatCard
            title="Total Recruited"
            value={stats.totalRecruited}
            icon="groups"
            colorScheme="green"
            subtitle="Currently filled positions"
          />
          <StatCard
            title="Total Vacancies"
            value={stats.totalVacant}
            icon="person_off"
            colorScheme="orange"
            subtitle="Open positions across units"
          />
          <StatCard
            title="Over-Allocated Posts"
            value={stats.overAllocated}
            icon="warning"
            colorScheme="red"
            subtitle="Posts exceeding sanctioned limit"
          />
        </div>

        {/* Filters */}
        <FormCard title="Report Filters" icon="filter">
          <FormGrid columns={4}>
            <DropDownList
              label="Department / Unit"
              data={DEPT_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="All Departments"
              value={filterDept}
              onChange={v => setFilterDept(String(v ?? 'All'))}
            />
            <DropDownList
              label="Employment Type"
              data={EMP_TYPE_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="All Types"
              value={filterEmpType}
              onChange={v => setFilterEmpType(String(v ?? 'All'))}
            />
            <DropDownList
              label="Position Status"
              data={STATUS_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="All Statuses"
              value={filterStatus}
              onChange={v => setFilterStatus(String(v ?? 'All'))}
            />
            <DropDownList
              label="Financial Year"
              data={FY_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="All FY"
              value={filterFy}
              onChange={v => setFilterFy(String(v ?? 'All'))}
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
            title="Sanctioned Position Audit"
            subtitle="Showing filtered headcount data for the selected criteria."
          >
            <GridPanel
              data={filteredData}
              columns={columns}
              searchBox
              searchPlaceholder="Search by position code, department, designation..."
              emptyMessage="No positions match your filter criteria."
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
