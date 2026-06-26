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

interface MockResearchRecord {
  id: string;
  employeeCode: string;
  employeeName: string;
  title: string;
  type: 'Journal' | 'Conference' | 'Book Chapter' | 'Patent';
  journalName: string;
  year: number;
  index: 'SCI' | 'Scopus' | 'UGC Care List' | 'None';
  status: 'Approved' | 'Pending' | 'Rejected';
  submittedOn: string;
}
1;

const MOCK_RESEARCH: MockResearchRecord[] = [
  {
    id: 'PUB-4091',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    title: 'Adaptive Learning Models using Neural Attention Systems',
    type: 'Journal',
    journalName: 'IEEE Transactions on Pattern Analysis',
    year: 2025,
    index: 'SCI',
    status: 'Approved',
    submittedOn: '2025-02-14',
  },
  {
    id: 'PUB-3922',
    employeeCode: 'EMP-001',
    employeeName: 'Dr. John A. Doe',
    title:
      'Clustering Student Performance Data using unsupervised hybrid models',
    type: 'Conference',
    journalName: 'International Conference on Educational Technology (ICET)',
    year: 2024,
    index: 'UGC Care List',
    status: 'Approved',
    submittedOn: '2024-11-05',
  },
  {
    id: 'PUB-4112',
    employeeCode: 'EMP-002',
    employeeName: 'Prof. Jane Smith',
    title: 'Quantum Teleportation and Spin-Exchange Dynamics in Superlattices',
    type: 'Journal',
    journalName: 'Physical Review Letters',
    year: 2026,
    index: 'SCI',
    status: 'Approved',
    submittedOn: '2026-01-20',
  },
  {
    id: 'PUB-4230',
    employeeCode: 'EMP-002',
    employeeName: 'Prof. Jane Smith',
    title: 'Low Temperature Spin Hall Conductance Mechanisms',
    type: 'Patent',
    journalName: 'Indian Patent Office',
    year: 2025,
    index: 'None',
    status: 'Pending',
    submittedOn: '2025-08-12',
  },
  {
    id: 'PUB-4510',
    employeeCode: 'EMP-004',
    employeeName: 'Dr. Bob Williams',
    title: 'Entangled State Phase Shift Under Varying Magnetic Fields',
    type: 'Conference',
    journalName: 'AIP Conference Proceedings',
    year: 2025,
    index: 'Scopus',
    status: 'Approved',
    submittedOn: '2025-05-30',
  },
  {
    id: 'PUB-4680',
    employeeCode: 'EMP-005',
    employeeName: 'Ms. Charlie M. Brown',
    title: 'Optimizing Parallel Data Pipelines in Deep Learning Frameworks',
    type: 'Book Chapter',
    journalName: 'Springer LNCS',
    year: 2025,
    index: 'Scopus',
    status: 'Pending',
    submittedOn: '2025-12-01',
  },
  {
    id: 'PUB-4790',
    employeeCode: 'EMP-007',
    employeeName: 'Dr. Eve L. Miller',
    title: 'Superconducting Qubits: Review on Decoherence Safeguards',
    type: 'Journal',
    journalName: 'Nature Quantum Information',
    year: 2026,
    index: 'SCI',
    status: 'Pending',
    submittedOn: '2026-04-18',
  },
];

