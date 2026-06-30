import { Chart } from 'primereact/chart';
import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import type { Candidate } from '../../../mock/data';
import { CANDIDATES } from '../../../mock/data';

const MY_CENTER_CODE = 'LKO-01';
const MY_CENTER_NAME = 'District Collectorate, Lucknow';

const myCandidates = CANDIDATES.filter(
  c => c.verificationCenterCode === MY_CENTER_CODE
);

const STATUS_BADGE_MAP: Record<
  string,
  'pending' | 'approved' | 'rejected' | 'neutral'
> = {
  LOCKED: 'pending',
  TIER1_VERIFIED: 'approved',
  TIER1_REJECTED: 'rejected',
  APPROVED: 'approved',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  LOCKED: 'Awaiting Review',
  TIER1_VERIFIED: 'Verified',
  TIER1_REJECTED: 'Rejected',
  APPROVED: 'HR Approved',
};

function CandidateDrawer({
  candidate,
  onClose,
  onDecision,
}: {
  candidate: Candidate;
  onClose: () => void;
  onDecision: (
    id: string,
    decision: 'TIER1_VERIFIED' | 'TIER1_REJECTED',
    remarks: string
  ) => void;
}) {
  const [remarks, setRemarks] = useState(candidate.tier1Remarks ?? '');
  const [submitting, setSubmitting] = useState(false);

  const alreadyActed =
    candidate.status === 'TIER1_VERIFIED' ||
    candidate.status === 'TIER1_REJECTED';

  const handleDecision = (decision: 'TIER1_VERIFIED' | 'TIER1_REJECTED') => {
    if (decision === 'TIER1_REJECTED' && !remarks.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      onDecision(candidate.id, decision, remarks);
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <FormPopup
      visible
      onHide={onClose}
      size="lg"
      title={candidate.name}
      subtitle={`${candidate.applicationNo} · ${candidate.post}`}
      bodyClassName="flex flex-col gap-5"
      footer={
        !alreadyActed ? (
          <div className="flex items-center gap-3 w-full">
            <Button
              label="Reject"
              icon="close"
              type="button"
              variant="danger"
              onClick={() => handleDecision('TIER1_REJECTED')}
              disabled={!remarks.trim() || submitting}
            />
            <Button
              label={submitting ? 'Submitting…' : 'Verify'}
              icon="check"
              type="button"
              variant="primary"
              disabled={submitting}
              isLoading={submitting}
              onClick={() => handleDecision('TIER1_VERIFIED')}
            />
          </div>
        ) : (
          <Button
            label="Close"
            type="button"
            variant="outlined"
            onClick={onClose}
          />
        )
      }
    >
      {/* Status & Reporting */}
      <div className="flex items-center gap-3 flex-wrap">
        <StatusBadge
          label={STATUS_LABEL_MAP[candidate.status] ?? candidate.status}
          variant={STATUS_BADGE_MAP[candidate.status] ?? 'neutral'}
        />
        <span className="text-xs flex items-center gap-1">
          <span className="material-symbols-rounded text-sm">schedule</span>
          Reporting: {candidate.reportingDate}
        </span>
      </div>

      {/* Documents */}
      <div>
        <p className="text-sm font-semibold mb-3">Uploaded Documents</p>
        <div className="flex flex-col gap-2">
          {candidate.documents.map((doc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border bg-white/5"
            >
              <div className="flex items-center gap-3">
                <StatusBadge
                  label={doc.uploaded ? 'Uploaded' : 'Missing'}
                  variant={doc.uploaded ? 'approved' : 'rejected'}
                />
                <div>
                  <p className="text-sm font-medium">{doc.type}</p>
                  {doc.uploaded && (
                    <p className="text-xs">
                      {doc.fileName} · {doc.fileSize}
                    </p>
                  )}
                </div>
              </div>
              {doc.uploaded && (
                <Button
                  label="View"
                  icon="eye"
                  type="button"
                  variant="outlined"
                  size="small"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Remarks */}
      <div>
        <p className="text-sm font-semibold mb-3">
          Remarks {!alreadyActed && <span className="text-red-500">*</span>}
        </p>
        <TextBox
          id="remarks"
          label=""
          value={remarks}
          onChange={setRemarks}
          placeholder="Enter remarks (mandatory on rejection)..."
          disabled={alreadyActed}
          maxLength={500}
        />
      </div>

      {alreadyActed && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border ${
            candidate.status === 'TIER1_VERIFIED'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
              : 'bg-red-500/10 border-red-500/20 text-red-600'
          }`}
        >
          {candidate.status === 'TIER1_VERIFIED'
            ? 'Already marked as Verified'
            : 'Already marked as Rejected'}
        </div>
      )}
    </FormPopup>
  );
}

export default function VerificationCenterDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>(myCandidates);
  const [selected, setSelected] = useState<Candidate | null>(null);

  const handleDecision = (
    id: string,
    decision: 'TIER1_VERIFIED' | 'TIER1_REJECTED',
    remarks: string
  ) => {
    setCandidates(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: decision, tier1Remarks: remarks } : c
      )
    );
  };

  const pending = candidates.filter(c => c.status === 'LOCKED').length;
  const verified = candidates.filter(c => c.status === 'TIER1_VERIFIED').length;
  const rejected = candidates.filter(c => c.status === 'TIER1_REJECTED').length;
  const done = candidates.filter(c =>
    ['TIER1_VERIFIED', 'TIER1_REJECTED', 'APPROVED'].includes(c.status)
  ).length;
  const total = candidates.length;

  const statusChartData = {
    labels: ['Awaiting Review', 'Verified', 'Rejected', 'HR Approved'],
    datasets: [
      {
        data: [
          pending,
          verified,
          rejected,
          candidates.filter(c => c.status === 'APPROVED').length,
        ],
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6'],
        hoverOffset: 8,
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#94a3b8',
          padding: 16,
          font: { size: 12 },
          boxWidth: 12,
          borderRadius: 4,
        },
      },
    },
    cutout: '65%',
    maintainAspectRatio: false,
  };

  const columns: Controls.ColumnProps<Candidate>[] = [
    { field: 'applicationNo', header: 'App No.', width: '140px' },
    {
      field: 'name',
      header: 'Name',
      cell: (row: Candidate) => (
        <div>
          <div className="text-sm font-medium">{row.name}</div>
          <div className="text-xs">Rank #{row.merit}</div>
        </div>
      ),
    },
    { field: 'post', header: 'Post', width: '160px' },
    { field: 'category', header: 'Category', width: '100px' },
    { field: 'reportingDate', header: 'Reporting', width: '150px' },
    {
      header: 'Status',
      width: '140px',
      cell: (row: Candidate) => (
        <StatusBadge
          label={STATUS_LABEL_MAP[row.status] ?? row.status}
          variant={STATUS_BADGE_MAP[row.status] ?? 'neutral'}
        />
      ),
    },
    {
      header: 'Action',
      width: '110px',
      cell: (row: Candidate) => (
        <Button
          label={row.status === 'LOCKED' ? 'Review' : 'View'}
          icon="open_in_new"
          type="button"
          variant={row.status === 'LOCKED' ? 'primary' : 'outlined'}
          size="small"
          onClick={() => setSelected(row)}
        />
      ),
    },
  ];

  return (
    <FormPage
      title={`Verification Center — ${MY_CENTER_NAME}`}
      description={`${MY_CENTER_CODE} · Manage candidate document verification at your center.`}
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'Verification Center' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Assigned"
            value={total}
            icon="groups"
            colorScheme="blue"
            subtitle="At this center"
          />
          <StatCard
            title="Awaiting Review"
            value={pending}
            icon="pending_actions"
            colorScheme="orange"
            subtitle="Locked profiles"
          />
          <StatCard
            title="Verified"
            value={verified}
            icon="check_circle"
            colorScheme="green"
            subtitle="Passed Tier 1"
          />
          <StatCard
            title="Rejected"
            value={rejected}
            icon="cancel"
            colorScheme="red"
            subtitle="Tier 1 rejection"
          />
        </div>

        {/* ── Progress + Chart Row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormCard title="Review Progress" icon="bar_chart">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-sm mb-1">
                <span>
                  {done} of {total} candidates reviewed
                </span>
                <span className="font-semibold">
                  {Math.round((done / total) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
            </div>
          </FormCard>

          <FormCard title="Status Breakdown" icon="pie_chart">
            <div className="h-56">
              <Chart
                type="doughnut"
                data={statusChartData}
                options={doughnutOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>
        </div>

        {/* ── Candidate Table ── */}
        <FormCard title="Candidate Queue" icon="list_alt">
          <GridPanel
            data={candidates}
            columns={columns}
            searchBox
            searchPlaceholder="Search by name, application no., or post..."
          />
        </FormCard>
      </div>

      {selected && (
        <CandidateDrawer
          candidate={selected}
          onClose={() => setSelected(null)}
          onDecision={handleDecision}
        />
      )}
    </FormPage>
  );
}
