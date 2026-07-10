import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { studentLifecycleUrls } from '../../urls';
import './Dashboard.css';

const studentStats = {
  cgpa: 8.4,
  attendance: 87,
  registeredCourses: 6,
  pendingFees: 0,
  creditsEarned: 110,
  creditsRequired: 160,
  classRank: 12,
  totalStudents: 180,
  activeBacklogs: 0,
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
          {
            label: 'Target CGPA Baseline',
            data: [8.5, 8.5, 8.5, 8.5, 8.5],
            borderColor: '#f59e0b',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 10 } },
        plugins: { legend: { position: 'top' } },
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
          {
            label: 'Class Average',
            data: [72, 70, 75, 76, 68],
            backgroundColor: '#9ca3af',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 100 } },
        plugins: { legend: { position: 'top' } },
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

function SubjectWiseAttendanceChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['DS', 'OS', 'DB', 'NW', 'Math'],
        datasets: [
          {
            label: 'Attendance %',
            data: [92, 72, 95, 88, 81],
            backgroundColor: context => {
              const val = context.dataset.data[context.dataIndex] as number;
              return val < 75 ? '#ef4444' : '#10b981';
            },
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { min: 0, max: 100 } },
        plugins: {
          legend: { display: false },
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                xMin: 75,
                xMax: 75,
                borderColor: '#ef4444',
                borderWidth: 2,
                borderDash: [4, 4],
                label: {
                  display: true,
                  content: '75% Threshold',
                  position: 'start',
                },
              },
            },
          },
        },
      } as any, // annotation plugin types might be missing, cast to any
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
          {
            label: 'Class Average',
            data: [75, 78, 80, 75, 72],
            backgroundColor: 'rgba(156, 163, 175, 0.2)',
            borderColor: '#9ca3af',
            pointBackgroundColor: '#9ca3af',
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
        { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
        { label: 'Dashboard' },
      ]}
    >
      <div className="stats-grid-6 student-dashboard-stats-grid mb-6">
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
          subtitle="Warning: OS < 75%"
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
        <StatCard
          title="Class Rank"
          value={`${studentStats.classRank} / ${studentStats.totalStudents}`}
          icon="military_tech"
          colorScheme="purple"
          trend={{ value: 3, direction: 'up', label: 'positions up' }}
        />
        <StatCard
          title="Active Backlogs"
          value={studentStats.activeBacklogs}
          icon="assignment_late"
          colorScheme={studentStats.activeBacklogs > 0 ? 'red' : 'green'}
          subtitle={
            studentStats.activeBacklogs > 0 ? 'Action required' : 'All clear'
          }
        />
      </div>

      <div className="dashboard-charts-grid">
        <FormCard title="SGPA Progression">
          <div className="chart-container">
            <SgpaTrendChart />
          </div>
        </FormCard>

        <FormCard title="Subject Marks Comparison">
          <div className="chart-container">
            <SubjectMarksBarChart />
          </div>
        </FormCard>

        <FormCard title="Overall Attendance">
          <div className="chart-container">
            <AttendanceDoughnutChart />
          </div>
        </FormCard>

        <FormCard title="Subject-wise Attendance">
          <div className="chart-container">
            <SubjectWiseAttendanceChart />
          </div>
        </FormCard>

        <FormCard title="Course Completion Status">
          <div className="course-progress-container h-full flex flex-col justify-center">
            <div className="course-progress-header">
              <span className="course-progress-label">Credits Earned</span>
              <span className="course-progress-value">
                {studentStats.creditsEarned} / {studentStats.creditsRequired}
              </span>
            </div>

            <div className="credit-milestones mb-2 flex justify-between text-xs text-gray-400 font-medium px-1">
              <span>0</span>
              <span>40</span>
              <span>80</span>
              <span>120</span>
              <span>160</span>
            </div>
            <div className="course-progress-track relative h-4">
              <div
                className="course-progress-fill absolute left-0 top-0 h-full rounded-full"
                style={{ width: `${creditsPct}%`, zIndex: 1 }}
              ></div>
              <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/50 z-10"></div>
              <div className="absolute left-2/4 top-0 bottom-0 w-px bg-white/50 z-10"></div>
              <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white/50 z-10"></div>
            </div>
            <p className="course-progress-subtitle font-medium">
              {creditsPct}% of degree requirements completed
            </p>
          </div>
        </FormCard>

        <FormCard title="Skill Matrix Profile">
          <div className="chart-container">
            <SkillMatrixRadarChart />
          </div>
        </FormCard>
      </div>

      <div className="student-dashboard-content-split">
        <FormCard title="Upcoming Assignments & Tests">
          <ul className="assignment-list">
            <li>
              <div className="assignment-date">Oct 16</div>
              <div className="assignment-content">
                <strong>Data Structures Project Sub.</strong>
                <p>Submit via LMS portal.</p>
                <span className="badge badge-warning">Due in 2 days</span>
                <span className="badge badge-outline ml-2">Assignment</span>
              </div>
            </li>
            <li>
              <div className="assignment-date">Oct 20</div>
              <div className="assignment-content">
                <strong>OS Lab Evaluation</strong>
                <p>In-person viva.</p>
                <span className="badge badge-info">Next week</span>
                <span className="badge badge-outline ml-2">Internal Exam</span>
              </div>
            </li>
            <li>
              <div className="assignment-date">Nov 15</div>
              <div className="assignment-content">
                <strong>End Semester Exams Begin</strong>
                <p>Check timetable for details.</p>
                <span className="badge badge-alert">Important</span>
                <span className="badge badge-outline ml-2">External Exam</span>
              </div>
            </li>
          </ul>
        </FormCard>

        <FormCard title="Library Summary">
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
                <div className="flex items-center gap-2">
                  <span className="due-date text-red-500 font-medium">
                    Overdue (Oct 10)
                  </span>
                  <span className="badge badge-warning text-xs">₹50 Fine</span>
                </div>
              </li>
              <li>
                <strong>Operating System Concepts</strong>
                <span className="due-date bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  Due Oct 25
                </span>
              </li>
              <li>
                <strong>Database Management Systems</strong>
                <span className="due-date bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  Due Oct 28
                </span>
              </li>
            </ul>
            <button className="pay-fine-btn w-full mt-2 py-2">
              Pay Fine Online
            </button>
          </div>
        </FormCard>
      </div>

      <div className="student-dashboard-split-row mt-6">
        <FormCard title="Recent Notifications" className="notifications-card">
          <div className="flex justify-end mb-4">
            <button className="text-sm text-indigo-600 font-medium hover:underline">
              Mark all read
            </button>
          </div>
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
              href={studentLifecycleUrls.student.profile}
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
            <a
              href="/student-management/student/exam-schedule"
              className="quick-link-item"
            >
              <i className="pi pi-calendar text-purple-500" />
              <span>Exam Schedule</span>
            </a>
            <a
              href="/student-management/student/fee-payment"
              className="quick-link-item"
            >
              <i className="pi pi-wallet text-teal-500" />
              <span>Fee Payment</span>
            </a>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