export default function ResearchReports() {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [filterIndex, setFilterIndex] = useState<string | null>(null);
  const [filterStartYear, setFilterStartYear] = useState<string | null>(null);
  const [filterEndYear, setFilterEndYear] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);

  // Applied filter states
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedTypeFilter, setAppliedTypeFilter] = useState<string>('All');
  const [appliedIndex, setAppliedIndex] = useState<string | null>(null);
  const [appliedStartYear, setAppliedStartYear] = useState<string | null>(null);
  const [appliedEndYear, setAppliedEndYear] = useState<string | null>(null);
  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(null);
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(null);

  const indexingCategories = [
    { id: 'SCI', name: 'SCI' },
    { id: 'Scopus', name: 'Scopus' },
    { id: 'UGC Care List', name: 'UGC Care List' },
    { id: 'None', name: 'None' },
  ];

  const publicationYears = [
    { id: '2024', name: '2024' },
    { id: '2025', name: '2025' },
    { id: '2026', name: '2026' },
  ];

  const formatDateToString = (date: Date | null | undefined) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const stats = useMemo(() => {
    const total = MOCK_RESEARCH.length;
    const journals = MOCK_RESEARCH.filter(r => r.type === 'Journal').length;
    const conferences = MOCK_RESEARCH.filter(
      r => r.type === 'Conference'
    ).length;
    const patents = MOCK_RESEARCH.filter(r => r.type === 'Patent').length;
    return { total, journals, conferences, patents };
  }, []);

  const filteredResearch = useMemo(() => {
    if (!hasSearched) return [];
    const fromDateStr = formatDateToString(appliedFromDate);
    const toDateStr = formatDateToString(appliedToDate);

    return MOCK_RESEARCH.filter(item => {
      if (appliedTypeFilter !== 'All' && item.type !== appliedTypeFilter)
        return false;
      if (appliedIndex && item.index !== appliedIndex) return false;
      if (appliedStartYear && item.year < Number(appliedStartYear))
        return false;
      if (appliedEndYear && item.year > Number(appliedEndYear)) return false;
      if (fromDateStr && item.submittedOn < fromDateStr) return false;
      if (toDateStr && item.submittedOn > toDateStr) return false;
      return true;
    });
  }, [
    hasSearched,
    appliedTypeFilter,
    appliedIndex,
    appliedStartYear,
    appliedEndYear,
    appliedFromDate,
    appliedToDate,
  ]);

  const handleSearch = () => {
    setAppliedIndex(filterIndex);
    setAppliedStartYear(filterStartYear);
    setAppliedEndYear(filterEndYear);
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
    setAppliedTypeFilter(selectedTypeFilter);
    setHasSearched(true);
  };

  const handleStatCardClick = (type: string) => {
    setSelectedTypeFilter(type);
    setAppliedTypeFilter(type);
    setAppliedIndex(null);
    setAppliedStartYear(null);
    setAppliedEndYear(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
    setFilterIndex(null);
    setFilterStartYear(null);
    setFilterEndYear(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilterIndex(null);
    setFilterStartYear(null);
    setFilterEndYear(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setSelectedTypeFilter('All');

    setAppliedIndex(null);
    setAppliedStartYear(null);
    setAppliedEndYear(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
    setAppliedTypeFilter('All');
    setHasSearched(false);
  };

  return (
    <FormPage
      title="Faculty Research & Publications Reports"
      description="Track academic publication entries, patents log, and journal index categories across all faculty members."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Employee Services', to: '/home/sub-menu/employee-services' },
        { label: 'Employee Reports', to: '/home/sub-menu/employee-reports' },
        { label: 'Research Reports', to: '#' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* Summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            onClick={() => handleStatCardClick('All')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              selectedTypeFilter === 'All'
                ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Total Publications"
              value={stats.total}
              icon="book"
              colorScheme="blue"
              subtitle="All registered logs"
            />
          </div>

          <div
            onClick={() => handleStatCardClick('Journal')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              selectedTypeFilter === 'Journal'
                ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Journal Articles"
              value={stats.journals}
              icon="bookmark"
              colorScheme="indigo"
              subtitle="Peer-reviewed papers"
            />
          </div>

          <div
            onClick={() => handleStatCardClick('Conference')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              selectedTypeFilter === 'Conference'
                ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Conferences"
              value={stats.conferences}
              icon="users"
              colorScheme="amber"
              subtitle="Conference proceedings"
            />
          </div>

          <div
            onClick={() => handleStatCardClick('Patent')}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              selectedTypeFilter === 'Patent'
                ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-950'
                : ''
            }`}
          >
            <StatCard
              title="Patents"
              value={stats.patents}
              icon="verified"
              colorScheme="green"
              subtitle="Registered & pending patents"
            />
          </div>
        </div>

        {/* Filter Card */}
        <FormCard title="Report Filters" icon="filter">
          <FormGrid columns={4}>
            <DropDownList
              label="Indexing Category"
              placeholder="Select Indexing"
              data={indexingCategories}
              textField="name"
              valueField="id"
              value={filterIndex}
              onChange={val => setFilterIndex(val as string)}
            />
            <DropDownList
              label="Published From Year"
              placeholder="Select Year"
              data={publicationYears}
              textField="name"
              valueField="id"
              value={filterStartYear}
              onChange={val => setFilterStartYear(val as string)}
            />
            <DropDownList
              label="Published To Year"
              placeholder="Select Year"
              data={publicationYears}
              textField="name"
              valueField="id"
              value={filterEndYear}
              onChange={val => setFilterEndYear(val as string)}
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

        {/* Publications grid */}
        {hasSearched && (
          <FormCard
            title={`${appliedTypeFilter} Publication Records`}
            subtitle="Click on any summary card above to filter the report table below."
            headerAction={
              (appliedTypeFilter !== 'All' ||
                appliedIndex ||
                appliedStartYear ||
                appliedEndYear ||
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
              data={filteredResearch}
              columns={[
                {
                  cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                  width: '40px',
                },
                { field: 'id', header: 'Pub ID' },
                { field: 'employeeCode', header: 'Code' },
                {
                  field: 'employeeName',
                  header: 'Faculty Member',
                  cell: (item: MockResearchRecord) => (
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.employeeName}
                    </span>
                  ),
                },
                {
                  field: 'title',
                  header: 'Publication Title',
                  cell: (item: MockResearchRecord) => (
                    <span
                      className="truncate max-w-sm block font-medium"
                      title={item.title}
                    >
                      {item.title}
                    </span>
                  ),
                },
                { field: 'type', header: 'Type' },
                {
                  field: 'journalName',
                  header: 'Journal/Publisher',
                  cell: (item: MockResearchRecord) => (
                    <span
                      className="truncate max-w-xs block"
                      title={item.journalName}
                    >
                      {item.journalName}
                    </span>
                  ),
                },
                {
                  field: 'year',
                  header: 'Year',
                  cell: (item: MockResearchRecord) => (
                    <span className="font-bold text-gray-800 dark:text-zinc-200">
                      {item.year}
                    </span>
                  ),
                },
                {
                  field: 'index',
                  header: 'Indexing',
                  cell: (item: MockResearchRecord) => (
                    <span className="text-xs font-semibold text-gray-600 dark:text-zinc-400">
                      {item.index}
                    </span>
                  ),
                },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (item: MockResearchRecord) => {
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
              searchPlaceholder="Search by name, code, title, publisher, index..."
            />
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
