import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { useGrievance } from '../context';
import type { Grievance } from '../data';

const LEVEL_OPTIONS = [
  { id: null, text: 'All Levels' },
  { id: 'Routine', text: 'Routine' },
  { id: 'Mild', text: 'Mild' },
  { id: 'Severe', text: 'Severe' },
];

const PRIORITY_OPTIONS = [
  { id: null, text: 'All Priorities' },
  { id: 'High', text: 'High' },
  { id: 'Medium', text: 'Medium' },
  { id: 'Low', text: 'Low' },
];

const STATUS_OPTIONS = [
  { id: null, text: 'All Statuses' },
  { id: 'Reported', text: 'Reported' },
  { id: 'Pending', text: 'Pending' },
  { id: 'Resolved', text: 'Resolved' },
];

const MEMBER_TYPE_OPTIONS_INTERNAL = [
  { id: null, text: 'All Member Types' },
  { id: 'Student', text: 'Student' },
  { id: 'Employee', text: 'Employee' },
];

const MEMBER_TYPE_OPTIONS_PUBLIC = [
  { id: null, text: 'All Member Types' },
  { id: 'Employee', text: 'Employee' },
  { id: 'Student', text: 'Student' },
  { id: 'Guest', text: 'Guest/Public' },
];

export default function Reports() {
  const { grievances, categories, triggerNotification } = useGrievance();
  const [activeTab, setActiveTab] = useState<'internal' | 'public'>('internal');

  // Filters State
  const [grvNumber, setGrvNumber] = useState('');
  const [memberId, setMemberId] = useState(''); // for public report filter
  const [memberType, setMemberType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [resDateFrom, setResDateFrom] = useState('');
  const [resDateTo, setResDateTo] = useState('');

  // Results State
  const [filteredResults, setFilteredResults] = useState<Grievance[]>(
    grievances.filter(g => g.memberType !== 'Public')
  );

  const categoryDropdown = [
    { id: null, text: 'All Categories' },
    ...categories.map(c => ({ id: c.name, text: c.name })),
  ];

  // Perform search / filter execution
  const handleSearch = () => {
    const results = grievances.filter(g => {
      // Internal vs Public filter
      if (activeTab === 'internal' && g.memberType === 'Public') return false;
      if (activeTab === 'public' && g.memberType !== 'Public') return false;

      // Filter by grievance number prefix/match
      if (grvNumber && !g.id.toLowerCase().includes(grvNumber.toLowerCase()))
        return false;

      // Filter by member id (public tab only)
      if (
        activeTab === 'public' &&
        memberId &&
        !g.member.toLowerCase().includes(memberId.toLowerCase())
      )
        return false;

      // Filter by member type (student/employee)
      if (memberType && g.memberType !== memberType) return false;

      // Filter by category
      if (category && g.category !== category) return false;

      // Filter by level
      if (level && g.level !== level) return false;

      // Filter by priority
      if (priority && g.priority !== priority) return false;

      // Filter by status
      if (status && g.status !== status) return false;

      // Filter by date ranges
      if (dateFrom && g.reportedDate < dateFrom) return false;
      if (dateTo && g.reportedDate > dateTo) return false;

      if (resDateFrom && (!g.resolutionDate || g.resolutionDate < resDateFrom))
        return false;
      if (resDateTo && (!g.resolutionDate || g.resolutionDate > resDateTo))
        return false;

      return true;
    });

    setFilteredResults(results);
    triggerNotification(`Found ${results.length} matching grievance records.`);
  };

  const handleResetFilters = () => {
    setGrvNumber('');
    setMemberId('');
    setMemberType(null);
    setCategory(null);
    setLevel(null);
    setPriority(null);
    setStatus(null);
    setDateFrom('');
    setDateTo('');
    setResDateFrom('');
    setResDateTo('');

    const defaultList = grievances.filter(g =>
      activeTab === 'internal'
        ? g.memberType !== 'Public'
        : g.memberType === 'Public'
    );
    setFilteredResults(defaultList);
  };

  // Export actions
  const handleCSV = () => {
    const headers =
      'Grievance ID,Complainant,Category,Level,Priority,Status,Reported Date,Resolution Date\n';
    const rows = filteredResults
      .map(
        g =>
          `"${g.id}","${g.member}","${g.category}","${g.level}","${g.priority}","${g.status}","${g.reportedDate}","${g.resolutionDate || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab === 'internal' ? 'internal' : 'public'}_grievance_report.csv`;
    link.click();
    triggerNotification('Report exported successfully as CSV.');
  };

  const handleCopy = () => {
    const text = filteredResults
      .map(
        g =>
          `${g.id}\t${g.member}\t${g.category}\t${g.level}\t${g.priority}\t${g.status}\t${g.reportedDate}`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    triggerNotification('Copied report data to clipboard.');
  };

  const handlePDF = () => {
    triggerNotification('Generating printable PDF report...');
    window.print();
  };

  // Switch tab resets results automatically
  const handleTabChange = (tab: 'internal' | 'public') => {
    setActiveTab(tab);
    setGrvNumber('');
    setMemberId('');
    setMemberType(null);
    setCategory(null);
    setLevel(null);
    setPriority(null);
    setStatus(null);
    setDateFrom('');
    setDateTo('');
    setResDateFrom('');
    setResDateTo('');

    const defaultList = grievances.filter(g =>
      tab === 'internal' ? g.memberType !== 'Public' : g.memberType === 'Public'
    );
    setFilteredResults(defaultList);
  };

  return (
    <FormPage
      title="Grievance Redressal Audit & Reports"
      description="Generate comprehensive audits of university grievances and public complaints with exporting capabilities"
      breadcrumbs={[
        {
          label: 'Grievance Management',
          to: '/grievance-management/dashboard',
        },
        { label: 'Audit Reports' },
      ]}
    >
      {/* ── Tab Layout ── */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          type="button"
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'internal'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => handleTabChange('internal')}
        >
          <i className="pi pi-file" /> Internal Grievance Report
        </button>
        <button
          type="button"
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'public'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => handleTabChange('public')}
        >
          <i className="pi pi-globe" /> Public Grievance Report
        </button>
      </div>

      {/* ── Dynamic Filters Form Card ── */}
      <FormCard title="Search Audit Filters" icon="search">
        <FormGrid columns={4}>
          <TextBox
            label="Grievance Number"
            placeholder="e.g. GRV-001"
            value={grvNumber}
            onChange={setGrvNumber}
          />

          {activeTab === 'public' && (
            <TextBox
              label="Enrollment / Employee ID"
              placeholder="e.g. STU2025ME0043"
              value={memberId}
              onChange={setMemberId}
            />
          )}

          <DropDownList
            label="Member Type"
            data={
              activeTab === 'internal'
                ? MEMBER_TYPE_OPTIONS_INTERNAL
                : MEMBER_TYPE_OPTIONS_PUBLIC
            }
            textField="text"
            valueField="id"
            value={memberType}
            onChange={v => setMemberType(v as string | null)}
          />

          {activeTab === 'internal' && (
            <DropDownList
              label="Grievance Category"
              data={categoryDropdown}
              textField="text"
              valueField="id"
              value={category}
              onChange={v => setCategory(v as string | null)}
            />
          )}

          <DropDownList
            label="Severity Level"
            data={LEVEL_OPTIONS}
            textField="text"
            valueField="id"
            value={level}
            onChange={v => setLevel(v as string | null)}
          />

          <DropDownList
            label="Priority Level"
            data={PRIORITY_OPTIONS}
            textField="text"
            valueField="id"
            value={priority}
            onChange={v => setPriority(v as string | null)}
          />

          <DropDownList
            label="Current Status"
            data={STATUS_OPTIONS}
            textField="text"
            valueField="id"
            value={status}
            onChange={v => setStatus(v as string | null)}
          />

          <DatePicker
            label="Reported From"
            value={dateFrom ? new Date(dateFrom) : undefined}
            onChange={d => setDateFrom(d ? d.toISOString().split('T')[0] : '')}
          />
          <DatePicker
            label="Reported To"
            value={dateTo ? new Date(dateTo) : undefined}
            onChange={d => setDateTo(d ? d.toISOString().split('T')[0] : '')}
          />
          <DatePicker
            label="Resolution From"
            value={resDateFrom ? new Date(resDateFrom) : undefined}
            onChange={d =>
              setResDateFrom(d ? d.toISOString().split('T')[0] : '')
            }
          />
          <DatePicker
            label="Resolution To"
            value={resDateTo ? new Date(resDateTo) : undefined}
            onChange={d => setResDateTo(d ? d.toISOString().split('T')[0] : '')}
          />
        </FormGrid>

        <div className="flex justify-between items-center mt-4 border-t pt-4">
          <div className="flex gap-2">
            <Button
              label="Search Audit Logs"
              icon="search"
              variant="primary"
              onClick={handleSearch}
            />
            <Button
              label="Reset Filters"
              variant="outlined"
              onClick={handleResetFilters}
            />
          </div>
          <div className="flex gap-2">
            <Button
              label="Export CSV"
              icon="download"
              variant="outlined"
              onClick={handleCSV}
            />
            <Button
              label="Copy Data"
              icon="copy"
              variant="outlined"
              onClick={handleCopy}
            />
            <Button
              label="Download PDF"
              icon="file-pdf"
              variant="outlined"
              onClick={handlePDF}
            />
          </div>
        </div>
      </FormCard>

      {/* ── Generated Reports Listing ── */}
      <div className="mt-6">
        <FormCard title="Audit Search Results" icon="list">
          <GridPanel
            data={filteredResults}
            columns={[
              { field: 'id', header: 'ID', width: '90px' },
              { field: 'member', header: 'Complainant' },
              { field: 'category', header: 'Category' },
              {
                field: 'level',
                header: 'Level',
                cell: (item: Grievance) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.level === 'Severe'
                        ? 'bg-red-100 text-red-700'
                        : item.level === 'Mild'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.level}
                  </span>
                ),
              },
              {
                field: 'priority',
                header: 'Priority',
                cell: (item: Grievance) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : item.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {item.priority}
                  </span>
                ),
              },
              {
                field: 'status',
                header: 'Status',
                cell: (item: Grievance) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.status === 'Reported'
                        ? 'bg-amber-100 text-amber-700'
                        : item.status === 'Pending'
                          ? 'bg-orange-100 text-orange-700'
                          : item.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.status}
                  </span>
                ),
              },
              { field: 'reportedDate', header: 'Reported Date' },
              { field: 'resolutionDate', header: 'Resolution Date' },
            ]}
            searchBox={false}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
