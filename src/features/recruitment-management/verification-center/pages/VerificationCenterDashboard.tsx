import { useState } from 'react';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import type { Candidate } from '../../mock/data';
import { CANDIDATES } from '../../mock/data';

// Center Incharge sees only their center: LKO-01
const MY_CENTER_CODE = 'LKO-01';
const MY_CENTER_NAME = 'District Collectorate, Lucknow';

const myCandidates = CANDIDATES.filter(
  c => c.verificationCenterCode === MY_CENTER_CODE
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; colorClass: string }> = {
    LOCKED: {
      label: 'Awaiting Review',
      colorClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    TIER1_VERIFIED: {
      label: 'Verified',
      colorClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    TIER1_REJECTED: {
      label: 'Rejected',
      colorClass: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
    APPROVED: {
      label: 'HR Approved',
      colorClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
  };
  const cfg = map[status] ?? {
    label: status,
    colorClass: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.colorClass}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Candidate Detail Drawer ──────────────────────────────────────────────────
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
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-end">
      <div className="w-[560px] h-screen bg-slate-900 border-l border-slate-400/10 overflow-y-auto shadow-[-20px_0_60px_rgba(0,0,0,0.6)] p-7 flex flex-col gap-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-lg font-bold text-white">{candidate.name}</div>
            <div className="text-xs text-slate-500">
              {candidate.applicationNo} · {candidate.post}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-slate-500 hover:text-slate-300 cursor-pointer text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <StatusBadge status={candidate.status} />
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <span className="material-symbols-rounded text-[14px]">
              schedule
            </span>
            Reporting: {candidate.reportingDate}
          </span>
        </div>

        {/* Documents */}
        <FormCard title="Uploaded Documents" icon="folder_open">
          <div className="flex flex-col gap-2">
            {candidate.documents.map((doc, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-2.5 bg-slate-400/5 rounded-lg border border-slate-400/10"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-rounded text-[18px] ${doc.uploaded ? 'text-emerald-500' : 'text-red-500'}`}
                  >
                    {doc.uploaded ? 'description' : 'cancel'}
                  </span>
                  <div>
                    <div className="text-[13px] text-slate-300 font-medium">
                      {doc.type}
                    </div>
                    {doc.uploaded && (
                      <div className="text-[11px] text-slate-500">
                        {doc.fileName} · {doc.fileSize}
                      </div>
                    )}
                  </div>
                </div>
                {doc.uploaded && (
                  <button className="bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-md px-2.5 py-1 text-[11px] font-semibold hover:bg-blue-500/20 transition-colors">
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
        </FormCard>

        {/* Remarks */}
        <div>
          <div className="text-[13px] text-slate-400 font-semibold mb-2">
            Description / Remarks{' '}
            {!alreadyActed && <span className="text-red-500">*</span>}
          </div>
          <textarea
            rows={4}
            disabled={alreadyActed}
            placeholder="Enter remarks (mandatory on rejection)..."
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            className={`w-full p-3 bg-slate-400/5 border border-slate-400/20 rounded-lg text-slate-300 text-[13px] resize-y outline-none box-border focus:border-indigo-500 transition-colors ${alreadyActed ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>

        {/* Actions */}
        {!alreadyActed ? (
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => handleDecision('TIER1_REJECTED')}
              disabled={!remarks.trim() || submitting}
              className={`flex-1 py-3 rounded-lg border font-semibold text-sm transition-colors ${!remarks.trim() ? 'bg-red-500/10 border-red-500/20 text-red-500/50 cursor-not-allowed' : 'bg-red-500/10 border-red-500/40 text-red-300 hover:bg-red-500/20 cursor-pointer'}`}
            >
              Reject
            </button>
            <button
              onClick={() => handleDecision('TIER1_VERIFIED')}
              disabled={submitting}
              className="flex-1 py-3 rounded-lg border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-sm cursor-pointer hover:from-emerald-600 hover:to-emerald-700 transition-colors"
            >
              Verify ✓
            </button>
          </div>
        ) : (
          <div
            className={`p-3.5 rounded-lg text-[13px] font-medium border ${candidate.status === 'TIER1_VERIFIED' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'}`}
          >
            {candidate.status === 'TIER1_VERIFIED'
              ? '✓ Already marked as Verified'
              : '✕ Already marked as Rejected'}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
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

  return (
    <FormPage
      title="Verification Center — Incharge Dashboard"
      description={`${MY_CENTER_NAME} (${MY_CENTER_CODE})`}
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
            value={candidates.length}
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

        {/* ── Progress Bar ── */}
        <FormCard title="Review Progress" icon="bar_chart">
          <div className="mb-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>
                {done} of {candidates.length} candidates reviewed
              </span>
              <span>{Math.round((done / candidates.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-400/15 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500 ease-in-out"
                style={{ width: `${(done / candidates.length) * 100}%` }}
              />
            </div>
          </div>
        </FormCard>

        {/* ── Candidate Queue Table ── */}
        <FormCard title="Candidate Queue" icon="list_alt">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-400/5">
                  {[
                    'App No.',
                    'Name',
                    'Post',
                    'Category',
                    'Reporting',
                    'Status',
                    'Action',
                  ].map(h => (
                    <th
                      key={h}
                      className="p-3 text-left text-[11px] text-slate-500 font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-400/5 hover:bg-slate-400/5 transition-colors"
                  >
                    <td className="p-3 text-[13px] text-violet-500 font-semibold">
                      {c.applicationNo}
                    </td>
                    <td className="p-3 text-[13px] text-slate-300 font-medium">
                      <div>{c.name}</div>
                      <div className="text-[11px] text-slate-500">
                        Rank #{c.merit}
                      </div>
                    </td>
                    <td className="p-3 text-xs text-slate-400">{c.post}</td>
                    <td className="p-3 text-xs text-slate-400">{c.category}</td>
                    <td className="p-3 text-xs text-slate-400">
                      {c.reportingDate}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelected(c)}
                        className="bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg px-3.5 py-1.5 text-xs cursor-pointer font-semibold flex items-center gap-1 hover:bg-violet-500/20 transition-colors"
                      >
                        <span className="material-symbols-rounded text-[14px]">
                          open_in_new
                        </span>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
