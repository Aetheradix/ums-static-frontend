import { Chart } from 'primereact/chart';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import type { Candidate } from '../../../mock/data';
import { CANDIDATES, TIMELINES, VACANCIES } from '../../../mock/data';

const statusChartData = {
  labels: [
    'Pending Upload',
    'Uploaded/Locked',
    'Tier 1 Processed',
    'HR Approved',
    'Rejected',
  ],
  datasets: [
    {
      data: [
        CANDIDATES.filter(c =>
          ['PENDING_UPLOAD', 'UPLOADED'].includes(c.status)
        ).length,
        CANDIDATES.filter(c => c.status === 'LOCKED').length,
        CANDIDATES.filter(c =>
          ['TIER1_VERIFIED', 'TIER1_REJECTED'].includes(c.status)
        ).length,
        CANDIDATES.filter(c => c.status === 'APPROVED').length,
        CANDIDATES.filter(c => c.status === 'REJECTED').length,
      ],
      backgroundColor: ['#64748b', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
      hoverOffset: 8,
      borderWidth: 0,
    },
  ],
};

const vacancyChartData = {
  labels: VACANCIES.map(v => v.department),
  datasets: [
    {
      label: 'Total Posts',
      backgroundColor: 'rgba(99, 102, 241, 0.4)',
      borderRadius: 6,
      data: VACANCIES.map(v => v.totalPosts),
    },
    {
      label: 'Filled',
      backgroundColor: 'rgba(16, 185, 129, 0.85)',
      borderRadius: 6,
      data: VACANCIES.map(v => v.filled),
    },
  ],
};

const timelineChartData = {
  labels: TIMELINES.map(t => t.type),
  datasets: [
    {
      label: 'Duration (Days)',
      backgroundColor: TIMELINES.map(t =>
        t.status === 'Active'
          ? 'rgba(16,185,129,0.8)'
          : t.status === 'Upcoming'
            ? 'rgba(59,130,246,0.6)'
            : 'rgba(100,116,139,0.4)'
      ),
      borderRadius: 6,
      data: TIMELINES.map(t => {
        const s = new Date(t.startDate);
        const e = new Date(t.endDate);
        return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
      }),
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

const barOptions = {
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#94a3b8', padding: 16, font: { size: 12 } },
    },
    tooltip: { mode: 'index' as const, intersect: false },
  },
  scales: {
    x: {
      stacked: false,
      grid: { display: false },
      ticks: { color: '#94a3b8' },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(148,163,184,0.1)' },
      ticks: { color: '#94a3b8' },
    },
  },
  maintainAspectRatio: false,
};

export default function HRAdminDashboard() {
  const navigate = useNavigate();
  const [candidates] = useState<Candidate[]>(CANDIDATES);

  const approved = candidates.filter(c => c.status === 'APPROVED').length;
  const rejected = candidates.filter(c => c.status === 'REJECTED').length;
  const pendingHR = candidates.filter(
    c => c.status === 'TIER1_VERIFIED'
  ).length;
  const total = candidates.length;

  return (
    <FormPage
      title="HR / Admin Dashboard"
      description="HR command center — real-time overview of candidate pipeline, vacancies, and recruitment timelines."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'HR Admin' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* ── Row 1: KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Candidates"
            value={total}
            icon="groups"
            colorScheme="blue"
            subtitle="Registered across drives"
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

        {/* ── Row 2: Candidate Status Doughnut + Vacancy Fill Bar ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormCard
            title="Candidate Status Breakdown"
            icon="pie_chart"
            headerAction={
              <Button
                label="View Candidates"
                variant="text"
                size="small"
                icon="arrow-right"
                onClick={() =>
                  navigate('/recruitment-management/admin/merit-list')
                }
              />
            }
          >
            <div className="w-full h-72">
              <Chart
                type="doughnut"
                data={statusChartData}
                options={doughnutOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>

          <FormCard
            title="Vacancy Fill Rate by Department"
            icon="bar_chart"
            headerAction={
              <Button
                label="Manage Vacancies"
                variant="text"
                size="small"
                icon="arrow-right"
                onClick={() =>
                  navigate('/recruitment-management/admin/vacancy-upload')
                }
              />
            }
          >
            <div className="w-full h-72">
              <Chart
                type="bar"
                data={vacancyChartData}
                options={barOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>
        </div>

        {/* ── Row 3: Timeline Bar + Vacancy Table ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormCard
            title="Recruitment Timeline Duration"
            icon="calendar_month"
            headerAction={
              <Button
                label="View Timeline"
                variant="text"
                size="small"
                icon="arrow-right"
                onClick={() =>
                  navigate('/recruitment-management/admin/vacancy-upload')
                }
              />
            }
          >
            <div className="w-full h-72">
              <Chart
                type="bar"
                data={timelineChartData}
                options={barOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>

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
                      <td className="p-3 text-xs text-slate-400">
                        {v.category}
                      </td>
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
        </div>
      </div>
    </FormPage>
  );
}
