import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { enrolledStudents, myStudentCourses, programmes } from '../../data';
import { academicsUrls } from '../../urls';
import './Dashboard.css';

const activeProgrammes = programmes.filter(p => p.status === 'Active');

const programmeEnrollment = [
  {
    title: 'B.Tech Computer Science',
    code: 'BTCS',
    count: 120,
    color: '#3b82f6',
  },
  { title: 'BCA', code: 'BCA', count: 60, color: '#8b5cf6' },
  { title: 'MBA', code: 'MBA', count: 50, color: '#f59e0b' },
  { title: 'MCA', code: 'MCA', count: 45, color: '#10b981' },
  { title: 'B.Sc Physics', code: 'BSPH', count: 37, color: '#ef4444' },
  { title: 'M.Tech AI & ML', code: 'MTAI', count: 30, color: '#06b6d4' },
];
const maxEnrollment = Math.max(...programmeEnrollment.map(p => p.count));

const gradeDistribution = [
  {
    grade: 'O',
    label: 'Outstanding',
    count: 12,
    color: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    grade: 'A+',
    label: 'Excellent',
    count: 38,
    color: '#1d4ed8',
    bg: '#dbeafe',
  },
  {
    grade: 'A',
    label: 'Very Good',
    count: 57,
    color: '#065f46',
    bg: '#d1fae5',
  },
  { grade: 'B+', label: 'Good', count: 44, color: '#92400e', bg: '#fef3c7' },
  { grade: 'B', label: 'Avg', count: 29, color: '#9a3412', bg: '#fee2e2' },
  { grade: 'C', label: 'Pass', count: 16, color: '#374151', bg: '#f3f4f6' },
];
const totalGrades = gradeDistribution.reduce((s, g) => s + g.count, 0);

const recentEnrollments = enrolledStudents.slice(3);

const currentSession = '2024-25 Odd Sem';

export default function Dashboard() {
  return (
    <FormPage
      title="Academic Management Dashboard"
      description="Overview of academic programmes, enrollments, and performance."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Academic Management', to: academicsUrls.portal },
        { label: 'Admin Portal', to: academicsUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dashboard-stats-grid">
        <StatCard
          title="Total Students"
          value="342"
          icon="groups"
          colorScheme="blue"
          trend={{ value: 8, direction: 'up', label: 'vs last semester' }}
        />
        <StatCard
          title="Active Programmes"
          value={activeProgrammes.length}
          icon="menu_book"
          colorScheme="green"
          subtitle="1 inactive programme"
        />
        <StatCard
          title="Active Courses"
          value="10"
          icon="book"
          colorScheme="purple"
          subtitle="9 Core · 1 Elective"
        />
        <StatCard
          title="Current Session"
          value={currentSession}
          icon="calendar_month"
          colorScheme="orange"
          subtitle="Started 15 Jul 2024"
        />
      </div>

      <div className="dashboard-charts-row">
        <FormCard title="Programme-wise Enrollment">
          {programmeEnrollment.map(p => (
            <div key={p.code} className="chart-bar-row">
              <span className="chart-bar-label">{p.title}</span>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{
                    width: `${(p.count / maxEnrollment) * 100}%`,
                    background: p.color,
                  }}
                />
              </div>
              <span className="chart-bar-value">{p.count}</span>
              <span className="chart-bar-pct">
                {Math.round((p.count / 342) * 100)}%
              </span>
            </div>
          ))}
        </FormCard>

        <FormCard title="Grade Distribution">
          <div className="grade-chip-grid">
            {gradeDistribution.map(g => (
              <div
                key={g.grade}
                className="grade-chip"
                style={{ background: g.bg }}
              >
                <span className="grade-chip-label" style={{ color: g.color }}>
                  {g.grade}
                </span>
                <span className="grade-chip-desc">{g.label}</span>
                <span className="grade-chip-pct" style={{ color: g.color }}>
                  {Math.round((g.count / totalGrades) * 100)}%
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Overall Pass Rate
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#16a34a',
                }}
              >
                96.8%
              </span>
            </div>
            <div className="chart-bar-track" style={{ height: 12 }}>
              <div
                className="chart-bar-fill"
                style={{ width: '96.8%', background: '#16a34a' }}
              />
            </div>
          </div>
        </FormCard>
      </div>

      <div className="dashboard-bottom-row">
        <FormCard title="Course Attendance">
          {myStudentCourses.map(c => {
            const color =
              c.attendance >= 90
                ? '#16a34a'
                : c.attendance >= 75
                  ? '#f59e0b'
                  : '#ef4444';
            return (
              <div key={c.code} className="attendance-row">
                <span className="attendance-label">
                  {c.code} — {c.title}
                </span>
                <div className="attendance-track">
                  <div
                    className="attendance-fill"
                    style={{ width: `${c.attendance}%`, background: color }}
                  />
                </div>
                <span className="attendance-pct" style={{ color }}>
                  {c.attendance}%
                </span>
              </div>
            );
          })}
        </FormCard>

        <FormCard title="Programme Level Split">
          <div className="split-stat-row">
            <div className="split-stat-item">
              <div
                className="split-stat-circle"
                style={{ background: '#3b82f6' }}
              >
                {activeProgrammes.filter(p => p.level === 'UG').length}
              </div>
              <span className="split-stat-name">Undergraduate</span>
            </div>
            <div className="split-stat-item">
              <div
                className="split-stat-circle"
                style={{ background: '#8b5cf6' }}
              >
                {activeProgrammes.filter(p => p.level === 'PG').length}
              </div>
              <span className="split-stat-name">Postgraduate</span>
            </div>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Regular Mode
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                {activeProgrammes.filter(p => p.mode === 'Regular').length}{' '}
                programmes
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Avg Credits (UG)
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                133 credits
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Avg Credits (PG)
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                87 credits
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Eval Components
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                6 active
              </span>
            </div>
          </div>
        </FormCard>
      </div>

      <div className="dashboard-full-row">
        <FormCard title="Recent Enrollments">
          <table className="recent-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Programme</th>
                <th>Batch</th>
                <th>Section</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEnrollments.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td>{s.rollNo}</td>
                  <td>{s.name}</td>
                  <td>{s.programme}</td>
                  <td>{s.batch}</td>
                  <td>{s.section}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        s.status === 'Enrolled'
                          ? 'status-pill-enrolled'
                          : 'status-pill-pending'
                      }`}
                    >
                      {s.status}
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
