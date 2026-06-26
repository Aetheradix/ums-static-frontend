import { FormCard, FormPage, StatCard } from 'shared/new-components';
import {
  academicDistinctions,
  admissionQuotas,
  disciplines,
  examSchemes,
  programmeRecords,
  ugcDegrees,
} from '../../data';
import { programmeUrls } from '../../urls';
import './Dashboard.css';

const activeRecords = programmeRecords.filter(p => p.status === 'Active');
const ugCount = activeRecords.filter(p => p.level === 'UG').length;
const pgCount = activeRecords.filter(p => p.level === 'PG').length;

const disciplineBreakdown = disciplines
  .map(d => ({
    name: d.code,
    fullName: d.name,
    count: programmeRecords.filter(p => p.discipline === d.name).length,
    color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][
      disciplines.indexOf(d) % 5
    ],
  }))
  .filter(d => d.count > 0);
const maxDisciplineCount = Math.max(...disciplineBreakdown.map(d => d.count));

const examSchemeBreakdown = examSchemes
  .map(s => ({
    name: s.name,
    count: programmeRecords.filter(p => p.examScheme === s.name).length,
    passing: s.passingMarks,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][
      examSchemes.indexOf(s) % 4
    ],
  }))
  .filter(s => s.count > 0);
const maxSchemeCount = Math.max(...examSchemeBreakdown.map(s => s.count));

export default function Dashboard() {
  return (
    <FormPage
      title="Programme Management Dashboard"
      description="Overview of programme configurations, disciplines, and academic structures."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Programme Management', to: programmeUrls.portal },
        { label: 'Admin Portal', to: programmeUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dashboard-stats-grid">
        <StatCard
          title="Active Programmes"
          value={activeRecords.length}
          icon="menu_book"
          colorScheme="blue"
          subtitle={`${programmeRecords.length - activeRecords.length} inactive`}
        />
        <StatCard
          title="Disciplines"
          value={disciplines.length}
          icon="account_tree"
          colorScheme="green"
          subtitle="All active"
        />
        <StatCard
          title="UGC Degree Types"
          value={ugcDegrees.length}
          icon="school"
          colorScheme="purple"
          subtitle="UG · PG · Doctorate"
        />
        <StatCard
          title="Exam Schemes"
          value={examSchemes.length}
          icon="assignment"
          colorScheme="orange"
          subtitle="Semester · Annual · CBCS · CBSS"
        />
      </div>

      <div className="dashboard-charts-row">
        <FormCard title="Programme Level Distribution">
          <div className="split-stat-row">
            <div className="split-stat-item">
              <div
                className="split-stat-circle"
                style={{ background: '#3b82f6' }}
              >
                {ugCount}
              </div>
              <span className="split-stat-name">Undergraduate</span>
            </div>
            <div className="split-stat-item">
              <div
                className="split-stat-circle"
                style={{ background: '#8b5cf6' }}
              >
                {pgCount}
              </div>
              <span className="split-stat-name">Postgraduate</span>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Total Enrolment Types
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>4</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Enrolment Statuses
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>4</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Academic Distinctions
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                {academicDistinctions.length}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Admission Quota Categories
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                {admissionQuotas.length}
              </span>
            </div>
          </div>
        </FormCard>

        <FormCard title="Programmes by Discipline">
          {disciplineBreakdown.map(d => (
            <div key={d.name} className="chart-bar-row">
              <span className="chart-bar-label" title={d.fullName}>
                {d.name} — {d.fullName.split(' ')[0]}
              </span>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{
                    width: `${(d.count / maxDisciplineCount) * 100}%`,
                    background: d.color,
                  }}
                />
              </div>
              <span className="chart-bar-value">{d.count}</span>
              <span className="chart-bar-pct">
                {d.count === 1 ? 'prog' : 'progs'}
              </span>
            </div>
          ))}
        </FormCard>
      </div>

      <div className="dashboard-bottom-row">
        <FormCard title="Admission Quota Distribution">
          {admissionQuotas.map(q => (
            <div key={q.id} className="chart-bar-row">
              <span className="chart-bar-label">{q.name}</span>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{
                    width: `${q.percentage}%`,
                    background:
                      q.name === 'General'
                        ? '#3b82f6'
                        : q.name === 'OBC'
                          ? '#10b981'
                          : q.name === 'SC'
                            ? '#f59e0b'
                            : q.name === 'EWS'
                              ? '#8b5cf6'
                              : '#ef4444',
                  }}
                />
              </div>
              <span className="chart-bar-value">{q.percentage}%</span>
              <span className="chart-bar-pct">seats</span>
            </div>
          ))}
        </FormCard>

        <FormCard title="Exam Schemes in Use">
          {examSchemeBreakdown.map(s => (
            <div key={s.name} className="chart-bar-row">
              <span className="chart-bar-label">{s.name}</span>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{
                    width: `${(s.count / maxSchemeCount) * 100}%`,
                    background: s.color,
                  }}
                />
              </div>
              <span className="chart-bar-value">{s.count}</span>
              <span className="chart-bar-pct">
                {s.count === 1 ? 'prog' : 'progs'}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '8px',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.5rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Passing Marks Reference
            </p>
            {examSchemes.map(s => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.25rem 0',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#374151' }}>
                  {s.name}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  {s.passingMarks}/{s.maxMarks}
                </span>
              </div>
            ))}
          </div>
        </FormCard>
      </div>

      <div className="dashboard-full-row">
        <FormCard title="Academic Distinctions">
          <table className="recent-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Distinction</th>
                <th>Min %</th>
                <th>Max %</th>
                <th>Range</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {academicDistinctions.map((d, i) => {
                const color =
                  d.minPercentage >= 75
                    ? '#7c3aed'
                    : d.minPercentage >= 60
                      ? '#1d4ed8'
                      : d.minPercentage >= 50
                        ? '#065f46'
                        : '#92400e';
                const bg =
                  d.minPercentage >= 75
                    ? '#ede9fe'
                    : d.minPercentage >= 60
                      ? '#dbeafe'
                      : d.minPercentage >= 50
                        ? '#d1fae5'
                        : '#fef3c7';
                return (
                  <tr key={d.id}>
                    <td>{i + 1}</td>
                    <td>
                      <span
                        className="status-pill"
                        style={{ background: bg, color }}
                      >
                        {d.name}
                      </span>
                    </td>
                    <td>{d.minPercentage}%</td>
                    <td>{d.maxPercentage}%</td>
                    <td>
                      <div className="chart-bar-track" style={{ width: 80 }}>
                        <div
                          className="chart-bar-fill"
                          style={{
                            width: `${d.minPercentage}%`,
                            background: color,
                          }}
                        />
                      </div>
                    </td>
                    <td>{d.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </FormCard>
      </div>
    </FormPage>
  );
}
