import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DocVerification {
  docName: string;
  status: string;
  remark: string;
  file: File | null;
}

interface QueueCandidate {
  id: string;
  district: string;
  testName: string;
  subject: string;
  applicationNo: string;
  candidateName: string;
  verificationDate: string;
  time: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  documents: DocVerification[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const DOC_NAMES = [
  'B.Ed Certificate',
  'Graduation Marksheet',
  '12th Marksheet',
  '10th Marksheet',
  'Category Certificate',
  'Identity Proof (Aadhaar)',
];

const makeDocSet = (): DocVerification[] =>
  DOC_NAMES.map(d => ({ docName: d, status: '', remark: '', file: null }));

const MOCK_QUEUE: QueueCandidate[] = [
  {
    id: 'Q001',
    district: 'Agar Malwa',
    testName: 'High School Teacher Eligibility Test - 2025',
    subject: 'Hindi',
    applicationNo: '600725065S448',
    candidateName: 'PURUSHOTTAM DAS',
    verificationDate: '29/1/2026',
    time: '11:00:00',
    status: 'PENDING',
    documents: makeDocSet(),
  },
  {
    id: 'Q002',
    district: 'Indore',
    testName: 'High School Teacher Eligibility Test - 2025',
    subject: 'Mathematics',
    applicationNo: '600725065S449',
    candidateName: 'SUNITA PATEL',
    verificationDate: '29/1/2026',
    time: '11:30:00',
    status: 'PENDING',
    documents: makeDocSet(),
  },
  {
    id: 'Q003',
    district: 'Bhopal',
    testName: 'High School Teacher Eligibility Test - 2025',
    subject: 'Science',
    applicationNo: '600725065S450',
    candidateName: 'RAMESH KUMAR',
    verificationDate: '29/1/2026',
    time: '12:00:00',
    status: 'VERIFIED',
    documents: makeDocSet(),
  },
];

const DOC_STATUS_OPTIONS = [
  { label: 'Select Status', value: '' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Not Verified', value: 'NOT_VERIFIED' },
  { label: 'Missing', value: 'MISSING' },
];

const OVERALL_STATUS_OPTIONS = [
  { label: 'Select Status', value: '' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Rejected', value: 'REJECTED' },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    VERIFIED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${map[status] ?? 'bg-slate-400/10 text-slate-400 border-slate-400/20'}`}
    >
      {status}
    </span>
  );
}

// ─── Verification Modal ───────────────────────────────────────────────────────
function VerificationModal({
  candidate,
  onClose,
  onSubmit,
}: {
  candidate: QueueCandidate;
  onClose: () => void;
  onSubmit: (
    id: string,
    docs: DocVerification[],
    overallStatus: string,
    overallRemark: string
  ) => void;
}) {
  const [docs, setDocs] = useState<DocVerification[]>(
    candidate.documents.map(d => ({ ...d }))
  );
  const [overallStatus, setOverallStatus] = useState('');
  const [overallRemark, setOverallRemark] = useState('');
  const [declared, setDeclared] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const alreadyDone = candidate.status !== 'PENDING';

  const updateDoc = (
    idx: number,
    field: keyof DocVerification,
    value: string | File | null
  ) => {
    setDocs(prev =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d))
    );
  };

  const handleFileChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;
    updateDoc(idx, 'file', file);
  };

