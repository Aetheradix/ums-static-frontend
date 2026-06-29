import { Chart } from 'primereact/chart';
import { useState } from 'react';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import type { Candidate } from '../../mock/data';
import { CANDIDATES, TIMELINES, VACANCIES } from '../../mock/data';

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; colorClass: string }> = {
    PENDING_UPLOAD: {
      label: 'Pending Upload',
      colorClass: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
    },
    UPLOADED: {
      label: 'Uploaded',
      colorClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    LOCKED: {
      label: 'Locked',
      colorClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    TIER1_VERIFIED: {
      label: 'Tier 1 Verified',
      colorClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    TIER1_REJECTED: {
      label: 'Tier 1 Rejected',
      colorClass: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
    APPROVED: {
      label: 'Approved',
      colorClass: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    },
    REJECTED: {
      label: 'Rejected',
      colorClass: 'bg-red-500/10 text-red-500 border-red-500/20',
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

// ─── Timeline Card ────────────────────────────────────────────────────────────
function TimelineCard({ tl }: { tl: (typeof TIMELINES)[0] }) {
  const colorMap = {
    Active: {
      card: 'bg-emerald-500/10 border-emerald-500/30',
      badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    },
    Upcoming: {
      card: 'bg-blue-500/5 border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    Closed: {
      card: 'bg-slate-400/5 border-slate-400/10',
      badge: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
    },
  };
  const c = colorMap[tl.status];
  return (
    <div className={`border rounded-xl p-3.5 ${c.card}`}>
      <div className="flex justify-between items-start mb-1.5">
        <div className="text-[13px] font-semibold text-slate-300">
          {tl.type}
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badge}`}
        >
          {tl.status}
        </span>
      </div>
      <div className="text-[11px] text-slate-500">
        {tl.startDate} → {tl.endDate}
      </div>
      <div className="text-[11px] text-slate-500 mt-0.5">{tl.vacancy}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HRAdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>(CANDIDATES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkRemarks, setBulkRemarks] = useState('');
  const [showBulkModal, setShowBulkModal] = useState<
    'approve' | 'reject' | null
  >(null);

  // Only Tier1 acted candidates are visible to HR
  const actionable = candidates.filter(c =>
    ['TIER1_VERIFIED', 'TIER1_REJECTED', 'APPROVED', 'REJECTED'].includes(
      c.status
    )
  );

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    if (selected.size === actionable.length) setSelected(new Set());
    else setSelected(new Set(actionable.map(c => c.id)));
  };

  const handleBulk = (action: 'APPROVED' | 'REJECTED') => {
    setCandidates(prev =>
      prev.map(c =>
        selected.has(c.id)
          ? { ...c, status: action as any, tier2Remarks: bulkRemarks }
          : c
      )
    );
    setSelected(new Set());
    setBulkRemarks('');
    setShowBulkModal(null);
  };

  // Stats
  const approved = candidates.filter(c => c.status === 'APPROVED').length;
  const rejected = candidates.filter(c => c.status === 'REJECTED').length;
  const pendingHR = candidates.filter(
    c => c.status === 'TIER1_VERIFIED'
  ).length;
  const total = candidates.length;

  const statusChartData = {
    labels: [
      'Pending Upload',
      'Uploaded/Locked',
      'Tier 1 Done',
      'HR Approved',
      'Rejected',
    ],
    datasets: [
      {
        data: [
          candidates.filter(c =>
            ['PENDING_UPLOAD', 'UPLOADED'].includes(c.status)
          ).length,
          candidates.filter(c => c.status === 'LOCKED').length,
          candidates.filter(c =>
            ['TIER1_VERIFIED', 'TIER1_REJECTED'].includes(c.status)
          ).length,
          approved,
          rejected,
        ],
        backgroundColor: [
          '#64748b',
          '#f59e0b',
          '#3b82f6',
          '#10b981',
          '#ef4444',
        ],
        hoverOffset: 6,
        borderWidth: 0,
      },
    ],
  };

  const vacancyChartData = {
    labels: VACANCIES.map(v => v.department),
    datasets: [
      {
        label: 'Total Posts',
        backgroundColor: 'rgba(99,102,241,0.4)',
        borderRadius: 6,
        data: VACANCIES.map(v => v.totalPosts),
      },
      {
        label: 'Filled',
        backgroundColor: 'rgba(16,185,129,0.85)',
        borderRadius: 6,
        data: VACANCIES.map(v => v.filled),
      },
    ],
  };

  const chartOpts = {
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 },
      },
    },
    cutout: '65%',
    maintainAspectRatio: false,
  };

  const barOpts = {
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148,163,184,0.1)' },
        ticks: { color: '#94a3b8' },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <FormPage
      title="HR / Admin Dashboard"
      description="Manage recruitment drives, timelines, vacancies, and candidate approvals."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'HR Admin' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Candidates"
            value={total}
            icon="groups"
            colorScheme="blue"
            subtitle="In this drive"
          />
          <StatCard
            title="Pending HR Review"
            value={pendingHR}
            icon="pending_actions"
            colorScheme="orange"
            subtitle="Tier 1 cleared"
          />
          <StatCard
            title="Approved"
            value={approved}
            icon="check_circle"
            colorScheme="green"
            subtitle="Choice filling eligible"
          />
          <StatCard
            title="Rejected"
            value={rejected}
            icon="cancel"
            colorScheme="red"
            subtitle="HR rejection"
          />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormCard title="Candidate Status Breakdown" icon="pie_chart">
            <div className="h-60">
              <Chart
                type="doughnut"
                data={statusChartData}
                options={chartOpts}
                className="w-full h-full"
              />
            </div>
          </FormCard>
          <FormCard title="Vacancy Fill Rate by Department" icon="bar_chart">
            <div className="h-60">
              <Chart
                type="bar"
                data={vacancyChartData}
                options={barOpts}
                className="w-full h-full"
              />
            </div>
          </FormCard>
        </div>

        {/* ── Timelines ── */}
        <FormCard
          title="Recruitment Timelines"
          icon="calendar_month"
          headerAction={
            <button className="bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-lg px-3.5 py-1.5 text-xs font-semibold hover:bg-violet-500/20 transition-colors">
              + Add Timeline
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {TIMELINES.map(tl => (
              <TimelineCard key={tl.id} tl={tl} />
            ))}
          </div>
        </FormCard>

        {/* ── Vacancies ── */}
        <FormCard title="Vacancy Management" icon="work">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-400/5">
                  {[
                    'Adv. No.',
                    'Post',
                    'Department',
                    'Category',
                    'Total Posts',
                    'Filled',
                    'Open',
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
                {VACANCIES.map(v => (
                  <tr
                    key={v.id}
                    className="border-b border-slate-400/5 hover:bg-slate-400/5 transition-colors"
                  >
                    <td className="p-3 text-xs text-violet-500 font-medium">
                      {v.advertisementNo}
                    </td>
                    <td className="p-3 text-[13px] text-slate-300 font-medium">
                      {v.post}
                    </td>
                    <td className="p-3 text-xs text-slate-400">
                      {v.department}
                    </td>
                    <td className="p-3 text-xs text-slate-400">{v.category}</td>
                    <td className="p-3 text-[13px] text-white font-semibold">
                      {v.totalPosts}
                    </td>
                    <td className="p-3">
                      <span className="text-[13px] text-emerald-500 font-semibold">
                        {v.filled}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[13px] font-semibold ${v.totalPosts - v.filled > 0 ? 'text-amber-500' : 'text-slate-500'}`}
                      >
                        {v.totalPosts - v.filled}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        {/* ── Candidate Multi-Select Approval ── */}
        <FormCard
          title="Candidate Review — Bulk Approval"
          icon="fact_check"
          headerAction={
            selected.size > 0 ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBulkModal('reject')}
                  className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg px-3.5 py-1.5 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                >
                  Reject ({selected.size})
                </button>
                <button
                  onClick={() => setShowBulkModal('approve')}
                  className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg px-3.5 py-1.5 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                >
                  Approve ({selected.size})
                </button>
              </div>
            ) : undefined
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-400/5">
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selected.size === actionable.length &&
                        actionable.length > 0
                      }
                      onChange={toggleAll}
                      className="cursor-pointer accent-violet-500 w-4 h-4"
                    />
                  </th>
                  {[
                    'App No.',
                    'Name',
                    'Post',
                    'Center',
                    'Tier 1 Remarks',
                    'Status',
                    '',
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
                {actionable.map(c => (
                  <tr
                    key={c.id}
                    className={`border-b border-slate-400/5 transition-colors ${selected.has(c.id) ? 'bg-violet-500/10' : 'hover:bg-slate-400/5'}`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="cursor-pointer accent-violet-500 w-4 h-4"
                      />
                    </td>
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
                    <td className="p-3 text-[11px] text-slate-500">
                      {c.verificationCenterCode}
                    </td>
                    <td className="p-3 text-xs text-slate-400 max-w-[200px]">
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {c.tier1Remarks ?? '—'}
                      </div>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-3 text-xs text-slate-500">
                      {c.tier2Remarks && (
                        <span title={c.tier2Remarks}>✎ Remarks</span>
                      )}
                    </td>
                  </tr>
                ))}
                {actionable.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-8 text-center text-slate-500 text-[13px]"
                    >
                      No candidates have been reviewed by Verification Centers
                      yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>

      {/* ── Bulk Action Modal ── */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center backdrop-blur-sm">
          <div
            className={`bg-slate-800 border rounded-2xl p-8 w-[440px] shadow-2xl ${showBulkModal === 'approve' ? 'border-emerald-500/30' : 'border-red-500/30'}`}
          >
            <div className="text-lg font-bold text-white mb-2">
              {showBulkModal === 'approve' ? '✓ Bulk Approve' : '✕ Bulk Reject'}{' '}
              — {selected.size} Candidates
            </div>
            <div className="text-[13px] text-slate-400 mb-5">
              {showBulkModal === 'approve'
                ? 'Approving will make these candidates eligible for Choice Filling.'
                : 'Rejection reason is mandatory and will be shown to candidates.'}
            </div>
            <div className="mb-5">
              <div className="text-xs text-slate-400 mb-1.5 font-medium">
                Remarks{' '}
                {showBulkModal === 'reject' && (
                  <span className="text-red-500">*</span>
                )}
              </div>
              <textarea
                rows={3}
                placeholder="Enter remarks..."
                value={bulkRemarks}
                onChange={e => setBulkRemarks(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-400/5 border border-slate-400/20 rounded-lg text-slate-300 text-[13px] outline-none focus:border-indigo-500 transition-colors resize-none box-border"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBulkModal(null);
                  setBulkRemarks('');
                }}
                className="flex-1 py-2.5 rounded-lg border border-slate-400/20 bg-transparent text-slate-400 font-semibold text-[13px] hover:bg-slate-400/10 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={showBulkModal === 'reject' && !bulkRemarks.trim()}
                onClick={() =>
                  handleBulk(
                    showBulkModal === 'approve' ? 'APPROVED' : 'REJECTED'
                  )
                }
                className={`flex-1 py-2.5 rounded-lg border-none text-white font-semibold text-[13px] transition-colors ${
                  showBulkModal === 'approve'
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                    : bulkRemarks.trim()
                      ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      : 'bg-red-500/30 cursor-not-allowed'
                }`}
              >
                Confirm {showBulkModal === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </FormPage>
  );
}
