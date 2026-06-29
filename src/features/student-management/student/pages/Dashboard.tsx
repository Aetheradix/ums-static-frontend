import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';
import './Dashboard.css';

const studentStats = {
  cgpa: 8.4,
  attendance: 87,
  registeredCourses: 6,
  pendingFees: 0,
  creditsEarned: 110,
  creditsRequired: 160,
};

const recentNotifications = [
  {
    id: 1,
    title: 'Mid-Term Examination Schedule Released',
    date: '2024-10-14',
    type: 'info',
  },
  {
    id: 2,
    title: 'Last date for fee payment is upcoming',
    date: '2024-10-12',
    type: 'warning',
  },
  {
    id: 3,
    title: 'Library books due for return',
    date: '2024-10-10',
    type: 'alert',
  },
];

function SgpaTrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
        datasets: [
          {
            label: 'SGPA',
            data: [7.8, 8.1, 8.5, 8.3, 8.8],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#8b5cf6',
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

function AttendanceDoughnutChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent', 'On Leave'],
        datasets: [
          {
            data: [87, 10, 3],
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
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

function SubjectMarksBarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Data Structures',
          'OS',
          'Database',
          'Networking',
          'Mathematics',
        ],
        datasets: [
          {
            label: 'Marks Obtained',
            data: [85, 78, 92, 88, 74],
            backgroundColor: '#3b82f6',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 100 } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function SkillMatrixRadarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Technical',
          'Communication',
          'Teamwork',
          'Problem Solving',
          'Leadership',
        ],
        datasets: [
          {
            label: 'Self Assessment',
            data: [90, 75, 85, 88, 70],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            pointBackgroundColor: '#3b82f6',
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function ActivityCreditsLineChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
        datasets: [
          {
            label: 'Activity Points Earned',
            data: [15, 25, 45, 60, 85],
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

export default function Dashboard() {
  const creditsPct = Math.round(
    (studentStats.creditsEarned / studentStats.creditsRequired) * 100
  );

  return (
    <FormPage
      title="Student Dashboard"
      description="Overview of your academic progress, attendance, and recent updates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Management', to: studentManagementUrls.student.root },
        { label: 'Dashboard' },
      ]}
    >
      <div className="student-dashboard-stats-grid">
        <StatCard
          title="Current CGPA"
          value={studentStats.cgpa.toFixed(2)}
          icon="grade"
          colorScheme="indigo"
          subtitle="Top 15% of class"
        />
        <StatCard
          title="Attendance"
          value={`${studentStats.attendance}%`}
          icon="event_available"
          colorScheme="green"
          trend={{ value: 2, direction: 'up', label: 'from last month' }}
        />
        <StatCard
          title="Registered Courses"
          value={studentStats.registeredCourses}
          icon="menu_book"
          colorScheme="blue"
          subtitle="Current semester"
        />
        <StatCard
          title="Pending Fees"
          value={`₹${studentStats.pendingFees}`}
          icon="account_balance_wallet"
          colorScheme={studentStats.pendingFees > 0 ? 'orange' : 'teal'}
          subtitle={studentStats.pendingFees > 0 ? 'Due soon' : 'All clear'}
        />
      </div>

      <div className="dashboard-charts-grid">
        <FormCard title="SGPA Progression">
          <div className="chart-container">
            <SgpaTrendChart />
          </div>
        </FormCard>

        <FormCard title="Current Subject Marks">
          <div className="chart-container">
            <SubjectMarksBarChart />
          </div>
        </FormCard>

        <FormCard title="Attendance Breakdown">
          <div className="chart-container">
            <AttendanceDoughnutChart />
          </div>
        </FormCard>

        <FormCard title="Course Completion Status">
          <div className="course-progress-container">
            <div className="course-progress-header">
              <span className="course-progress-label">Credits Earned</span>
              <span className="course-progress-value">
                {studentStats.creditsEarned} / {studentStats.creditsRequired}
              </span>
            </div>
            <div className="course-progress-track">
              <div
                className="course-progress-fill"
                style={{ width: `${creditsPct}%` }}
              ></div>
            </div>
            <p className="course-progress-subtitle">
              {creditsPct}% of degree requirements completed
            </p>
          </div>
        </FormCard>

        <FormCard title="Skill Matrix">
          <div className="chart-container">
            <SkillMatrixRadarChart />
          </div>
        </FormCard>

        <FormCard title="Extracurricular Activity Points">
          <div className="chart-container">
            <ActivityCreditsLineChart />
          </div>
        </FormCard>
      </div>

      <div className="student-dashboard-content-split">
        <FormCard title="Upcoming Assignments & Tests" icon="assignment">
          <ul className="assignment-list">
            <li>
              <div className="assignment-date">Oct 16</div>
              <div className="assignment-content">
                <strong>Data Structures Project Sub.</strong>
                <p>Submit via LMS portal.</p>
                <span className="badge badge-warning">Due in 2 days</span>
              </div>
            </li>
            <li>
              <div className="assignment-date">Oct 20</div>
              <div className="assignment-content">
                <strong>OS Lab Evaluation</strong>
                <p>In-person viva.</p>
                <span className="badge badge-info">Next week</span>
              </div>
            </li>
          </ul>
        </FormCard>

        <FormCard title="Library Summary" icon="local_library">
          <div className="library-summary-container">
            <div className="library-stats">
              <div className="stat">
                <span className="value">3</span>
                <span className="label">Books Borrowed</span>
              </div>
              <div className="stat error">
                <span className="value">₹50</span>
                <span className="label">Pending Fine</span>
              </div>
            </div>
            <ul className="book-list">
              <li>
                <strong>Introduction to Algorithms</strong>
                <span className="due-date text-red-500">Overdue (Oct 10)</span>
              </li>
              <li>
                <strong>Operating System Concepts</strong>
                <span className="due-date">Due Oct 25</span>
              </li>
            </ul>
            <button className="pay-fine-btn">Pay Fine</button>
          </div>
        </FormCard>
      </div>

      <div className="student-dashboard-split-row mt-6">
        <FormCard title="Recent Notifications" className="notifications-card">
          <ul className="notifications-list">
            {recentNotifications.map(note => (
              <li
                key={note.id}
                className={`notification-item type-${note.type}`}
              >
                <div className="notification-icon">
                  <i
                    className={`pi ${note.type === 'info' ? 'pi-info-circle' : note.type === 'warning' ? 'pi-exclamation-triangle' : 'pi-bell'}`}
                  />
                </div>
                <div className="notification-content">
                  <p className="notification-title">{note.title}</p>
                  <p className="notification-date">{note.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </FormCard>

        <FormCard title="Quick Links" className="quick-links-card">
          <div className="quick-links-grid">
            <a
              href={studentManagementUrls.student.profile}
              className="quick-link-item"
            >
              <i className="pi pi-user text-indigo-500" />
              <span>My Profile</span>
            </a>
            <a
              href="/student-management/student/my-courses"
              className="quick-link-item"
            >
              <i className="pi pi-book text-blue-500" />
              <span>My Courses</span>
            </a>
            <a
              href="/student-management/student/my-grades"
              className="quick-link-item"
            >
              <i className="pi pi-star text-green-500" />
              <span>My Grades</span>
            </a>
            <a
              href="/student-management/student/subject-selection"
              className="quick-link-item"
            >
              <i className="pi pi-check-square text-orange-500" />
              <span>Subject Selection</span>
            </a>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