  const canSubmit =
    !alreadyDone &&
    declared &&
    overallStatus !== '' &&
    docs.every(d => d.status !== '');

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(candidate.id, docs, overallStatus, overallRemark);
      setSubmitting(false);
      onClose();
      ToastService.success(
        `Verification submitted for ${candidate.candidateName}.`
      );
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-[#1a2035] border border-slate-400/15 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-400/10 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">
              Document Verification —{' '}
              <span className="text-violet-400">{candidate.candidateName}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {candidate.applicationNo} · {candidate.subject} ·{' '}
              {candidate.district}
            </p>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-rounded text-slate-500 hover:text-white text-[22px] bg-transparent border-none cursor-pointer transition-colors"
          >
            close
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 px-7 py-5 flex flex-col gap-6">
          {/* Document Table */}
          <div>
            <div className="text-[13px] font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <span className="material-symbols-rounded text-violet-400 text-[16px]">
                folder_open
              </span>
              Document Review
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-400/10">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-violet-500/10">
                    {[
                      '#',
                      'Document',
                      'Status *',
                      'Action – Remark',
                      'Upload File',
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
                  {docs.map((doc, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-400/5 hover:bg-slate-400/3 transition-colors"
                    >
                      <td className="p-3 text-[12px] text-slate-500 w-8">
                        {i + 1}
                      </td>
                      <td className="p-3 text-[13px] text-slate-300 font-medium min-w-[160px]">
                        {doc.docName}
                      </td>
                      <td className="p-3 min-w-[160px]">
                        {alreadyDone ? (
                          <span className="text-[12px] text-slate-400">
                            {doc.status || '—'}
                          </span>
                        ) : (
                          <DropDownList
                            id={`doc-status-${i}`}
                            label=""
                            data={DOC_STATUS_OPTIONS}
                            textField="label"
                            valueField="value"
                            value={doc.status}
                            defaultOptionText="Select Status"
                            onChange={v =>
                              updateDoc(i, 'status', (v as string) ?? '')
                            }
                          />
                        )}
                      </td>
                      <td className="p-3 min-w-[220px]">
                        {alreadyDone ? (
                          <span className="text-[12px] text-slate-500 italic">
                            {doc.remark || '—'}
                          </span>
                        ) : (
                          <div>
                            <TextBox
                              id={`doc-remark-${i}`}
                              label=""
                              value={doc.remark}
                              onChange={v => updateDoc(i, 'remark', v)}
                              placeholder="Enter Remarks..."
                              maxLength={150}
                            />
                            <p className="text-[10px] text-slate-600 mt-0.5 text-right">
                              {150 - (doc.remark?.length ?? 0)} Characters
                              Remaining
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="p-3 min-w-[180px]">
                        {doc.file ? (
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-rounded text-emerald-500 text-[16px]">
                              check_circle
                            </span>
                            <span className="text-[11px] text-emerald-400 truncate max-w-[120px]">
                              {doc.file.name}
                            </span>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-2 px-3 py-2 bg-violet-500/10 border border-violet-500/25 text-violet-300 rounded-lg text-[12px] font-semibold cursor-pointer hover:bg-violet-500/20 transition-colors">
                            <span className="material-symbols-rounded text-[15px]">
                              add
                            </span>
                            Choose File
                            <input
                              type="file"
                              className="hidden"
                              disabled={alreadyDone}
                              onChange={e => handleFileChange(i, e)}
                            />
                          </label>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Overall Verification Status */}
          <div className="border border-slate-400/10 rounded-xl p-5 bg-slate-400/3">
            <div className="text-[13px] font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <span className="material-symbols-rounded text-violet-400 text-[16px]">
                fact_check
              </span>
              Overall Verification Status
            </div>
            <div className="grid grid-cols-2 gap-4">
              {alreadyDone ? (
                <>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1">Status</p>
                    <StatusBadge status={candidate.status} />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1">Remark</p>
                    <p className="text-[13px] text-slate-400">—</p>
                  </div>
                </>
              ) : (
                <>
                  <DropDownList
                    id="overall-status"
                    label="Status *"
                    data={OVERALL_STATUS_OPTIONS}
                    textField="label"
                    valueField="value"
                    value={overallStatus}
                    defaultOptionText="Select Status"
                    onChange={v => setOverallStatus((v as string) ?? '')}
                  />
                  <div>
                    <TextBox
                      id="overall-remark"
                      label="Remark"
                      value={overallRemark}
                      onChange={setOverallRemark}
                      placeholder="Enter Remarks..."
                      maxLength={90}
                    />
                    <p className="text-[10px] text-slate-600 mt-0.5 text-right">
                      {90 - overallRemark.length} Characters Remaining
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Declaration */}
          {!alreadyDone && (
            <div className="border border-slate-400/10 rounded-xl p-5 bg-slate-400/3">
              <div className="text-[13px] font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <span className="material-symbols-rounded text-violet-400 text-[16px]">
                  gavel
                </span>
                Declaration
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={declared}
                  onChange={e => setDeclared(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-violet-500 cursor-pointer flex-shrink-0"
                />
                <span className="text-[12px] text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                  I declare that I have verified all documents and the
                  information provided is correct. *
                </span>
              </label>
            </div>
          )}

          {alreadyDone && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[13px] font-medium flex items-center gap-2">
              <span className="material-symbols-rounded text-[18px]">
                check_circle
              </span>
              This candidate has already been verified.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-slate-400/10 flex-shrink-0">
          <Button
            label="Cancel"
            icon="close"
            type="button"
            variant="outlined"
            onClick={onClose}
          />
          {!alreadyDone && (
            <Button
              label={submitting ? 'Submitting…' : 'Submit Verification'}
              icon="check"
              type="button"
              variant="success"
              disabled={!canSubmit || submitting}
              isLoading={submitting}
              onClick={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CandidateQueuePage() {
  const [queue, setQueue] = useState<QueueCandidate[]>(MOCK_QUEUE);
  const [selected, setSelected] = useState<QueueCandidate | null>(null);

  const handleSubmit = (
    id: string,
    docs: DocVerification[],
    overallStatus: string,
    _overallRemark: string
  ) => {
    setQueue(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: overallStatus === 'VERIFIED' ? 'VERIFIED' : 'REJECTED',
              documents: docs,
            }
          : c
      )
    );
  };

  const columns: Controls.ColumnProps<QueueCandidate>[] = [
    { field: 'district', header: 'District', width: '120px' },
    { field: 'testName', header: 'Test Name' },
    { field: 'subject', header: 'Subject', width: '120px' },
    { field: 'applicationNo', header: 'Application Number', width: '170px' },
    { field: 'candidateName', header: 'Candidate Name' },
    { field: 'verificationDate', header: 'Verification Date', width: '140px' },
    { field: 'time', header: 'Time', width: '100px' },
    {
      header: 'Status',
      width: '110px',
      cell: (row: QueueCandidate) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Action',
      width: '100px',
      cell: (row: QueueCandidate) => (
        <Button
          label="Verify"
          icon="verified"
          type="button"
          variant={row.status === 'PENDING' ? 'primary' : 'outlined'}
          size="small"
          onClick={() => setSelected(row)}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Candidate Document Verification"
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        {
          label: 'Verification Center',
          to: '/recruitment-management/verification-center',
        },
        { label: 'Candidate Queue' },
      ]}
    >
      <FormCard title="Candidate Document Verification" icon="fact_check">
        <GridPanel
          data={queue}
          columns={columns}
          searchBox
          searchPlaceholder="Search by district, test name, candidate..."
        />
      </FormCard>

      {selected && (
        <VerificationModal
          candidate={selected}
          onClose={() => setSelected(null)}
          onSubmit={handleSubmit}
        />
      )}
    </FormPage>
  );
}
