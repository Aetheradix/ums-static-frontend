import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import Tabs from 'shared/new-components/Tabs';
import { useReportsDashboardQuery } from '../../../queries';

const SEMESTERS = ['Odd 2024', 'Even 2024', 'Odd 2023', 'Even 2023'];

export default function ReportsDashboard() {
  const { data, isLoading, isError, error } = useReportsDashboardQuery();
  const [semester, setSemester] = useState('Odd 2024');

  if (isError) {
    return (
      <FormPage
        title="Examination Reports Dashboard"
        description="Consolidated reporting analytics for the Examination Management System."
      >
        <div className="flex items-center justify-center h-64 text-red-500">
          {(error as Error)?.message || 'Failed to load reports data'}
        </div>
      </FormPage>
    );
  }

  if (isLoading || !data) {
    return (
      <FormPage
        title="Examination Reports Dashboard"
        description="Consolidated reporting analytics for the Examination Management System."
      >
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading reports data...
        </div>
      </FormPage>
    );
  }

  const d = data;

  return (
    <FormPage
      title="Examination Reports Dashboard"
      description="Consolidated reporting analytics for the Examination Management System."
      headerAction={
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Semester:</label>
          <select
            value={semester}
            onChange={e => setSemester(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SEMESTERS.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <KpiCard
          label="Total Students"
          value={d.overview.totalStudents}
          color="blue"
        />
        <KpiCard label="Appeared" value={d.overview.appeared} color="indigo" />
        <KpiCard label="Passed" value={d.overview.passed} color="green" />
        <KpiCard
          label="Pass %"
          value={`${d.overview.passPercentage}%`}
          color="emerald"
        />
        <KpiCard
          label="Avg SGPA"
          value={d.overview.avgSgpa.toFixed(2)}
          color="purple"
        />
        <KpiCard label="At-Risk" value={d.overview.atRisk} color="orange" />
        <KpiCard
          label="Attendance"
          value={`${d.overview.attendanceRate}%`}
          color="teal"
        />
      </div>

      {/* Tabbed Dashboard */}
      <Tabs
        tabs={[
          {
            title: 'Overview',
            content: <OverviewTab data={d} />,
          },
          {
            title: 'Performance',
            content: <PerformanceTab data={d} />,
          },
          {
            title: 'Subjects',
            content: <SubjectsTab data={d} />,
          },
          {
            title: 'Enrollment',
            content: <EnrollmentTab data={d} />,
          },
        ]}
      />
    </FormPage>
  );
}

/* ── KPI Card ── */
function KpiCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    teal: 'bg-teal-50 border-teal-200 text-teal-700',
  };

  return (
    <div
      className={`rounded-xl border p-4 ${colorMap[color] || colorMap.blue}`}
    >
      <div className="text-xs font-medium opacity-70 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

/* ── Overview Tab ── */
function OverviewTab({ data }: { data: Examination.ReportsDashboard }) {
  const gradeCanvasRef = useRef<HTMLCanvasElement>(null);
  const sgpaCanvasRef = useRef<HTMLCanvasElement>(null);
  const failureCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!gradeCanvasRef.current) return;
    const ctx = gradeCanvasRef.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.gradeDistribution.map(
          g => `${g.grade} (${g.minScore}-${g.maxScore})`
        ),
        datasets: [
          {
            data: data.gradeDistribution.map(g => g.count),
            backgroundColor: data.gradeDistribution.map(g => g.color),
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
    return () => chart.destroy();
  }, [data]);

  useEffect(() => {
    if (!sgpaCanvasRef.current) return;
    const ctx = sgpaCanvasRef.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.sgpaTrend.map(s => `Sem ${s.semester}`),
        datasets: [
          {
            label: 'Avg SGPA',
            data: data.sgpaTrend.map(s => s.avgSgpa),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: 'Max SGPA',
            data: data.sgpaTrend.map(s => s.maxSgpa),
            borderColor: '#22c55e',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.3,
            pointRadius: 3,
          },
          {
            label: 'Min SGPA',
            data: data.sgpaTrend.map(s => s.minSgpa),
            borderColor: '#ef4444',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.3,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 5, max: 10, ticks: { stepSize: 0.5 } },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 8, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  useEffect(() => {
    if (!failureCanvasRef.current) return;
    const ctx = failureCanvasRef.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.failureAnalysis.map(f => f.subject),
        datasets: [
          {
            label: 'Failed Students',
            data: data.failureAnalysis.map(f => f.failed),
            backgroundColor: 'rgba(239,68,68,0.7)',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: { ticks: { stepSize: 20 } },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Grade Distribution */}
      <FormCard title="Grade Distribution">
        <div className="h-72">
          <canvas ref={gradeCanvasRef} />
        </div>
      </FormCard>

      {/* SGPA Trend */}
      <FormCard title="SGPA Trend Across Semesters">
        <div className="h-72">
          <canvas ref={sgpaCanvasRef} />
        </div>
      </FormCard>

      {/* Top Performers */}
      <FormCard title="Top Performers">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">Rank</th>
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">USN</th>
                <th className="pb-2 font-medium">Program</th>
                <th className="pb-2 font-medium text-right">SGPA</th>
              </tr>
            </thead>
            <tbody>
              {data.topPerformers.map(p => (
                <tr key={p.rank} className="border-b border-gray-100">
                  <td className="py-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                        p.rank === 1
                          ? 'bg-yellow-400'
                          : p.rank === 2
                            ? 'bg-gray-400'
                            : p.rank === 3
                              ? 'bg-amber-600'
                              : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {p.rank}
                    </span>
                  </td>
                  <td className="py-2 font-medium text-gray-800">{p.name}</td>
                  <td className="py-2 text-gray-500">{p.usn}</td>
                  <td className="py-2">{p.program}</td>
                  <td className="py-2 text-right font-semibold">{p.sgpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>

      {/* Failure Analysis */}
      <FormCard title="Failure Analysis (Top 5 Subjects)">
        <div className="h-72">
          <canvas ref={failureCanvasRef} />
        </div>
      </FormCard>
    </div>
  );
}

/* ── Performance Tab ── */
function PerformanceTab({ data }: { data: Examination.ReportsDashboard }) {
  const [filter, setFilter] = useState<'all' | 'cse' | 'ece'>('all');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const subjectData = data.subjectPassRates[filter];
  const colors = [
    '#3b82f6',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#f97316',
    '#10b981',
    '#ec4899',
    '#6366f1',
  ];

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: subjectData.map(s => s.subject),
        datasets: [
          {
            label: 'Pass Rate (%)',
            data: subjectData.map(s => s.passRate),
            backgroundColor: colors
              .slice(0, subjectData.length)
              .map(c => c + 'cc'),
            borderColor: colors.slice(0, subjectData.length),
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 100, ticks: { callback: v => `${v}%` } },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
    return () => chart.destroy();
  }, [data, filter]);

  const filters = [
    { key: 'all', label: 'All Programs' },
    { key: 'cse', label: 'CSE' },
    { key: 'ece', label: 'ECE' },
  ] as const;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <FormCard title="Subject-wise Pass Rate">
        <div className="h-80">
          <canvas ref={canvasRef} />
        </div>
      </FormCard>
    </div>
  );
}

/* ── Subjects Tab ── */
function SubjectsTab({ data }: { data: Examination.ReportsDashboard }) {
  return (
    <FormCard title="Subject Performance Details">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-medium">Subject</th>
              <th className="pb-3 font-medium">Code</th>
              <th className="pb-3 font-medium text-right">Enrollment</th>
              <th className="pb-3 font-medium text-right">Pass Rate</th>
              <th className="pb-3 font-medium text-right">Avg Score</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.subjectPassRates.all.map(s => (
              <tr
                key={s.code}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 font-medium text-gray-800">{s.subject}</td>
                <td className="py-3 text-gray-500">{s.code}</td>
                <td className="py-3 text-right">{s.enrollment}</td>
                <td className="py-3 text-right">
                  <span
                    className={`font-semibold ${s.passRate >= 85 ? 'text-green-600' : s.passRate >= 70 ? 'text-amber-600' : 'text-red-600'}`}
                  >
                    {s.passRate}%
                  </span>
                </td>
                <td className="py-3 text-right">{s.avgScore}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.passRate >= 85
                        ? 'bg-green-100 text-green-700'
                        : s.passRate >= 70
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {s.passRate >= 85
                      ? 'Excellent'
                      : s.passRate >= 70
                        ? 'Average'
                        : 'Needs Improvement'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FormCard>
  );
}

/* ── Enrollment Tab ── */
function EnrollmentTab({ data }: { data: Examination.ReportsDashboard }) {
  const enrollmentCanvasRef = useRef<HTMLCanvasElement>(null);
  const attendanceCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enrollmentCanvasRef.current) return;
    const ctx = enrollmentCanvasRef.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.enrollmentData.map(e => e.program),
        datasets: [
          {
            label: 'Students',
            data: data.enrollmentData.map(e => e.students),
            backgroundColor: 'rgba(59,130,246,0.7)',
            borderColor: '#3b82f6',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Passed',
            data: data.enrollmentData.map(e => e.passed),
            backgroundColor: 'rgba(34,197,94,0.7)',
            borderColor: '#22c55e',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 8, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  useEffect(() => {
    if (!attendanceCanvasRef.current) return;
    const ctx = attendanceCanvasRef.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.attendanceBreakdown.map(a => a.range),
        datasets: [
          {
            data: data.attendanceBreakdown.map(a => a.count),
            backgroundColor: data.attendanceBreakdown.map(a => a.color),
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
    return () => chart.destroy();
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormCard title="Program-wise Enrollment">
        <div className="h-80">
          <canvas ref={enrollmentCanvasRef} />
        </div>
      </FormCard>

      <FormCard title="Attendance Distribution">
        <div className="h-80">
          <canvas ref={attendanceCanvasRef} />
        </div>
      </FormCard>

      <FormCard title="Program Details" className="lg:col-span-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 font-medium">Program</th>
                <th className="pb-3 font-medium text-right">Students</th>
                <th className="pb-3 font-medium text-right">Appeared</th>
                <th className="pb-3 font-medium text-right">Passed</th>
                <th className="pb-3 font-medium text-right">Pass %</th>
                <th className="pb-3 font-medium text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {data.enrollmentData.map(e => (
                <tr
                  key={e.program}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 font-medium text-gray-800">
                    {e.program}
                  </td>
                  <td className="py-3 text-right">{e.students}</td>
                  <td className="py-3 text-right">{e.appeared}</td>
                  <td className="py-3 text-right">{e.passed}</td>
                  <td className="py-3 text-right font-semibold">
                    {((e.passed / e.appeared) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`font-medium ${e.change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {e.change >= 0 ? '+' : ''}
                      {e.change}%
                    </span>
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

/* ── Types ── */
