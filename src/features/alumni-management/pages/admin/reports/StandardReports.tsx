import Chart from 'chart.js/auto';
import {
  mockAlumniProfiles,
  mockContributionAreasList,
} from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { Button } from 'primereact/button';
import { useEffect, useRef, useState } from 'react';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import Tabs from 'shared/new-components/Tabs';

const YEARS = ['2025', '2024', '2023', '2022'];

const KPI_COLORS: Record<string, string> = {
  teal: 'bg-teal-50 border-teal-200 text-teal-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
};

function KpiCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${KPI_COLORS[color] || KPI_COLORS.teal}`}
    >
      <div className="text-xs font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

/* ── Overview Tab ── */
function OverviewTab() {
  const statusRef = useRef<HTMLCanvasElement>(null);
  const deptRef = useRef<HTMLCanvasElement>(null);
  const yearRef = useRef<HTMLCanvasElement>(null);

  const verified = mockAlumniProfiles.filter(
    p => p.status === 'Verified'
  ).length;
  const pending = mockAlumniProfiles.filter(p => p.status === 'Pending').length;
  const rejected = mockAlumniProfiles.filter(
    p => p.status === 'Rejected'
  ).length;

  useEffect(() => {
    if (!statusRef.current) return;
    const ctx = statusRef.current.getContext('2d');
    if (!ctx) return;
    const c = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Verified', 'Pending', 'Rejected'],
        datasets: [
          {
            data: [verified, pending, rejected],
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 12, padding: 8, font: { size: 11 } },
          },
        },
      },
    });
    return () => c.destroy();
  }, [verified, pending, rejected]);

  useEffect(() => {
    if (!deptRef.current) return;
    const ctx = deptRef.current.getContext('2d');
    if (!ctx) return;
    const depts = ['CSE', 'ECE', 'MGT', 'MECH', 'CIVIL'];
    const counts = depts.map(
      d => mockAlumniProfiles.filter(p => p.ouCode === `OU-${d}`).length
    );
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'];
    const c = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: depts,
        datasets: [
          {
            label: 'Alumni',
            data: counts,
            backgroundColor: colors.map(c => c + 'cc'),
            borderColor: colors,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        plugins: { legend: { display: false } },
      },
    });
    return () => c.destroy();
  }, []);

  useEffect(() => {
    if (!yearRef.current) return;
    const ctx = yearRef.current.getContext('2d');
    if (!ctx) return;
    const years = [2021, 2022, 2023, 2024, 2025];
    const counts = years.map(
      y => mockAlumniProfiles.filter(p => p.yearOfPassing === y).length
    );
    const c = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years.map(String),
        datasets: [
          {
            label: 'Alumni Count',
            data: counts,
            borderColor: '#14b8a6',
            backgroundColor: 'rgba(20,184,166,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...counts) * 1.2,
            ticks: { stepSize: 1 },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
      },
    });
    return () => c.destroy();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormCard title="Verification Status Breakdown">
        <div className="h-72">
          <canvas ref={statusRef} />
        </div>
      </FormCard>

      <FormCard title="Registration by Year of Passing">
        <div className="h-72">
          <canvas ref={yearRef} />
        </div>
      </FormCard>

      <FormCard title="Department-wise Alumni Count">
        <div className="h-72">
          <canvas ref={deptRef} />
        </div>
      </FormCard>

      <FormCard title="Top Verified Alumni">
        <div className="overflow-auto h-72 relative">
          <table className="w-full text-sm relative">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">#</th>
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Programme</th>
                <th className="pb-2 font-medium">Employer</th>
                <th className="pb-2 font-medium text-right">Year</th>
              </tr>
            </thead>
            <tbody>
              {mockAlumniProfiles
                .filter(p => p.status === 'Verified')
                .map((p, i) => (
                  <tr
                    key={p.enrolmentNo}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2 text-gray-400">{i + 1}</td>
                    <td className="py-2 font-medium text-gray-800">
                      {p.fullName}
                    </td>
                    <td className="py-2 text-gray-600">{p.program}</td>
                    <td className="py-2 text-gray-600 truncate max-w-32">
                      {p.currentEmployer ?? '—'}
                    </td>
                    <td className="py-2 text-right text-gray-700">
                      {p.yearOfPassing}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </div>
  );
}

/* ── Employment Tab ── */
function EmploymentTab() {
  const empRef = useRef<HTMLCanvasElement>(null);

  const employed = mockAlumniProfiles.filter(p => p.currentEmployer).length;
  const unemployed = mockAlumniProfiles.length - employed;

  useEffect(() => {
    if (!empRef.current) return;
    const ctx = empRef.current.getContext('2d');
    if (!ctx) return;
    const c = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Employed', 'Not Disclosed'],
        datasets: [
          {
            data: [employed, unemployed],
            backgroundColor: ['#22c55e', '#e5e7eb'],
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
      },
    });
    return () => c.destroy();
  }, [employed, unemployed]);

  const columns = [
    { field: 'fullName', header: 'Name' },
    { field: 'program', header: 'Programme' },
    { field: 'yearOfPassing', header: 'Year' },
    { field: 'currentCity', header: 'City' },
    { field: 'currentEmployer', header: 'Employer' },
    { field: 'designation', header: 'Designation' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <FormCard title="Employment Status" className="lg:col-span-1">
        <div className="h-64">
          <canvas ref={empRef} />
        </div>
      </FormCard>

      <FormCard title="Alumni Employment Directory" className="lg:col-span-2">
        <div className="p-2">
          <GridPanel
            searchBox
            toolbar={<Button label="Export" icon="pi pi-download" />}
            data={mockAlumniProfiles.filter(p => p.currentEmployer)}
            columns={columns as any}
          />
        </div>
      </FormCard>
    </div>
  );
}

/* ── Contributions Tab ── */
function ContributionsTab() {
  const contribRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!contribRef.current) return;
    const ctx = contribRef.current.getContext('2d');
    if (!ctx) return;
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'];
    const c = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: mockContributionAreasList.map(a => a.area),
        datasets: [
          {
            label: 'Alumni Enrolled',
            data: mockContributionAreasList.map(a => a.enrolledCount),
            backgroundColor: colors.map(c => c + 'cc'),
            borderColor: colors,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } },
      },
    });
    return () => c.destroy();
  }, []);

  const columns = [
    { field: 'area', header: 'Contribution Area' },
    { field: 'description', header: 'Description' },
    { field: 'enrolledCount', header: 'Enrolled Alumni' },
    {
      field: 'isActive',
      header: 'Status',
      body: (row: any) => (row.isActive ? 'Active' : 'Inactive'),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormCard title="Contribution Area Enrollment">
        <div className="h-72">
          <canvas ref={contribRef} />
        </div>
      </FormCard>

      <FormCard title="Contribution Areas Summary">
        <div className="p-2">
          <GridPanel
            searchBox
            data={mockContributionAreasList}
            columns={columns as any}
          />
        </div>
      </FormCard>
    </div>
  );
}

/* ── Download Tab ── */
const REPORT_CATALOGUE = [
  {
    id: 'RPT-001',
    name: 'Department-wise Alumni Distribution',
    type: 'Summary',
    format: 'PDF / Excel',
    lastGenerated: '2025-06-15',
  },
  {
    id: 'RPT-002',
    name: 'Programme-wise Alumni Count',
    type: 'Summary',
    format: 'PDF / Excel',
    lastGenerated: '2025-06-15',
  },
  {
    id: 'RPT-003',
    name: 'Year of Passing Distribution',
    type: 'Trend',
    format: 'PDF',
    lastGenerated: '2025-06-10',
  },
  {
    id: 'RPT-004',
    name: 'Employment Status Report',
    type: 'Detail',
    format: 'Excel',
    lastGenerated: '2025-06-01',
  },
  {
    id: 'RPT-005',
    name: 'Geographic Distribution (City-wise)',
    type: 'Map',
    format: 'PDF',
    lastGenerated: '2025-05-20',
  },
  {
    id: 'RPT-006',
    name: 'Verification Status Summary',
    type: 'Summary',
    format: 'PDF / Excel',
    lastGenerated: '2025-06-20',
  },
  {
    id: 'RPT-007',
    name: 'Contribution Participation Report',
    type: 'Detail',
    format: 'Excel',
    lastGenerated: '2025-05-30',
  },
  {
    id: 'RPT-008',
    name: 'Email Campaign Analytics Report',
    type: 'Analytics',
    format: 'PDF',
    lastGenerated: '2025-06-01',
  },
];

function DownloadsTab() {
  const columns = [
    { field: 'id', header: 'Report ID' },
    { field: 'name', header: 'Report Name' },
    { field: 'type', header: 'Type' },
    { field: 'format', header: 'Available Formats' },
    { field: 'lastGenerated', header: 'Last Generated' },
  ];
  return (
    <FormCard title="Report Catalogue">
      <div className="p-2">
        <GridPanel
          searchBox
          toolbar={<Button label="Export All" icon="pi pi-download" />}
          data={REPORT_CATALOGUE}
          columns={columns as any}
          editCaption="Generate"
          onEdit={() => {}}
        />
      </div>
    </FormCard>
  );
}

/* ── Main Page ── */
export default function StandardReports() {
  const [year, setYear] = useState('2025');
  const total = mockAlumniProfiles.length;
  const verified = mockAlumniProfiles.filter(
    p => p.status === 'Verified'
  ).length;
  const employed = mockAlumniProfiles.filter(p => p.currentEmployer).length;
  const verifiedPct = total > 0 ? Math.round((verified / total) * 100) : 0;

  return (
    <FormPage
      title="Alumni Reports Dashboard"
      description="Consolidated analytics and downloadable reports for the Alumni module."
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Reports' },
      ]}
      headerAction={
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Year:</label>
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {YEARS.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <KpiCard label="Total Alumni" value={total} color="teal" />
        <KpiCard label="Verified" value={verified} color="green" />
        <KpiCard
          label="Verification %"
          value={`${verifiedPct}%`}
          color="blue"
        />
        <KpiCard label="Employed" value={employed} color="purple" />
        <KpiCard label="Departments" value="5" color="indigo" />
        <KpiCard label="Active Mentors" value="142" color="orange" />
        <KpiCard
          label="Contribution Areas"
          value={mockContributionAreasList.filter(a => a.isActive).length}
          color="red"
        />
      </div>

      {/* Tabbed Reports */}
      <Tabs
        tabs={[
          { title: 'Overview', content: <OverviewTab /> },
          { title: 'Employment', content: <EmploymentTab /> },
          { title: 'Contributions', content: <ContributionsTab /> },
          { title: 'Downloads', content: <DownloadsTab /> },
        ]}
      />
    </FormPage>
  );
}
