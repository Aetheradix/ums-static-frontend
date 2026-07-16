import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormPage, FormCard, StatCard } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';
import './Dashboard.css';

const deptStats = {
  totalStudents: 1240,
  activeBatches: 12,
  pendingSections: 2,
  promotionsDue: 310,
  avgCgpa: 7.94,
  atRiskStudents: 38,
};

const topStudents = [
  { rank: 1, name: 'Ananya Sharma', batch: '2022-2026', cgpa: 9.85 },
  { rank: 2, name: 'Rahul Verma', batch: '2022-2026', cgpa: 9.78 },
  { rank: 3, name: 'Siddharth Iyer', batch: '2023-2027', cgpa: 9.72 },
];

const batchSummary = [
  {
    batch: '2021-2025 (Year 4)',
    students: 280,
    cgpa: 8.1,
    attendance: 82,
    status: 'Active',
  },
  {
    batch: '2022-2026 (Year 3)',
    students: 310,
    cgpa: 7.9,
    attendance: 85,
    status: 'Active',
  },
  {
    batch: '2023-2027 (Year 2)',
    students: 325,
    cgpa: 7.7,
    attendance: 88,
    status: 'Active',
  },
  {
    batch: '2024-2028 (Year 1)',
    students: 325,
    cgpa: null,
    attendance: 91,
    status: 'New',
  },
];

function SectionSizesChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sec A', 'Sec B', 'Sec C', 'Sec D'],
        datasets: [
          {
            label: 'Allocated Students',
            data: [60, 58, 62, 55],
            backgroundColor: '#6366f1',
            borderRadius: 6,
          },
          {
            label: 'Capacity',
            data: [65, 65, 65, 65],
            backgroundColor: '#e5e7eb',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true, max: 70 } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function SemStudentCountChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Sem 1',
          'Sem 2',
          'Sem 3',
          'Sem 4',
          'Sem 5',
          'Sem 6',
          'Sem 7',
          'Sem 8',
        ],
        datasets: [
          {
            label: 'Students',
            data: [165, 160, 168, 157, 155, 155, 142, 138],
            backgroundColor: '#3b82f6',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function CgpaDistributionChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['<5', '5-6', '6-7', '7-8', '8-9', '9-10'],
        datasets: [
          {
            label: 'Number of Students',
            data: [25, 45, 120, 410, 480, 160],
            backgroundColor: '#10b981',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function DeptAttendanceTrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [
          {
            label: 'Avg Attendance %',
            data: [92, 88, 85, 82],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#f59e0b',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 60, max: 100 } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function BacklogStatsChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4'],
        datasets: [
          {
            label: '0 Backlogs',
            data: [280, 260, 250, 265],
            backgroundColor: '#10b981',
          },
          {
            label: '1-2 Backlogs',
            data: [35, 45, 40, 12],
            backgroundColor: '#f59e0b',
          },
          {
            label: '3+ Backlogs',
            data: [10, 20, 20, 3],
            backgroundColor: '#ef4444',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { stacked: true }, y: { stacked: true } },
        plugins: { legend: { position: 'top' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function PassFailRateChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['CS301', 'CS302', 'CS303', 'CS304'],
        datasets: [
          {
            label: 'Pass %',
            data: [88, 76, 92, 85],
            backgroundColor: '#10b981',
            borderRadius: 4,
          },
          {
            label: 'Fail %',
            data: [12, 24, 8, 15],
            backgroundColor: '#ef4444',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { stacked: true, max: 100 }, x: { stacked: true } },
        plugins: { legend: { position: 'top' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function PromoEligibilityChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Eligible', 'Conditional', 'Detained'],
        datasets: [
          {
            data: [850, 60, 5],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

export default function DepartmentDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Department Dashboard"
      description="Manage students, batches, and academic progress across your department."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Department Portal',
          to: studentManagementUrls.department.root,
        },
        { label: 'Dashboard' },
      ]}
    >
      <div className="stats-grid-6 dept-dashboard-stats-grid mb-6">
        <StatCard
          title="Total Students"
          value={deptStats.totalStudents}
          icon="group"
          colorScheme="indigo"
        />
        <StatCard
          title="Active Batches"
          value={deptStats.activeBatches}
          icon="grid_view"
          colorScheme="blue"
        />
        <StatCard
          title="Pending Sections"
          value={deptStats.pendingSections}
          icon="list_alt"
          colorScheme="purple"
        />
        <StatCard
          title="Promotions Due"
          value={deptStats.promotionsDue}
          icon="arrow_upward"
          colorScheme="green"
        />
        <StatCard
          title="Avg Dept CGPA"
          value={deptStats.avgCgpa}
          icon="timeline"
          colorScheme="teal"
          trend={{ value: 0.1, direction: 'up', label: 'vs last sem' }}
        />
        <StatCard
          title="At-Risk Students"
          value={deptStats.atRiskStudents}
          icon="warning"
          colorScheme="orange"
          subtitle="< 75% attendance"
        />
      </div>

      <div className="dept-charts-grid">
        <FormCard title="Section Sizes (Current Sem)">
          <div className="chart-container">
            <SectionSizesChart />
          </div>
        </FormCard>

        <FormCard title="Semester-wise Student Count">
          <div className="chart-container">
            <SemStudentCountChart />
          </div>
        </FormCard>

        <FormCard title="CGPA Distribution">
          <div className="chart-container">
            <CgpaDistributionChart />
          </div>
        </FormCard>

        <FormCard title="Attendance Trend">
          <div className="chart-container">
            <DeptAttendanceTrendChart />
          </div>
        </FormCard>

        <FormCard title="Backlog Statistics">
          <div className="chart-container">
            <BacklogStatsChart />
          </div>
        </FormCard>

        <FormCard title="Subject Pass/Fail Rate">
          <div className="chart-container">
            <PassFailRateChart />
          </div>
        </FormCard>
      </div>

      <div className="dept-content-split mt-6">
        <FormCard title="Batch-wise Summary" className="h-full">
          <div className="overflow-x-auto pb-2">
            <table className="batch-summary-table w-full">
              <thead>
                <tr>
                  <th>Batch</th>
                  <th className="text-right">Students</th>
                  <th className="text-right">Avg CGPA</th>
                  <th className="text-right">Attendance</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {batchSummary.map((b, idx) => (
                  <tr key={idx}>
                    <td className="font-bold text-gray-800">{b.batch}</td>
                    <td className="text-right">{b.students}</td>
                    <td className="text-right font-medium text-indigo-600">
                      {b.cgpa ? b.cgpa : '-'}
                    </td>
                    <td className="text-right">{b.attendance}%</td>
                    <td className="text-center">
                      <span
                        className={`batch-status status-${b.status.toLowerCase()}`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title="Quick Actions" className="h-full">
          <div className="quick-actions-grid grid grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <button
              className="action-tile bg-gray-50 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
              onClick={() =>
                navigate(studentManagementUrls.department.subjectMapping)
              }
            >
              <i className="pi pi-sitemap text-2xl text-gray-400 mb-2"></i>
              <span className="font-semibold text-gray-700 text-sm">
                Subject Mapping
              </span>
            </button>
            <button
              className="action-tile bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              onClick={() => navigate(studentManagementUrls.admin.directory)}
            >
              <i className="pi pi-users text-2xl text-gray-400 mb-2"></i>
              <span className="font-semibold text-gray-700 text-sm">
                Directory
              </span>
            </button>
            <button
              className="action-tile bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
              onClick={() =>
                navigate(studentManagementUrls.department.batchAllocation)
              }
            >
              <i className="pi pi-clone text-2xl text-gray-400 mb-2"></i>
              <span className="font-semibold text-gray-700 text-sm">
                Batch Allocation
              </span>
            </button>
            <button
              className="action-tile bg-gray-50 border-gray-200 hover:border-green-300 hover:bg-green-50"
              onClick={() =>
                navigate(studentManagementUrls.department.promotion)
              }
            >
              <i className="pi pi-angle-double-up text-2xl text-gray-400 mb-2"></i>
              <span className="font-semibold text-gray-700 text-sm">
                Promotion
              </span>
            </button>
            <button
              className="action-tile bg-gray-50 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              onClick={() =>
                navigate(studentManagementUrls.department.sectionAllocation)
              }
            >
              <i className="pi pi-list text-2xl text-gray-400 mb-2"></i>
              <span className="font-semibold text-gray-700 text-sm">
                Section Alloc.
              </span>
            </button>
            <button
              className="action-tile bg-gray-50 border-gray-200 hover:border-red-300 hover:bg-red-50"
              onClick={() => navigate('/reports')}
            >
              <i className="pi pi-file-excel text-2xl text-gray-400 mb-2"></i>
              <span className="font-semibold text-gray-700 text-sm">
                Reports
              </span>
            </button>
          </div>
        </FormCard>
      </div>

      <div className="dept-content-split mt-6">
        <FormCard
          title="Top Performing Students (Dept)"
          icon="workspace_premium"
        >
          <div className="top-performers-list">
            {topStudents.map((st, idx) => (
              <div key={idx} className="performer-item">
                <span className={`rank-badge rank-${st.rank}`}>{st.rank}</span>
                <div className="performer-info">
                  <strong>{st.name}</strong>
                  <p>
                    {st.batch} &bull; CGPA:{' '}
                    <span className="font-bold text-indigo-600">{st.cgpa}</span>
                  </p>
                </div>
                <button className="text-gray-400 hover:text-indigo-600 p-2">
                  <i className="pi pi-chevron-right"></i>
                </button>
              </div>
            ))}
          </div>
        </FormCard>

        <FormCard title="Promotion Eligibility Forecast" icon="analytics">
          <div className="chart-container">
            <PromoEligibilityChart />
          </div>
          <div className="mt-4 text-sm text-center text-gray-600">
            Based on current semester internal marks and attendance.
          </div>
          <button
            onClick={() => navigate(studentManagementUrls.department.promotion)}
            className="w-full mt-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Review Promotions
          </button>
        </FormCard>
      </div>
    </FormPage>
  );
}
