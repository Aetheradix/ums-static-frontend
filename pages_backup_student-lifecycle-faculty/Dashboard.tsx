import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormPage, FormCard, StatCard } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';
import './Dashboard.css';

const facultyStats = {
  myStudents: 120,
  assessmentsDue: 3,
  atRiskStudents: 5,
  avgClassScore: 72.4,
  classesThisWeek: 12,
  completedClasses: 10,
};

function ClassAttendanceChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [
          {
            label: 'CS301 (Sec A)',
            data: [92, 88, 85, 87, 84],
            backgroundColor: '#6366f1',
            borderRadius: 4,
          },
          {
            label: 'CS302 (Sec B)',
            data: [85, 82, 79, 81, 76],
            backgroundColor: '#f97316',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 50, max: 100 } },
        plugins: { legend: { position: 'top' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function ScoreDistributionChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['0-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
        datasets: [
          {
            label: 'Number of Students (Mid-Term 1)',
            data: [2, 5, 15, 35, 42, 18, 3],
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

function MarksRadarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Unit 1 (Intro)',
          'Unit 2 (Trees)',
          'Unit 3 (Graphs)',
          'Unit 4 (Sort)',
          'Unit 5 (DP)',
        ],
        datasets: [
          {
            label: 'Class Avg (CS301)',
            data: [85, 78, 65, 82, 70],
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: '#6366f1',
            pointBackgroundColor: '#6366f1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { min: 0, max: 100 } },
        plugins: { legend: { position: 'bottom' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function SyllabusCoverageChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['CS301 (Sec A)', 'CS302 (Sec B)'],
        datasets: [
          {
            label: 'Covered (%)',
            data: [75, 40],
            backgroundColor: '#3b82f6',
            borderRadius: 4,
          },
          {
            label: 'Remaining (%)',
            data: [25, 60],
            backgroundColor: '#e5e7eb',
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { stacked: true, max: 100 }, y: { stacked: true } },
        plugins: { legend: { position: 'top' } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function StudentScatterChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    // Generate dummy scatter data (Attendance vs Marks)
    const scatterData = Array.from({ length: 40 }, () => ({
      x: Math.floor(Math.random() * 40) + 60, // Attendance 60-100
      y: Math.floor(Math.random() * 50) + 40, // Marks 40-90
    }));

    const chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Students (CS301)',
            data: scatterData,
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderColor: '#6366f1',
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Attendance %' },
            min: 50,
            max: 100,
          },
          y: {
            title: { display: true, text: 'Internal Marks' },
            min: 0,
            max: 100,
          },
        },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function AtRiskTrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [
          {
            label: 'Students < 75% Attendance',
            data: [1, 2, 3, 5, 5],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ef4444',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, suggestedMax: 10 } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

export default function FacultyDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Faculty Academic Dashboard"
      description="Overview of your assigned classes, assessments, and student progress."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Faculty Portal', to: studentManagementUrls.faculty.root },
        { label: 'Dashboard' },
      ]}
    >
      <div className="stats-grid-5 faculty-stats-grid mb-6">
        <StatCard
          title="My Students"
          value={facultyStats.myStudents}
          icon="group"
          colorScheme="indigo"
          subtitle="Across 2 courses"
        />
        <StatCard
          title="Classes This Week"
          value={`${facultyStats.completedClasses} / ${facultyStats.classesThisWeek}`}
          icon="calendar_today"
          colorScheme="blue"
          subtitle="2 sessions pending"
        />
        <StatCard
          title="Avg Class Score"
          value={facultyStats.avgClassScore}
          icon="insights"
          colorScheme="green"
          trend={{ value: 2.1, direction: 'up', label: 'vs last test' }}
        />
        <StatCard
          title="Assessments Due"
          value={facultyStats.assessmentsDue}
          icon="assignment_late"
          colorScheme="orange"
          subtitle="Requires grading"
        />
        <StatCard
          title="At-Risk Students"
          value={facultyStats.atRiskStudents}
          icon="warning"
          colorScheme="red"
          subtitle="Attendance < 75%"
        />
      </div>

      <div className="faculty-charts-grid">
        <FormCard title="Class Attendance Trend">
          <div className="chart-container">
            <ClassAttendanceChart />
          </div>
        </FormCard>

        <FormCard title="Syllabus Coverage Progress">
          <div className="chart-container">
            <SyllabusCoverageChart />
          </div>
        </FormCard>

        <FormCard title="Score Distribution (CS301 Mid-Term 1)">
          <div className="chart-container">
            <ScoreDistributionChart />
          </div>
        </FormCard>

        <FormCard title="Unit-wise Performance (CS301)">
          <div className="chart-container">
            <MarksRadarChart />
          </div>
        </FormCard>

        <FormCard title="Attendance vs Marks Scatter">
          <div className="chart-container">
            <StudentScatterChart />
          </div>
        </FormCard>

        <FormCard title="At-Risk Students Trend">
          <div className="chart-container">
            <AtRiskTrendChart />
          </div>
        </FormCard>
      </div>

      <div className="faculty-content-split mt-6">
        <FormCard title="My Active Classes" className="h-full">
          <div className="flex flex-col gap-4">
            <div
              className="class-card class-indigo group cursor-pointer"
              onClick={() => navigate('/courses/cs301')}
            >
              <div className="class-card-stripe"></div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-700 transition-colors">
                    Data Structures & Algorithms (CS301)
                  </h3>
                  <span className="badge-sub badge-indigo">
                    B.Tech CSE - Sec A
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 bg-white px-2 py-1 rounded shadow-sm">
                  <i className="pi pi-users text-indigo-500"></i> 60
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <i className="pi pi-clock"></i> Next: 10:00 AM
                </div>
                <div className="flex items-center gap-1">
                  <i className="pi pi-map-marker"></i> Room 204
                </div>
              </div>
            </div>

            <div
              className="class-card class-orange group cursor-pointer"
              onClick={() => navigate('/courses/cs302')}
            >
              <div className="class-card-stripe"></div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-orange-700 transition-colors">
                    Operating Systems (CS302)
                  </h3>
                  <span className="badge-sub badge-orange">
                    B.Tech CSE - Sec B
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 bg-white px-2 py-1 rounded shadow-sm">
                  <i className="pi pi-users text-orange-500"></i> 60
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <i className="pi pi-clock"></i> Next: Tomorrow 02:00 PM
                </div>
                <div className="flex items-center gap-1">
                  <i className="pi pi-map-marker"></i> Room 301
                </div>
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard title="Quick Tasks" className="h-full">
          <ul className="quick-tasks-list">
            <li
              className="task-item border-orange"
              onClick={() =>
                navigate(studentManagementUrls.faculty.internalAssessment)
              }
            >
              <div className="task-icon bg-orange-50 text-orange-500">
                <i className="pi pi-file-edit"></i>
              </div>
              <div className="task-info">
                <p className="task-title group-hover:text-indigo-700">
                  Enter Mid-Term Marks
                </p>
                <p className="task-desc">Due in 2 days (CS301)</p>
              </div>
              <i className="pi pi-chevron-right text-gray-400"></i>
            </li>
            <li
              className="task-item border-blue"
              onClick={() => navigate(studentManagementUrls.faculty.progress)}
            >
              <div className="task-icon bg-blue-50 text-blue-500">
                <i className="pi pi-chart-line"></i>
              </div>
              <div className="task-info">
                <p className="task-title group-hover:text-blue-700">
                  Review Low Attendance
                </p>
                <p className="task-desc">5 students below 75%</p>
              </div>
              <i className="pi pi-chevron-right text-gray-400"></i>
            </li>
            <li
              className="task-item border-green"
              onClick={() => navigate('/attendance/mark')}
            >
              <div className="task-icon bg-green-50 text-green-500">
                <i className="pi pi-check-circle"></i>
              </div>
              <div className="task-info">
                <p className="task-title group-hover:text-green-700">
                  Mark Today's Attendance
                </p>
                <p className="task-desc">Pending for CS301</p>
              </div>
              <i className="pi pi-chevron-right text-gray-400"></i>
            </li>
          </ul>
        </FormCard>
      </div>

      <div className="faculty-content-split mt-6">
        <FormCard title="Attendance Register Summary">
          <table className="faculty-table w-full">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Section</th>
                <th className="text-center">Total Classes</th>
                <th className="text-center">Avg Att.</th>
                <th className="text-center">Below 75%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-gray-800">CS301</td>
                <td>Sec A</td>
                <td className="text-center">24</td>
                <td className="text-center font-semibold text-green-600">
                  86%
                </td>
                <td className="text-center">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    2
                  </span>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-gray-800">CS302</td>
                <td>Sec B</td>
                <td className="text-center">22</td>
                <td className="text-center font-semibold text-orange-600">
                  79%
                </td>
                <td className="text-center">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    3
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </FormCard>

        <FormCard title="Student Insights (CS301)">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="insight-box bg-green-50 border border-green-100 rounded-lg p-4">
              <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                <i className="pi pi-arrow-up"></i> Top Performers
              </h4>
              <ul className="space-y-2">
                <li className="flex justify-between text-sm">
                  <span className="text-gray-700">Aarav M.</span>
                  <span className="font-bold text-green-600">96%</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-700">Priya K.</span>
                  <span className="font-bold text-green-600">94%</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-700">Rohan S.</span>
                  <span className="font-bold text-green-600">92%</span>
                </li>
              </ul>
            </div>

            <div className="insight-box bg-red-50 border border-red-100 rounded-lg p-4">
              <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                <i className="pi pi-arrow-down"></i> Needs Attention
              </h4>
              <ul className="space-y-2">
                <li className="flex justify-between text-sm">
                  <span className="text-gray-700">Kabir D.</span>
                  <span className="font-bold text-red-600">45%</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-700">Neha G.</span>
                  <span className="font-bold text-red-600">52%</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-700">Amit J.</span>
                  <span className="font-bold text-red-600">58%</span>
                </li>
              </ul>
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
