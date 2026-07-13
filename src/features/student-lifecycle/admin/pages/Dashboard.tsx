import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { studentLifecycleUrls } from '../../urls';
import './Dashboard.css';

const adminStats = {
  totalActiveStudents: 15420,
  pendingAbcLinks: 320,
  averageInstituteCgpa: 7.8,
  totalPrograms: 42,
  totalFaculty: 342,
  feeCollectionRate: 82,
};

const recentAbcRequests = [
  {
    id: 'REQ-001',
    student: 'Amit Kumar',
    rollNo: '2024CS01',
    date: '2024-10-14',
    status: 'Pending',
  },
  {
    id: 'REQ-002',
    student: 'Priya Singh',
    rollNo: '2024EE12',
    date: '2024-10-13',
    status: 'Pending',
  },
  {
    id: 'REQ-003',
    student: 'Rahul Verma',
    rollNo: '2024ME05',
    date: '2024-10-12',
    status: 'Pending',
  },
];

const deptSummary = [
  { dept: 'CSE', students: 5200, cgpa: 7.9, attendance: 85, backlogs: 420 },
  { dept: 'ECE', students: 3100, cgpa: 7.6, attendance: 82, backlogs: 380 },
  { dept: 'ME', students: 2800, cgpa: 7.4, attendance: 76, backlogs: 510 },
  { dept: 'CE', students: 2100, cgpa: 7.5, attendance: 78, backlogs: 450 },
  { dept: 'MBA', students: 2220, cgpa: 8.1, attendance: 88, backlogs: 120 },
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
        indexAxis: 'y',
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
          {
            label: 'New Admissions',
            data: [2500, 2800, 3100, 3200, 3500, 4100],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
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
        labels: ['Male', 'Female', 'Other', 'NonBinary'],
        datasets: [
          {
            data: [8200, 7100, 120, 50],
            backgroundColor: ['#3b82f6', '#ec4899', '#9ca3af', '#8b5cf6'],
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

function CategoryDistributionDoughnutChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['General', 'OBC', 'SC', 'ST'],
        datasets: [
          {
            data: [6500, 4200, 2800, 1500],
            backgroundColor: ['#6366f1', '#3b82f6', '#06b6d4', '#10b981'],
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

function SubcategoryDistributionDoughnutChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['PH (Divyang)', 'JKM (Migrants)', 'EMP Ward', 'NRI', 'EWS'],
        datasets: [
          {
            data: [85, 42, 120, 95, 850],
            backgroundColor: [
              '#f59e0b',
              '#10b981',
              '#3b82f6',
              '#ec4899',
              '#8b5cf6',
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

function FeeCollectionChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['B.Tech', 'MBA', 'MCA', 'B.Sc'],
        datasets: [
          {
            label: 'Collected (%)',
            data: [90, 75, 85, 60],
            backgroundColor: '#10b981',
            borderRadius: 4,
          },
          {
            label: 'Pending (%)',
            data: [10, 25, 15, 40],
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

function DeptCgpaChart() {
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
            label: 'Average CGPA',
            data: [7.9, 7.6, 7.4, 7.5, 8.1],
            backgroundColor: '#8b5cf6',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 10 } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function AtRiskDeptChart() {
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
            label: '< 75% Attendance',
            data: [420, 350, 510, 410, 120],
            backgroundColor: '#f59e0b',
          },
          {
            label: 'CGPA < 5',
            data: [180, 210, 320, 280, 50],
            backgroundColor: '#ef4444',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { stacked: true }, x: { stacked: true } },
        plugins: { legend: { position: 'top' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

export default function AdminDashboard() {
  return (
    <FormPage
      title="Student Lifecycle Dashboard"
      description="Administrative overview of student enrollments, performance, and ABC linking."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Student Lifecycle',
          to: studentLifecycleUrls.student.root.replace('/student', ''),
        },
        { label: 'Admin Portal', to: studentLifecycleUrls.admin.root },
        { label: 'Dashboard' },
      ]}
    >
      <div className="stats-grid-5 student-admin-stats-grid">
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
          title="Total Programs"
          value={adminStats.totalPrograms}
          icon="schema"
          colorScheme="purple"
          subtitle="Currently active"
        />
        <StatCard
          title="Total Faculty"
          value={adminStats.totalFaculty}
          icon="school"
          colorScheme="indigo"
          subtitle="Active staff"
        />
        <StatCard
          title="Fee Collection Rate"
          value={`${adminStats.feeCollectionRate}%`}
          icon="account_balance"
          colorScheme="teal"
          trend={{ value: 5, direction: 'up', label: 'vs last sem' }}
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

        <FormCard title="Gender Wise Students">
          <div className="chart-container">
            <GenderDistributionPieChart />
          </div>
        </FormCard>

        <FormCard title="Category wise Distribution">
          <div className="chart-container">
            <CategoryDistributionDoughnutChart />
          </div>
        </FormCard>

        <FormCard title="Sub-category wise Distribution">
          <div className="chart-container">
            <SubcategoryDistributionDoughnutChart />
          </div>
        </FormCard>

        <FormCard title="Program Wise Fee Collection Progress">
          <div className="chart-container">
            <FeeCollectionChart />
          </div>
        </FormCard>

        <FormCard title="Department Average CGPA">
          <div className="chart-container">
            <DeptCgpaChart />
          </div>
        </FormCard>

        <FormCard title="At-Risk Students by Department">
          <div className="chart-container">
            <AtRiskDeptChart />
          </div>
        </FormCard>
      </div>

      {/* Scholarship & Hackathon Summary Section */}
      {/* <div className="student-admin-content-split mt-6">
        <FormCard title="Scholarship Disbursal Summary" icon="wallet">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs md:text-sm">
              <div>
                <span className="text-slate-400 block font-medium">
                  Awarded Students
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                  1,420
                </span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
                <span className="text-slate-400 block font-medium">
                  Total Disbursed
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                  ₹3.84 Cr
                </span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
                <span className="text-slate-400 block font-medium">
                  Pending Review
                </span>
                <span className="font-bold text-amber-500 text-lg">145</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="dept-summary-table w-full text-xs">
                <thead>
                  <tr>
                    <th>Scholarship Scheme</th>
                    <th className="text-right">Awardees</th>
                    <th className="text-right">Disbursed Amt</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold text-slate-800 dark:text-slate-200">
                      DAVV Merit Scholarship
                    </td>
                    <td className="text-right">320</td>
                    <td className="text-right font-medium text-emerald-600">
                      ₹89.60 L
                    </td>
                    <td className="text-center">
                      <span className="badge badge-success bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        Released
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-slate-800 dark:text-slate-200">
                      MP Post-Matric Scholarship (SC/ST/OBC)
                    </td>
                    <td className="text-right">840</td>
                    <td className="text-right font-medium text-emerald-600">
                      ₹2.35 Cr
                    </td>
                    <td className="text-center">
                      <span className="badge badge-success bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        Released
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-slate-800 dark:text-slate-200">
                      NSP Merit-cum-Means
                    </td>
                    <td className="text-right">260</td>
                    <td className="text-right font-medium text-emerald-600">
                      ₹59.80 L
                    </td>
                    <td className="text-center">
                      <span className="badge bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                        145 Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
              <a
                href="#"
                onClick={e => e.preventDefault()}
                className="text-xs md:text-sm font-medium text-blue-600 hover:text-blue-500 inline-flex items-center gap-1"
              >
                View Scholarship Dashboard &rarr;
              </a>
            </div>
          </div>
        </FormCard>

        <FormCard title="Hackathon & Co-curricular Analytics" icon="star">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs md:text-sm">
              <div>
                <span className="text-slate-400 block font-medium">
                  Total Events
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                  12
                </span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
                <span className="text-slate-400 block font-medium">
                  Participations
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                  450
                </span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
                <span className="text-slate-400 block font-medium">
                  Podium Wins
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                  38 Teams
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/60 text-xs">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Smart India Hackathon 2025
                    </span>
                    <span className="text-[10px] text-slate-400">
                      · National
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    42 teams participated. <strong>3 Winners</strong> (Grand
                    Prize: ₹3.0L)
                  </p>
                </div>
                <span className="badge bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                  3 Winner Badges
                </span>
              </div>

              <div className="flex justify-between items-start p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/60 text-xs">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      DevFest Indore 2025
                    </span>
                    <span className="text-[10px] text-slate-400">· Zonal</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    18 teams participated.{' '}
                    <strong>1 Winner, 2 Finalists</strong>
                  </p>
                </div>
                <span className="badge bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  1 Winner, 2 Finalists
                </span>
              </div>

              <div className="flex justify-between items-start p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/60 text-xs">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      National AI Hackathon 2026
                    </span>
                    <span className="text-[10px] text-slate-400">
                      · National
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    15 teams participated. <strong>1 Winner</strong> (Prize:
                    ₹1.5L)
                  </p>
                </div>
                <span className="badge bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                  1 Winner Badge
                </span>
              </div>
            </div>
          </div>
        </FormCard>
      </div> */}

      <div className="student-admin-content-split">
        <FormCard title="Department Summary" className="h-full">
          <div className="overflow-x-auto pb-2">
            <table className="dept-summary-table w-full">
              <thead>
                <tr>
                  <th>Department</th>
                  <th className="text-right">Students</th>
                  <th className="text-right">Avg CGPA</th>
                  <th className="text-right">Avg Att.</th>
                  <th className="text-right">Backlogs</th>
                </tr>
              </thead>
              <tbody>
                {deptSummary.map((dept, idx) => (
                  <tr key={idx}>
                    <td className="font-bold text-gray-800">{dept.dept}</td>
                    <td className="text-right">{dept.students}</td>
                    <td className="text-right font-medium text-indigo-600">
                      {dept.cgpa}
                    </td>
                    <td className="text-right">{dept.attendance}%</td>
                    <td className="text-right text-red-500">{dept.backlogs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title="Quick Admin Actions" className="h-full">
          <div className="quick-actions-grid h-full flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <button className="action-tile bg-blue-50 text-blue-700 border-blue-200">
                <i className="pi pi-check-circle text-2xl mb-2"></i>
                <span className="font-semibold">ABC Approvals</span>
              </button>
              <button className="action-tile bg-green-50 text-green-700 border-green-200">
                <i className="pi pi-user-plus text-2xl mb-2"></i>
                <span className="font-semibold">New Enrollment</span>
              </button>
              <button className="action-tile bg-purple-50 text-purple-700 border-purple-200">
                <i className="pi pi-cloud-upload text-2xl mb-2"></i>
                <span className="font-semibold">Grade Upload</span>
              </button>
              <button className="action-tile bg-orange-50 text-orange-700 border-orange-200">
                <i className="pi pi-file-export text-2xl mb-2"></i>
                <span className="font-semibold">Report Export</span>
              </button>
            </div>
          </div>
        </FormCard>
      </div>

      <div className="student-admin-content-split mt-6">
        <FormCard title="Recent ABC Requests">
          <table className="abc-requests-table">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Student</th>
                <th>Roll No</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentAbcRequests.map(req => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td className="font-medium text-gray-900">{req.student}</td>
                  <td className="text-gray-500">{req.rollNo}</td>
                  <td className="text-gray-500">{req.date}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <i className="pi pi-check"></i>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Reject"
                      >
                        <i className="pi pi-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <Link
              to={studentLifecycleUrls.admin.root}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all requests &rarr;
            </Link>
          </div>
        </FormCard>

        <FormCard title="System Alerts">
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
                <div className="flex justify-between items-start">
                  <strong>Attendance Shortage</strong>
                  <span className="text-xs text-red-500 font-medium">
                    Just now
                  </span>
                </div>
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
                <div className="flex justify-between items-start">
                  <strong>ABC Linking Pending</strong>
                  <span className="text-xs text-orange-500 font-medium">
                    2 hours ago
                  </span>
                </div>
                <p>320 linking requests require admin approval.</p>
              </div>
            </li>
            <li className="alert-item info">
              <i className="pi pi-info-circle text-blue-500 text-xl mt-0.5" />
              <div className="alert-details">
                <div className="flex justify-between items-start">
                  <strong>Server Maintenance</strong>
                  <span className="text-xs text-blue-500 font-medium">
                    1 day ago
                  </span>
                </div>
                <p>
                  LMS portal will be down for maintenance this Sunday from 2 AM
                  - 4 AM.
                </p>
              </div>
            </li>
          </ul>
        </FormCard>
      </div>

      <div className="student-admin-content-split mt-6">
        <FormCard title="Institute Top Performers">
          <div className="top-performers-filters mb-4 flex gap-2">
            <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
              All
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-200">
              B.Tech
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-200">
              MBA
            </button>
          </div>
          <div className="top-performers-list">
            <div className="performer-item">
              <span className="rank-badge rank-1">1</span>
              <div className="performer-avatar bg-indigo-100 text-indigo-600">
                RG
              </div>
              <div className="performer-info">
                <strong>Rohan Gupta</strong>
                <p>B.Tech CS &bull; CGPA: 9.92</p>
              </div>
            </div>
            <div className="performer-item">
              <span className="rank-badge rank-2">2</span>
              <div className="performer-avatar bg-pink-100 text-pink-600">
                SS
              </div>
              <div className="performer-info">
                <strong>Sneha Sharma</strong>
                <p>B.Sc Physics &bull; CGPA: 9.85</p>
              </div>
            </div>
            <div className="performer-item">
              <span className="rank-badge rank-3">3</span>
              <div className="performer-avatar bg-blue-100 text-blue-600">
                VP
              </div>
              <div className="performer-info">
                <strong>Vikas Patel</strong>
                <p>MBA Finance &bull; CGPA: 9.78</p>
              </div>
            </div>
            <div className="performer-item">
              <span className="rank-badge rank-other">4</span>
              <div className="performer-avatar bg-green-100 text-green-600">
                AK
              </div>
              <div className="performer-info">
                <strong>Aditi Kumar</strong>
                <p>MCA &bull; CGPA: 9.75</p>
              </div>
            </div>
            <div className="performer-item">
              <span className="rank-badge rank-other">5</span>
              <div className="performer-avatar bg-orange-100 text-orange-600">
                MR
              </div>
              <div className="performer-info">
                <strong>Mohd. Raza</strong>
                <p>B.Tech ME &bull; CGPA: 9.71</p>
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard title="Academic Calendar">
          <div className="academic-calendar">
            <div className="calendar-month-header flex justify-between items-center mb-4 pb-2 border-b">
              <button className="text-gray-400 hover:text-indigo-600">
                <i className="pi pi-chevron-left"></i>
              </button>
              <h3 className="font-bold text-gray-800">October 2024</h3>
              <button className="text-gray-400 hover:text-indigo-600">
                <i className="pi pi-chevron-right"></i>
              </button>
            </div>

            <ul className="calendar-events-list flex flex-col gap-3">
              <li className="flex gap-4 items-start p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-xs font-bold text-blue-600 uppercase">
                    Oct
                  </span>
                  <span className="text-xl font-black text-gray-800">14</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    Mid-Term Exams Begin
                  </h4>
                  <p className="text-xs text-gray-500">All UG & PG Programs</p>
                </div>
              </li>

              <li className="flex gap-4 items-start p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-xs font-bold text-red-600 uppercase">
                    Oct
                  </span>
                  <span className="text-xl font-black text-gray-800">22</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    Fee Payment Deadline
                  </h4>
                  <p className="text-xs text-gray-500">
                    Late fee applies after this date
                  </p>
                </div>
              </li>

              <li className="flex gap-4 items-start p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-xs font-bold text-green-600 uppercase">
                    Nov
                  </span>
                  <span className="text-xl font-black text-gray-800">01</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    Diwali Break Starts
                  </h4>
                  <p className="text-xs text-gray-500">
                    Institute closed for 5 days
                  </p>
                </div>
              </li>
            </ul>

            <button className="w-full mt-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              View Full Calendar
            </button>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
