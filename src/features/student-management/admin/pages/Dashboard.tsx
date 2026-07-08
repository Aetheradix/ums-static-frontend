import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';
import './Dashboard.css';

const adminStats = {
  totalActiveStudents: 15420,
  pendingAbcLinks: 320,
  averageInstituteCgpa: 7.8,
  totalPrograms: 42,
};

const recentAbcRequests = [
  {
    id: 'REQ-001',
    student: 'Amit Kumar',
    rollNo: '2024CS01',
    date: '2024-10-14',
  },
  {
    id: 'REQ-002',
    student: 'Priya Singh',
    rollNo: '2024EE12',
    date: '2024-10-13',
  },
  {
    id: 'REQ-003',
    student: 'Rahul Verma',
    rollNo: '2024ME05',
    date: '2024-10-12',
  },
];

function StudentsPerProgramChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['B.Tech', 'MBA', 'MCA', 'B.Sc', 'B.Com', 'M.Tech'],
        datasets: [
          {
            label: 'Enrolled Students',
            data: [5200, 2100, 1500, 3200, 2400, 1020],
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

function EnrollmentTrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'Total Enrollments',
            data: [11000, 11500, 12200, 13100, 14000, 15420],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
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

function AbcLinkingDoughnutChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Linked', 'Pending Request', 'Not Linked'],
        datasets: [
          {
            data: [12000, 320, 3100],
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

function GenderDistributionPieChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Male', 'Female', 'Other'],
        datasets: [
          {
            data: [8200, 7100, 120],
            backgroundColor: ['#3b82f6', '#ec4899', '#9ca3af'],
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

function DeptAttendanceBarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['CSE', 'ECE', 'ME', 'CE', 'MBA'],
        datasets: [
          {
            label: 'Avg Attendance %',
            data: [85, 82, 76, 78, 88],
            backgroundColor: '#10b981',
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { min: 0, max: 100 } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function AttendanceLevelsPolarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: ['> 90%', '75% - 90%', '< 75%'],
        datasets: [
          {
            data: [4200, 9500, 1720],
            backgroundColor: [
              'rgba(16, 185, 129, 0.6)',
              'rgba(59, 130, 246, 0.6)',
              'rgba(239, 68, 68, 0.6)',
            ],
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

function CategoryDistributionDoughnutChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['General', 'OBC', 'SC', 'ST', 'Other'],
        datasets: [
          {
            data: [6500, 4200, 2800, 1500, 420],
            backgroundColor: [
              '#6366f1',
              '#3b82f6',
              '#06b6d4',
              '#10b981',
              '#f59e0b',
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function FeeCollectionProgressBars() {
  const data = [
    { program: 'B.Tech', collected: 90, total: 100 },
    { program: 'MBA', collected: 75, total: 100 },
    { program: 'MCA', collected: 85, total: 100 },
    { program: 'B.Sc', collected: 60, total: 100 },
  ];

  return (
    <div className="flex flex-col gap-4">
      {data.map(item => {
        const percentage = Math.round((item.collected / item.total) * 100);
        return (
          <div key={item.program} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>{item.program}</span>
              <span>{percentage}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <FormPage
      title="Student Management Dashboard"
      description="Administrative overview of student enrollments, performance, and ABC linking."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Student Management',
          to: studentManagementUrls.student.root.replace('/student', ''),
        },
        { label: 'Admin Portal', to: studentManagementUrls.admin.root },
        { label: 'Dashboard' },
      ]}
    >
      <div className="student-admin-stats-grid">
        <StatCard
          title="Total Active Students"
          value={adminStats.totalActiveStudents}
          icon="groups"
          colorScheme="blue"
          trend={{ value: 10.1, direction: 'up', label: 'since last year' }}
        />
        <StatCard
          title="Pending ABC Links"
          value={adminStats.pendingAbcLinks}
          icon="link"
          colorScheme="orange"
          subtitle="Requires attention"
        />
        <StatCard
          title="Average CGPA"
          value={adminStats.averageInstituteCgpa}
          icon="insights"
          colorScheme="green"
          subtitle="Institute wide"
        />
        <StatCard
          title="Total Programs"
          value={adminStats.totalPrograms}
          icon="schema"
          colorScheme="purple"
          subtitle="Currently active"
        />
      </div>

      <div className="student-admin-charts-grid">
        <FormCard title="Enrollment Trend (Past 5 Years)">
          <div className="chart-container">
            <EnrollmentTrendChart />
          </div>
        </FormCard>

        <FormCard title="Students Per Program">
          <div className="chart-container">
            <StudentsPerProgramChart />
          </div>
        </FormCard>

        <FormCard title="ABC ID Linking Status">
          <div className="chart-container">
            <AbcLinkingDoughnutChart />
          </div>
        </FormCard>

        <FormCard title="Gender Distribution">
          <div className="chart-container">
            <GenderDistributionPieChart />
          </div>
        </FormCard>

        <FormCard title="Category Distribution">
          <div className="chart-container">
            <CategoryDistributionDoughnutChart />
          </div>
        </FormCard>

        <FormCard title="Fee Collection Progress">
          <div className="p-4">
            <FeeCollectionProgressBars />
          </div>
        </FormCard>
      </div>

      <div className="student-admin-charts-grid">
        <FormCard title="Recent ABC Requests">
          <table className="abc-requests-table">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Student</th>
                <th>Roll No</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentAbcRequests.map(req => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td className="font-medium text-gray-900">{req.student}</td>
                  <td className="text-gray-500">{req.rollNo}</td>
                  <td className="text-gray-500">{req.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <Link
              to={studentManagementUrls.admin.root}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all students &rarr;
            </Link>
          </div>
        </FormCard>

        <FormCard title="Dept. Average Attendance">
          <div className="chart-container">
            <DeptAttendanceBarChart />
          </div>
        </FormCard>

        <FormCard title="Attendance Levels">
          <div className="chart-container">
            <AttendanceLevelsPolarChart />
          </div>
        </FormCard>
      </div>

      <div className="student-admin-content-split">
        <FormCard title="System Alerts" icon="warning">
          <ul className="system-alerts-list">
            <li className="alert-item critical">
              <span
                className="material-symbols-rounded"
                style={{
                  color: '#ef4444',
                  fontSize: '1.25rem',
                  marginTop: '0.125rem',
                }}
              >
                block
              </span>
              <div className="alert-details">
                <strong>Attendance Shortage</strong>
                <p>
                  1,720 students have &lt; 75% attendance and may face exam
                  debarment.
                </p>
              </div>
            </li>
            <li className="alert-item warning">
              <span
                className="material-symbols-rounded"
                style={{
                  color: '#f59e0b',
                  fontSize: '1.25rem',
                  marginTop: '0.125rem',
                }}
              >
                warning
              </span>
              <div className="alert-details">
                <strong>ABC Linking Pending</strong>
                <p>320 linking requests require admin approval.</p>
              </div>
            </li>
          </ul>
        </FormCard>

        <FormCard title="Institute Top Performers" icon="emoji_events">
          <div className="top-performers-list">
            <div className="performer-item">
              <span className="rank-badge rank-1">1</span>
              <div className="performer-info">
                <strong>Rohan Gupta</strong>
                <p>B.Tech CS &bull; CGPA: 9.92</p>
              </div>
            </div>
            <div className="performer-item">
              <span className="rank-badge rank-2">2</span>
              <div className="performer-info">
                <strong>Sneha Sharma</strong>
                <p>B.Sc Physics &bull; CGPA: 9.85</p>
              </div>
            </div>
            <div className="performer-item">
              <span className="rank-badge rank-3">3</span>
              <div className="performer-info">
                <strong>Vikas Patel</strong>
                <p>MBA Finance &bull; CGPA: 9.78</p>
              </div>
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
