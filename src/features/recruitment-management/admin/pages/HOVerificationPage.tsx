import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';

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
  {
    label: 'DISTRICT EDUCATION OFFICE AGAR MALWA',
    value: 'VCC-011',
  },
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

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: HOCandidateStatus }) {
  const map: Record<HOCandidateStatus, { label: string; cls: string }> = {
    TIER1_VERIFIED: {
      label: 'Center Verified',
      cls: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    APPROVED: {
      label: 'Approved',
      cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    REJECTED: {
      label: 'Rejected',
      cls: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
  };
  const cfg = map[status];
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── View Modal ───────────────────────────────────────────────────────────────
function ViewModal({
  candidate,
  onClose,
}: {
  candidate: HOCandidate;
  onClose: () => void;
}) {
  const rows = [
    ['Candidate Name', candidate.candidateName],
    ['Roll Number', candidate.rollNo],
    ['Test Name', candidate.testName],
    ['Subject', candidate.subject],
    ['Verification Center', candidate.center],
    ['Center Code', candidate.centerCode],
    ['Verification Date', candidate.verificationDate],
    ['Status', candidate.status.replace(/_/g, ' ')],
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#1a2035] border border-slate-400/15 rounded-2xl p-8 w-[540px] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white">
              Candidate Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{candidate.rollNo}</p>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-rounded text-slate-500 hover:text-white text-[20px] bg-transparent border-none cursor-pointer transition-colors"
          >
            close
          </button>
        </div>

        <div className="flex flex-col divide-y divide-slate-400/10 mb-6">
          {rows.map(([label, value]) => (
            <div key={label} className="flex py-2.5 gap-4">
              <span className="text-[12px] text-slate-500 w-44 flex-shrink-0 font-medium">
                {label}
              </span>
              <span className="text-[13px] text-slate-200">{value}</span>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-[12px] font-semibold text-slate-400 mb-2">
            Documents Submitted
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              'Photograph',
              'Identity Proof',
              'B.Ed Certificate',
              'Graduation Marksheet',
              'Category Certificate',
            ].map(doc => (
              <div
                key={doc}
                className="flex items-center justify-between p-2.5 bg-slate-400/5 rounded-lg border border-slate-400/8"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-rounded text-emerald-500 text-[16px]">
                    description
                  </span>
                  <span className="text-[12px] text-slate-300">{doc}</span>
                </div>
                <button className="text-[11px] text-blue-400 border border-blue-500/20 bg-blue-500/10 rounded px-2.5 py-1 font-semibold hover:bg-blue-500/20 transition-colors cursor-pointer">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button
          label="Close"
          type="button"
          variant="outlined"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────
function BulkActionBar({
  count,
  onApprove,
  onReject,
  onClear,
}: {
  count: number;
  onApprove: () => void;
  onReject: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 bg-violet-500/10 border border-violet-500/20 rounded-xl mb-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-rounded text-violet-400 text-[18px]">
          checklist
        </span>
        <span className="text-[13px] font-semibold text-violet-300">
          {count} candidate{count !== 1 ? 's' : ''} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          label="Approve Selected"
          icon="check_circle"
          type="button"
          variant="success"
          onClick={onApprove}
        />
        <Button
          label="Reject Selected"
          icon="cancel"
          type="button"
          variant="danger"
          onClick={onReject}
        />
        <Button
          label="Clear"
          icon="close"
          type="button"
          variant="outlined"
          onClick={onClear}
        />
      </div>
    </div>
  );
}

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
    if (!searched) return candidates;
    return candidates.filter(c => {
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
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.candidateName.toLowerCase().includes(q) ||
          c.rollNo.includes(q) ||
          c.center.toLowerCase().includes(q)
        );
      }
      return true;
    });
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
  const allIds = displayed.map(c => c.id);
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id));
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  };

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Bulk Actions ──
  const handleBulkApprove = () => {
    setCandidates(prev =>
      prev.map(c => (selected.has(c.id) ? { ...c, status: 'APPROVED' } : c))
    );
    ToastService.success(
      `${selected.size} candidate(s) approved successfully.`
    );
    setSelected(new Set());
  };

  const handleBulkReject = () => {
    setCandidates(prev =>
      prev.map(c => (selected.has(c.id) ? { ...c, status: 'REJECTED' } : c))
    );
    ToastService.error(`${selected.size} candidate(s) rejected.`);
    setSelected(new Set());
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
        </div>
        <div className="flex gap-3">
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
        {/* Search box */}
        <div className="flex items-center justify-end mb-3">
          <div className="relative">
            <span className="material-symbols-rounded absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[16px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-2 bg-slate-400/10 border border-slate-400/20 rounded-lg text-[13px] text-slate-300 outline-none focus:border-violet-500 transition-colors w-52"
            />
          </div>
        </div>

        {/* Bulk Action Bar */}
        {someSelected && (
          <BulkActionBar
            count={selected.size}
            onApprove={handleBulkApprove}
            onReject={handleBulkReject}
            onClear={() => setSelected(new Set())}
          />
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-400/10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-violet-600/20">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-violet-500 cursor-pointer"
                    title="Select All"
                  />
                </th>
                {[
                  'Candidate Name',
                  'Roll Number',
                  'Test',
                  'Subject',
                  'Center',
                  'Date',
                  'Status',
                  'Actions',
                ].map(h => (
                  <th
                    key={h}
                    className="p-3 text-left text-[11px] text-violet-300 font-semibold uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="p-8 text-center text-slate-500 text-[13px]"
                  >
                    {searched
                      ? 'No candidates found for the selected filters.'
                      : 'Apply filters above and click Search to load candidates.'}
                  </td>
                </tr>
              ) : (
                displayed.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => toggleOne(c.id)}
                    className={`border-b border-slate-400/5 cursor-pointer transition-colors ${
                      selected.has(c.id)
                        ? 'bg-violet-500/8 hover:bg-violet-500/12'
                        : 'hover:bg-slate-400/5'
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggleOne(c.id)}
                        onClick={e => e.stopPropagation()}
                        className="w-4 h-4 accent-violet-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 text-[13px] text-slate-200 font-semibold">
                      {c.candidateName}
                    </td>
                    <td className="p-3 text-[12px] text-slate-400 font-mono">
                      {c.rollNo}
                    </td>
                    <td className="p-3 text-[12px] text-slate-400 max-w-[180px]">
                      <span className="line-clamp-2">{c.testName}</span>
                    </td>
                    <td className="p-3 text-[12px] text-slate-400">
                      {c.subject}
                    </td>
                    <td className="p-3 text-[12px] text-slate-400 max-w-[160px]">
                      <span className="line-clamp-2">{c.center}</span>
                    </td>
                    <td className="p-3 text-[12px] text-slate-500">
                      {c.verificationDate}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-3" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setViewCandidate(c)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-400/10 border border-slate-400/15 text-slate-400 hover:bg-violet-500/15 hover:text-violet-400 hover:border-violet-500/30 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <span className="material-symbols-rounded text-[16px]">
                          visibility
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {displayed.length > 0 && (
          <div className="flex items-center justify-between mt-3 text-[12px] text-slate-500">
            <span>
              Showing {displayed.length} of {candidates.length} entries
            </span>
            {someSelected && (
              <span className="text-violet-400 font-semibold">
                {selected.size} selected
              </span>
            )}
          </div>
        )}
      </FormCard>

      {/* ── View Modal ── */}
      {viewCandidate && (
        <ViewModal
          candidate={viewCandidate}
          onClose={() => setViewCandidate(null)}
        />
      )}
    </FormPage>
  );
}
