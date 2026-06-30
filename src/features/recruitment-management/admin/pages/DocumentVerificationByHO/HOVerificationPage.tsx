import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import type { BulkColumn } from 'shared/new-components';
import {
  BulkSelectTable,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  StatusBadge,
} from 'shared/new-components';

// ─── Types ────────────────────────────────────────────────────────────────────
type HOCandidateStatus = 'TIER1_VERIFIED' | 'APPROVED' | 'REJECTED';

interface HOCandidate {
  id: string;
  candidateName: string;
  rollNo: string;
  testName: string;
  subject: string;
  center: string;
  centerCode: string;
  status: HOCandidateStatus;
  verificationDate: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const TESTS = [
  {
    label: 'लोक शिक्षण संचालनालय (DPI - माध्यमिक शिक्षक) 2025-2026',
    value: 'DPI-2025',
  },
  { label: 'High School Teacher Eligibility Test - 2025', value: 'HSET-2025' },
];

const SUBJECTS = [
  { label: 'Hindi - MS Teachers', value: 'HINDI_MS' },
  { label: 'Mathematics - MS Teachers', value: 'MATH_MS' },
  { label: 'Science - HS Teachers', value: 'SCI_HS' },
  { label: 'English - MS Teachers', value: 'ENG_MS' },
];

const CENTERS = [
  { label: 'DISTRICT EDUCATION OFFICE AGAR MALWA', value: 'VCC-011' },
  { label: 'DIVISIONAL EDUCATION OFFICE BHOPAL', value: 'VCC-002' },
  { label: 'DISTRICT COLLECTORATE GWALIOR', value: 'VCC-031' },
];

const ALL_CANDIDATES: HOCandidate[] = [
  {
    id: 'H001',
    candidateName: 'PURUSHOTTAM DAS',
    rollNo: '6007250655448',
    testName: 'लोक शिक्षण संचालनालय (DPI - माध्यमिक शिक्षक) 2025-2026',
    subject: 'Hindi - MS Teachers',
    center: 'DISTRICT EDUCATION OFFICE AGAR MALWA',
    centerCode: 'VCC-011',
    status: 'APPROVED',
    verificationDate: '29/1/2026',
  },
  {
    id: 'H002',
    candidateName: 'SUNITA PATEL',
    rollNo: '6007250655449',
    testName: 'लोक शिक्षण संचालनालय (DPI - माध्यमिक शिक्षक) 2025-2026',
    subject: 'Hindi - MS Teachers',
    center: 'DISTRICT EDUCATION OFFICE AGAR MALWA',
    centerCode: 'VCC-011',
    status: 'TIER1_VERIFIED',
    verificationDate: '29/1/2026',
  },
  {
    id: 'H003',
    candidateName: 'RAMESH KUMAR',
    rollNo: '6007250655450',
    testName: 'लोक शिक्षण संचालनालय (DPI - माध्यमिक शिक्षक) 2025-2026',
    subject: 'Hindi - MS Teachers',
    center: 'DIVISIONAL EDUCATION OFFICE BHOPAL',
    centerCode: 'VCC-002',
    status: 'TIER1_VERIFIED',
    verificationDate: '29/1/2026',
  },
  {
    id: 'H004',
    candidateName: 'KAVITA SINGH',
    rollNo: '6007250655451',
    testName: 'High School Teacher Eligibility Test - 2025',
    subject: 'Mathematics - MS Teachers',
    center: 'DISTRICT COLLECTORATE GWALIOR',
    centerCode: 'VCC-031',
    status: 'APPROVED',
    verificationDate: '30/1/2026',
  },
  {
    id: 'H005',
    candidateName: 'ASHOK VERMA',
    rollNo: '6007250655452',
    testName: 'High School Teacher Eligibility Test - 2025',
    subject: 'Mathematics - MS Teachers',
    center: 'DISTRICT COLLECTORATE GWALIOR',
    centerCode: 'VCC-031',
    status: 'TIER1_VERIFIED',
    verificationDate: '30/1/2026',
  },
  {
    id: 'H006',
    candidateName: 'PRIYA SHARMA',
    rollNo: '6007250655453',
    testName: 'High School Teacher Eligibility Test - 2025',
    subject: 'Science - HS Teachers',
    center: 'DIVISIONAL EDUCATION OFFICE BHOPAL',
    centerCode: 'VCC-002',
    status: 'REJECTED',
    verificationDate: '30/1/2026',
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HOVerificationPage() {
  const [filterTest, setFilterTest] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState<string | null>(null);
  const [filterCenter, setFilterCenter] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [search, setSearch] = useState('');

  const [candidates, setCandidates] = useState<HOCandidate[]>(ALL_CANDIDATES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewCandidate, setViewCandidate] = useState<HOCandidate | null>(null);

  // ── Filter / Search ──
  const displayed = useMemo(() => {
    const base = searched
      ? candidates.filter(c => {
          if (filterTest) {
            const testLabel = TESTS.find(t => t.value === filterTest)?.label;
            if (testLabel && c.testName !== testLabel) return false;
          }
          if (filterSubject) {
            const subjectLabel = SUBJECTS.find(
              s => s.value === filterSubject
            )?.label;
            if (subjectLabel && c.subject !== subjectLabel) return false;
          }
          if (filterCenter) {
            if (c.centerCode !== filterCenter) return false;
          }
          return true;
        })
      : candidates;

    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      c =>
        c.candidateName.toLowerCase().includes(q) ||
        c.rollNo.includes(q) ||
        c.center.toLowerCase().includes(q)
    );
  }, [candidates, searched, filterTest, filterSubject, filterCenter, search]);

  const handleSearch = () => {
    setSearched(true);
    setSelected(new Set());
  };

  const handleReset = () => {
    setFilterTest(null);
    setFilterSubject(null);
    setFilterCenter(null);
    setSearched(false);
    setSearch('');
    setSelected(new Set());
  };

  // ── Selection ──
  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const allIds = displayed.map(c => c.id);
    const allSelected = allIds.every(id => selected.has(id));
    setSelected(allSelected ? new Set() : new Set(allIds));
  };

  // ── Bulk Actions ──
  const handleBulkApprove = () => {
    setCandidates(prev =>
      prev.map(c =>
        selected.has(c.id) ? { ...c, status: 'APPROVED' as const } : c
      )
    );
    ToastService.success(
      `${selected.size} candidate(s) approved successfully.`
    );
    setSelected(new Set());
  };

  const handleBulkReject = () => {
    setCandidates(prev =>
      prev.map(c =>
        selected.has(c.id) ? { ...c, status: 'REJECTED' as const } : c
      )
    );
    ToastService.error(`${selected.size} candidate(s) rejected.`);
    setSelected(new Set());
  };

  // ── Columns ──
  const columns: BulkColumn<HOCandidate>[] = [
    {
      header: 'Candidate Name',
      cell: row => <span className="font-semibold">{row.candidateName}</span>,
    },
    {
      header: 'Roll Number',
      cell: row => <span className="font-mono text-xs">{row.rollNo}</span>,
    },
    {
      header: 'Test',
      className: 'max-w-[180px]',
      cell: row => <span className="line-clamp-2 block">{row.testName}</span>,
    },
    {
      header: 'Subject',
      cell: row => <span>{row.subject}</span>,
    },
    {
      header: 'Center',
      className: 'max-w-[160px]',
      cell: row => <span className="line-clamp-2 block">{row.center}</span>,
    },
    {
      header: 'Date',
      cell: row => <span>{row.verificationDate}</span>,
    },
    {
      header: 'Status',
      cell: row => {
        const variantMap: Record<
          HOCandidateStatus,
          'approved' | 'rejected' | 'pending'
        > = {
          APPROVED: 'approved',
          REJECTED: 'rejected',
          TIER1_VERIFIED: 'pending',
        };
        const labelMap: Record<HOCandidateStatus, string> = {
          APPROVED: 'Approved',
          REJECTED: 'Rejected',
          TIER1_VERIFIED: 'Center Verified',
        };
        return (
          <StatusBadge
            label={labelMap[row.status]}
            variant={variantMap[row.status]}
          />
        );
      },
    },
    {
      header: 'Actions',
      stopPropagation: true,
      cell: row => (
        <Button
          label=""
          icon="eye"
          type="button"
          variant="outlined"
          onClick={() => setViewCandidate(row)}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Document Verification by HO"
      description="Head Office admins track and approve candidate document verification across all centers."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'HR Admin', to: '/recruitment-management/admin' },
        { label: 'Document Verification by HO' },
      ]}
    >
      {/* ── Filter Card ── */}
      <FormCard title="Search Filters" icon="filter_list">
        <FormGrid columns={3}>
          <DropDownList
            id="ho-test"
            label="Test Name"
            data={TESTS}
            textField="label"
            valueField="value"
            value={filterTest}
            defaultOptionText="Select Test Name"
            onChange={v => setFilterTest(v as string | null)}
          />
          <DropDownList
            id="ho-subject"
            label="Subject Name"
            data={SUBJECTS}
            textField="label"
            valueField="value"
            value={filterSubject}
            defaultOptionText="Select Subject Name"
            onChange={v => setFilterSubject(v as string | null)}
          />
          <DropDownList
            id="ho-center"
            label="Verification Center"
            data={CENTERS}
            textField="label"
            valueField="value"
            value={filterCenter}
            defaultOptionText="Select Verification Center"
            onChange={v => setFilterCenter(v as string | null)}
          />
        </FormGrid>
        <div className="flex gap-3 mt-4">
          <Button
            label="Search"
            icon="search"
            type="button"
            variant="primary"
            onClick={handleSearch}
          />
          <Button
            label="Reset"
            icon="refresh"
            type="button"
            variant="outlined"
            onClick={handleReset}
          />
        </div>
      </FormCard>

      {/* ── Results Card ── */}
      <FormCard title="Candidate Details" icon="groups">
        <BulkSelectTable<HOCandidate>
          data={displayed}
          columns={columns}
          selected={selected}
          onToggleOne={toggleOne}
          onToggleAll={toggleAll}
          onClearSelection={() => setSelected(new Set())}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, roll no, center..."
          emptyMessage={
            searched
              ? 'No candidates found for the selected filters.'
              : 'Apply filters above and click Search to load candidates.'
          }
          totalCount={candidates.length}
          bulkActions={[
            {
              label: 'Approve Selected',
              icon: 'check_circle',
              variant: 'success',
              onClick: handleBulkApprove,
            },
            {
              label: 'Reject Selected',
              icon: 'cancel',
              variant: 'danger',
              onClick: handleBulkReject,
            },
          ]}
        />
      </FormCard>

      {/* ── View Popup ── */}
      {viewCandidate && (
        <FormPopup
          visible={!!viewCandidate}
          onHide={() => setViewCandidate(null)}
          title="Candidate Details"
          subtitle={viewCandidate.rollNo}
          size="lg"
          footer={
            <Button
              label="Close"
              type="button"
              variant="outlined"
              onClick={() => setViewCandidate(null)}
            />
          }
        >
          {/* Detail rows */}
          <div className="flex flex-col divide-y">
            {(
              [
                ['Candidate Name', viewCandidate.candidateName],
                ['Roll Number', viewCandidate.rollNo],
                ['Test Name', viewCandidate.testName],
                ['Subject', viewCandidate.subject],
                ['Verification Center', viewCandidate.center],
                ['Center Code', viewCandidate.centerCode],
                ['Verification Date', viewCandidate.verificationDate],
                ['Status', viewCandidate.status.replace(/_/g, ' ')],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} className="flex py-2.5 gap-4">
                <span className="text-xs font-medium text-slate-400 w-44 flex-shrink-0">
                  {label}
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Documents */}
          <p className="text-xs font-semibold text-slate-400 mt-4 mb-2">
            Documents Submitted
          </p>
          <div className="flex flex-col gap-2">
            {[
              'Photograph',
              'Identity Proof',
              'B.Ed Certificate',
              'Graduation Marksheet',
              'Category Certificate',
            ].map(doc => (
              <div
                key={doc}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-rounded text-emerald-500 text-base">
                    description
                  </span>
                  <span className="text-sm text-slate-300">{doc}</span>
                </div>
                <Button
                  label="View"
                  icon="eye"
                  type="button"
                  variant="outlined"
                />
              </div>
            ))}
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
