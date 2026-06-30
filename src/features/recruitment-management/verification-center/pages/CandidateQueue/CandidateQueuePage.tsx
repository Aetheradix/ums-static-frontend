import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';

interface DocVerification {
  docName: string;
  status: string;
  remark: string;
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

const DOC_NAMES = [
  'Graduation Marksheet',
  '12th Marksheet',
  'Category Certificate',
  'Identity Proof',
];

const makeDocSet = (): DocVerification[] =>
  DOC_NAMES.map(d => ({ docName: d, status: '', remark: '' }));

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

const STATUS_BADGE_MAP: Record<string, 'pending' | 'approved' | 'rejected'> = {
  PENDING: 'pending',
  VERIFIED: 'approved',
  REJECTED: 'rejected',
};

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
    value: string
  ) => {
    setDocs(prev =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d))
    );
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
    <FormPopup
      visible
      onHide={onClose}
      size="xl"
      title={`Document Verification — ${candidate.candidateName}`}
      subtitle={`${candidate.applicationNo} · ${candidate.subject} · ${candidate.district}`}
      bodyClassName="flex flex-col gap-6"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
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
              variant="primary"
              disabled={!canSubmit || submitting}
              isLoading={submitting}
              onClick={handleSubmit}
            />
          )}
        </div>
      }
    >
      {/* Document Review */}
      <div>
        <p className="text-sm font-semibold mb-3">Document Review</p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-3 text-left text-xs font-semibold w-10">#</th>
                <th className="p-3 text-left text-xs font-semibold">
                  Document Name
                </th>
                <th className="p-3 text-left text-xs font-semibold w-48">
                  Status
                </th>
                <th className="p-3 text-left text-xs font-semibold">Remark</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3 text-xs">{i + 1}</td>
                  <td className="p-3 text-sm font-medium">{doc.docName}</td>
                  <td className="p-3">
                    {alreadyDone ? (
                      <StatusBadge
                        label={doc.status || '—'}
                        variant={
                          doc.status === 'VERIFIED'
                            ? 'approved'
                            : doc.status === 'NOT_VERIFIED' ||
                                doc.status === 'MISSING'
                              ? 'rejected'
                              : 'neutral'
                        }
                      />
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
                  <td className="p-3">
                    {alreadyDone ? (
                      <span className="text-xs italic">
                        {doc.remark || '—'}
                      </span>
                    ) : (
                      <TextBox
                        id={`doc-remark-${i}`}
                        label=""
                        value={doc.remark}
                        onChange={v => updateDoc(i, 'remark', v)}
                        placeholder="Remarks..."
                        maxLength={150}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overall Verification Status */}
      <div className="p-4 rounded-lg border bg-white/5">
        <p className="text-sm font-semibold mb-3">
          Overall Verification Status
        </p>
        {alreadyDone ? (
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs mb-1">Status</p>
              <StatusBadge
                label={candidate.status}
                variant={STATUS_BADGE_MAP[candidate.status] ?? 'neutral'}
              />
            </div>
            <div>
              <p className="text-xs mb-1">Remark</p>
              <p className="text-sm">—</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>
        )}
      </div>

      {/* Declaration */}
      {!alreadyDone && (
        <div className="p-4 rounded-lg border bg-white/5">
          <p className="text-sm font-semibold mb-3">Declaration</p>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={declared}
              onChange={e => setDeclared(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-violet-500 cursor-pointer flex-shrink-0"
            />
            <span className="text-sm group-hover:opacity-80 transition-opacity leading-relaxed">
              I declare that I have verified all documents and the information
              provided is correct. *
            </span>
          </label>
        </div>
      )}

      {alreadyDone && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-medium">
          This candidate has already been verified.
        </div>
      )}
    </FormPopup>
  );
}

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
      cell: (row: QueueCandidate) => (
        <StatusBadge
          label={row.status}
          variant={STATUS_BADGE_MAP[row.status] ?? 'neutral'}
        />
      ),
    },
    {
      header: 'Action',
      width: '110px',
      cell: (row: QueueCandidate) =>
        row.status === 'PENDING' ? (
          <Button
            label="Verify"
            icon="verified"
            type="button"
            variant="primary"
            size="small"
            onClick={() => setSelected(row)}
          />
        ) : (
          <span className="text-xs text-slate-500 italic">Already done</span>
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
