import { useState, useMemo } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  FormGrid,
  GridPanel,
} from 'shared/new-components';
import { TextBox, DropDownList, TextArea } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import type { ImportedStudentRow } from '../../types';
import { STUDENTS } from '../../data';
import { BRANCHES, DEFAULT_MATRIX } from '../../data/domain';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { toRoman } from '../../utils';
import { parseCsv, downloadCsv } from '../../utils/csv';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

interface Row {
  enrollmentNo: string;
  name: string;
  branch: string;
  semester: number;
  category: string;
  color: string;
  imported: boolean;
}

const HEADERS = [
  'enrollmentNo',
  'name',
  'dob',
  'branch',
  'section',
  'category',
  'email',
  'phone',
];
const BRANCH_CODES = new Set<string>(BRANCHES.map(b => b.code));

interface ParsedRow {
  data: ImportedStudentRow;
  errors: string[];
}

export default function AdminStudents() {
  const currentAdminRole = useLifecycleStore(s => s.currentAdminRole);
  const imported = useLifecycleStore(s => s.importedStudents);
  const deactivatedUserIds = useLifecycleStore(s => s.deactivatedUserIds);
  const toggleUserActive = useLifecycleStore(s => s.toggleUserActive);
  const importStudents = useLifecycleStore(s => s.importStudents);

  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [showImport, setShowImport] = useState(false);
  const [csvText, setCsvText] = useState('');

  const perms = DEFAULT_MATRIX[currentAdminRole] || [];
  const canView = perms.includes('students.view');
  const canManage = perms.includes('students.manage');
  const canImport = perms.includes('students.import');

  const existingEnrollments = useMemo(
    () =>
      new Set([
        ...STUDENTS.map(s => s.enrollmentNo),
        ...imported.map(i => i.enrollmentNo),
      ]),
    [imported]
  );

  const parsedCsvRows: ParsedRow[] = useMemo(() => {
    const seen = new Set<string>();
    return parseCsv(csvText).map(r => {
      const data: ImportedStudentRow = {
        enrollmentNo: r.enrollmentNo ?? '',
        name: r.name ?? '',
        dob: r.dob ?? '',
        branch: (r.branch ?? '').toUpperCase(),
        section: r.section || 'A',
        category: r.category || 'General',
        email: r.email || '',
        phone: r.phone || '',
      };
      const errors: string[] = [];
      if (!data.enrollmentNo) errors.push('Missing Enrollment No.');
      if (!data.name) errors.push('Missing Name');
      if (!data.dob) errors.push('Missing DOB');
      if (!BRANCH_CODES.has(data.branch)) errors.push('Invalid Branch');
      if (
        data.enrollmentNo &&
        (existingEnrollments.has(data.enrollmentNo) ||
          seen.has(data.enrollmentNo))
      ) {
        errors.push('Duplicate Enrollment');
      }
      if (data.enrollmentNo) seen.add(data.enrollmentNo);
      return { data, errors };
    });
  }, [csvText, existingEnrollments]);

  const validRows = parsedCsvRows.filter(p => p.errors.length === 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result ?? ''));
    reader.readAsText(file);
  };

  const handleImport = () => {
    importStudents(validRows.map(v => v.data));
    ToastService.success(
      `${validRows.length} new student admission profiles imported successfully.`
    );
    setCsvText('');
    setShowImport(false);
  };

  const downloadTemplate = () => {
    downloadCsv('student-import-template.csv', HEADERS, [
      {
        enrollmentNo: 'DE25CS0101',
        name: 'Jane Doe',
        dob: '2007-05-14',
        branch: 'CSE',
        section: 'A',
        category: 'General',
        email: 'jane.doe@ietdavv.edu.in',
        phone: '+91 9876543210',
      },
    ]);
  };

  const handleToggleActive = (id: string, name: string, active: boolean) => {
    toggleUserActive(id);
    ToastService.success(
      `${name} has been ${active ? 'deactivated' : 'activated'} successfully.`
    );
  };

  const allRows: Row[] = useMemo(
    () => [
      ...STUDENTS.map(s => ({
        enrollmentNo: s.enrollmentNo,
        name: s.name,
        branch: s.branch,
        semester: s.currentSemester,
        category: s.category,
        color: s.photoColor,
        imported: false,
      })),
      ...imported.map(i => ({
        enrollmentNo: i.enrollmentNo,
        name: i.name,
        branch: i.branch,
        semester: 1,
        category: i.category,
        color: '#64748b',
        imported: true,
      })),
    ],
    [imported]
  );

  if (!canView) {
    return (
      <FormPage
        title="Students Register"
        description="Access Denied. You do not have permissions to view student records."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500 flex flex-col items-center justify-center gap-3">
            <Icon name="block" className="text-5xl" />
            <p className="font-bold">Unauthorized Access</p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const filteredRows = allRows.filter(
    r =>
      (branchFilter === 'all' || r.branch === branchFilter) &&
      (!searchQuery ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.admin.root },
    { label: 'Students Register' },
  ];

  const headerAction = canImport ? (
    <button
      onClick={() => setShowImport(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-colors"
    >
      <Icon name="upload" className="text-xs" />
      <span>Bulk Import (CSV)</span>
    </button>
  ) : undefined;

  const branchOptions = [
    { text: 'All Branches', value: 'all' },
    ...BRANCHES.map(b => ({ text: `${b.code} — ${b.name}`, value: b.code })),
  ];

  const gridColumns = [
    {
      field: 'name',
      header: 'Student Name',
      cell: (r: Row) => {
        const initials = r.name
          .split(' ')
          .map(n => n[0])
          .join('');
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-sm"
              style={{ backgroundColor: r.color }}
            >
              {initials}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {r.name}
                {r.imported && (
                  <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    New Admission
                  </span>
                )}
              </p>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                {r.enrollmentNo}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      field: 'branch',
      header: 'Branch',
      sortable: true,
      cell: (r: Row) => (
        <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs">
          {r.branch}
        </span>
      ),
    },
    {
      field: 'semester',
      header: 'Semester',
      sortable: true,
      cell: (r: Row) => (
        <span className="font-bold text-slate-700 dark:text-slate-300">
          {toRoman(r.semester)}
        </span>
      ),
    },
    {
      field: 'category',
      header: 'Category',
      sortable: true,
      cell: (r: Row) => (
        <span className="font-medium text-slate-600 dark:text-slate-400 text-xs">
          {r.category}
        </span>
      ),
    },
    {
      field: 'enrollmentNo',
      header: 'Status',
      cell: (r: Row) => {
        const isActive = !deactivatedUserIds.includes(r.enrollmentNo);
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/400' : 'bg-slate-400'}`}
            />
            {isActive ? 'Active' : 'Deactivated'}
          </span>
        );
      },
    },
  ];

  if (canManage) {
    gridColumns.push({
      field: 'enrollmentNo',
      header: 'Action',
      cell: (r: Row) => {
        const isActive = !deactivatedUserIds.includes(r.enrollmentNo);
        return (
          <button
            onClick={() => handleToggleActive(r.enrollmentNo, r.name, isActive)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 border rounded-lg text-xs font-bold transition-colors ${
              isActive
                ? 'bg-red-50 dark:bg-red-950/40 hover:bg-red-100 border-red-100 dark:border-red-900/30 text-red-600'
                : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border-emerald-100 dark:border-emerald-900/30 text-emerald-600'
            }`}
          >
            <Icon
              name={isActive ? 'block' : 'check_circle'}
              className="text-xs"
            />
            <span>{isActive ? 'Deactivate' : 'Activate'}</span>
          </button>
        );
      },
    } as any);
  }

  const csvColumns = [
    {
      field: 'data.enrollmentNo',
      header: 'Enrollment',
      cell: (p: ParsedRow) => (
        <span className="font-mono text-xs">{p.data.enrollmentNo || '—'}</span>
      ),
    },
    {
      field: 'data.name',
      header: 'Student Name',
      cell: (p: ParsedRow) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {p.data.name || '—'}
        </span>
      ),
    },
    {
      field: 'data.branch',
      header: 'Branch',
      cell: (p: ParsedRow) => (
        <span className="text-xs">{p.data.branch || '—'}</span>
      ),
    },
    {
      field: 'errors',
      header: 'Validation Status',
      cell: (p: ParsedRow) =>
        p.errors.length === 0 ? (
          <span className="text-emerald-600 font-bold text-xs">✓ Valid</span>
        ) : (
          <span className="text-red-600 font-bold text-xs">
            {p.errors.join(', ')}
          </span>
        ),
    },
  ];

  return (
    <FormPage
      title="Students Register"
      description={`${allRows.length} total students enrolled. ${imported.length} imported this session.`}
      breadcrumbs={breadcrumbs}
      headerAction={headerAction}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Filters and Search Bar */}
        <FormCard className="p-4">
          <FormGrid columns={2}>
            <TextBox
              label="Search Roster"
              value={searchQuery}
              onChange={val => setSearchQuery(val ?? '')}
              placeholder="Search by name or enrollment number..."
            />

            <DropDownList
              label="Branch Filter"
              value={branchFilter}
              data={branchOptions}
              textField="text"
              valueField="value"
              onChange={val => setBranchFilter(val as string)}
            />
          </FormGrid>
        </FormCard>

        {/* Student list table */}
        <FormCard title="Registered Roster" className="p-0 overflow-hidden">
          <GridPanel
            data={filteredRows}
            dataKey="enrollmentNo"
            emptyMessage="No students match this filter query."
            columns={gridColumns as any}
          />
        </FormCard>
      </div>

      {/* CSV Import Modal Popup */}
      <FormPopup
        visible={showImport}
        onHide={() => setShowImport(false)}
        title="Bulk Import Admissions"
        subtitle="Upload a CSV formatted roster of new admissions. Records will be validated instantly before import."
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button
              onClick={() => {
                setCsvText('');
                setShowImport(false);
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-50 dark:bg-slate-950 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={validRows.length === 0}
              className={`px-4 py-2 text-white text-xs font-bold rounded-lg transition-colors ${
                validRows.length === 0
                  ? 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-primary hover:bg-primary-hover shadow-sm'
              }`}
            >
              Import {validRows.length} Student(s)
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg hover:bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              <Icon name="download" className="text-xs" />
              <span>Download CSV Template</span>
            </button>

            <label className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
              <Icon name="upload" className="text-xs" />
              <span>Upload CSV File</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <FormGrid columns={1}>
            <TextArea
              label="CSV Raw Data Input"
              value={csvText}
              onChange={val => setCsvText(val ?? '')}
              placeholder={`${HEADERS.join(',')}\nDE25CS0101,New Student,2007-05-14,CSE,A,General,new.student@ietdavv.edu.in,+919876543210`}
            />
          </FormGrid>

          {parsedCsvRows.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {validRows.length} Valid Rows
                </span>
                {parsedCsvRows.length - validRows.length > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                    {parsedCsvRows.length - validRows.length} Errors Found
                  </span>
                )}
              </div>

              {/* Parsing status grid */}
              <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/50">
                <GridPanel
                  data={parsedCsvRows}
                  dataKey="data.enrollmentNo"
                  emptyMessage="No rows parsed."
                  columns={csvColumns as any}
                  pagination={false}
                  scrollHeight="180px"
                  scrollable
                />
              </div>
            </div>
          )}
        </div>
      </FormPopup>
    </FormPage>
  );
}
