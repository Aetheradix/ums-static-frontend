import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';
import './Dashboard.css';

const applicationStats = {
  total: 4521,
  pendingReview: 843,
  approved: 3100,
  rejected: 578,
  enrollmentTarget: 5000,
  enrolled: 2850,
};

const recentApplications = [
  {
    id: 'APP-2024-101',
    name: 'John Doe',
    programme: 'B.Tech CS',
    status: 'Pending Review',
    date: '2024-10-12',
  },
  {
    id: 'APP-2024-102',
    name: 'Alice Smith',
    programme: 'MBA',
    status: 'Approved',
    date: '2024-10-11',
  },
  {
    id: 'APP-2024-103',
    name: 'Bob Johnson',
    programme: 'BCA',
    status: 'Fee Pending',
    date: '2024-10-11',
  },
  {
    id: 'APP-2024-104',
    name: 'Sarah Lee',
    programme: 'M.Tech AI',
    status: 'Rejected',
    date: '2024-10-10',
  },
  {
    id: 'APP-2024-105',
    name: 'Michael Brown',
    programme: 'B.Sc Physics',
    status: 'Enrolled',
    date: '2024-10-09',
  },
];

function TrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'Applications Received',
            data: [300, 500, 800, 1200, 950, 771],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#3b82f6',
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

function StatusDoughnutChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'Pending Review', 'Rejected', 'Fee Pending'],
        datasets: [
          {
            data: [3100, 843, 578, 200],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
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

function ProgrammeBarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['B.Tech CS', 'MBA', 'BCA', 'B.Sc', 'MCA'],
        datasets: [
          {
            label: 'Applications',
            data: [1200, 850, 920, 410, 600],
            backgroundColor: '#6366f1',
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

function RegionPolarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: ['North', 'South', 'East', 'West', 'Central'],
        datasets: [
          {
            data: [1500, 900, 600, 1100, 421],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 205, 86, 0.6)',
              'rgba(201, 203, 207, 0.6)',
              'rgba(54, 162, 235, 0.6)',
            ],
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

function DemographicsRadarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Academics',
          'Work Exp.',
          'Test Scores',
          'Extracurricular',
          'Interview',
        ],
        datasets: [
          {
            label: 'Average Applicant Score',
            data: [85, 45, 78, 60, 72],
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

export default function Dashboard() {
  const enrollmentPct = Math.round(
    (applicationStats.enrolled / applicationStats.enrollmentTarget) * 100
  );

  return (
    <FormPage
      title="Admissions Management Dashboard"
      description="Overview of admission applications, approvals, and fee collections."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Admin Portal', to: admissionsUrls.admin.root },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dashboard-stats-grid">
        <StatCard
          title="Total Applications"
          value={applicationStats.total}
          icon="assignment"
          colorScheme="blue"
          trend={{ value: 12, direction: 'up', label: 'vs last year' }}
        />
        <StatCard
          title="Pending Review"
          value={applicationStats.pendingReview}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Action required"
        />
        <StatCard
          title="Approved"
          value={applicationStats.approved}
          icon="check_circle"
          colorScheme="green"
          subtitle="Ready for enrollment"
        />
        <StatCard
          title="Rejected"
          value={applicationStats.rejected}
          icon="cancel"
          colorScheme="red"
          subtitle="Criteria not met"
        />
      </div>

      <div className="dashboard-charts-grid">
        <FormCard title="Application Trends (Last 6 Months)">
          <div className="chart-container">
            <TrendChart />
          </div>
        </FormCard>

        <FormCard title="Applications by Programme">
          <div className="chart-container">
            <ProgrammeBarChart />
          </div>
        </FormCard>

        <FormCard title="Application Status Breakdown">
          <div className="chart-container">
            <StatusDoughnutChart />
          </div>
        </FormCard>

        <FormCard title="Enrollment Target Progress">
          <div className="enrollment-progress-container">
            <div className="enrollment-progress-header">
              <span className="enrollment-progress-label">Total Enrolled</span>
              <span className="enrollment-progress-value">
                {applicationStats.enrolled} /{' '}
                {applicationStats.enrollmentTarget}
              </span>
            </div>
            <div className="enrollment-progress-track">
              <div
                className="enrollment-progress-fill"
                style={{ width: `${enrollmentPct}%` }}
              ></div>
            </div>
            <p className="enrollment-progress-subtitle">
              {enrollmentPct}% of target reached
            </p>
          </div>
        </FormCard>

        <FormCard title="Applications by Region">
          <div className="chart-container">
            <RegionPolarChart />
          </div>
        </FormCard>

        <FormCard title="Applicant Demographics Score">
          <div className="chart-container">
            <DemographicsRadarChart />
          </div>
        </FormCard>
      </div>

      <div className="dashboard-content-split">
        <FormCard title="Upcoming Deadlines & Events">
          <ul className="timeline-list">
            <li>
              <div className="timeline-date">Oct 15</div>
              <div className="timeline-content">
                <strong>Phase 1 Registration Closes</strong>
                <p>Last day to submit applications for engineering programs.</p>
              </div>
            </li>
            <li>
              <div className="timeline-date">Oct 18</div>
              <div className="timeline-content">
                <strong>Entrance Exam (Online)</strong>
                <p>All BCA and B.Sc applicants must appear.</p>
              </div>
            </li>
            <li>
              <div className="timeline-date">Oct 25</div>
              <div className="timeline-content">
                <strong>First Merit List</strong>
                <p>Publication of the first merit list for B.Tech CS.</p>
              </div>
            </li>
          </ul>
        </FormCard>

        <FormCard title="Top Performing Programs">
          <div className="leaderboard-list">
            <div className="leaderboard-item">
              <span className="rank">1</span>
              <div className="program-details">
                <strong>B.Tech Computer Science</strong>
                <p>1200 Applications (↑ 15%)</p>
              </div>
            </div>
            <div className="leaderboard-item">
              <span className="rank">2</span>
              <div className="program-details">
                <strong>MBA Finance & Marketing</strong>
                <p>850 Applications (↑ 8%)</p>
              </div>
            </div>
            <div className="leaderboard-item">
              <span className="rank">3</span>
              <div className="program-details">
                <strong>BCA</strong>
                <p>920 Applications (↑ 5%)</p>
              </div>
            </div>
          </div>
        </FormCard>
      </div>

      <div className="dashboard-full-row">
        <FormCard title="Recent Applications">
          <table className="recent-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Applicant Name</th>
                <th>Programme</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map(app => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.name}</td>
                  <td>{app.programme}</td>
                  <td>{app.date}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        app.status === 'Approved' || app.status === 'Enrolled'
                          ? 'status-pill-green'
                          : app.status === 'Rejected'
                            ? 'status-pill-red'
                            : app.status === 'Pending Review'
                              ? 'status-pill-orange'
                              : 'status-pill-blue'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>
      </div>
    </FormPage>
  );
}
