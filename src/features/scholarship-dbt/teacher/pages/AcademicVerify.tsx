import { FormCard, FormPage } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const STUDENT = studentApplications[0];

export default function TeacherAcademicVerify() {
  return (
    <FormPage
      title="Academic Performance Verification"
      description="Verify CGPA, internal marks, and academic eligibility for scholarship."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Teacher Portal', to: dbtUrls.teacher.portal },
        { label: 'Academic Verification' },
      ]}
    >
      <div style={{ maxWidth: 820 }}>
        <FormCard
          title={`Academic Record — ${STUDENT.studentName} (${STUDENT.enrollmentNo})`}
          className="mb-4"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            {[
              {
                label: 'Current CGPA',
                value: STUDENT.cgpa,
                threshold: '≥6.0',
                ok: STUDENT.cgpa >= 6.0,
              },
              {
                label: 'Attendance',
                value: `${STUDENT.attendancePct}%`,
                threshold: '≥75%',
                ok: STUDENT.attendancePct >= 75,
              },
              { label: 'Backlogs', value: '0', threshold: '= 0', ok: true },
              {
                label: 'Year of Study',
                value: '3rd Year',
                threshold: 'Active',
                ok: true,
              },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  padding: '0.75rem',
                  borderRadius: 8,
                  background: s.ok ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${s.ok ? '#bbf7d0' : '#fca5a5'}`,
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '0.625rem',
                    color: s.ok ? '#16a34a' : '#b91c1c',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: s.ok ? '#15803d' : '#991b1b',
                    marginTop: 4,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: '0.625rem',
                    color: s.ok ? '#16a34a' : '#b91c1c',
                  }}
                >
                  Required: {s.threshold}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: s.ok ? '#16a34a' : '#b91c1c',
                    marginTop: 4,
                  }}
                >
                  {s.ok ? '✓ Eligible' : '✗ Ineligible'}
                </p>
              </div>
            ))}
          </div>

          <table className="dbt-table">
            <thead>
              <tr>
                <th>Semester</th>
                <th>Subject</th>
                <th>Internal (40)</th>
                <th>External (60)</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Sem IV', 'Data Structures', 35, 52, 87, 'A+', 'Pass'],
                ['Sem IV', 'Computer Networks', 33, 49, 82, 'A', 'Pass'],
                ['Sem IV', 'DBMS', 38, 55, 93, 'O', 'Pass'],
                ['Sem IV', 'Software Engineering', 32, 46, 78, 'B+', 'Pass'],
                ['Sem IV', 'AI & Machine Learning', 36, 53, 89, 'A+', 'Pass'],
              ].map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td
                      key={j}
                      style={{
                        fontWeight: j === 5 ? 700 : 400,
                        color: j === 6 ? '#16a34a' : '#374151',
                      }}
                    >
                      {String(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>

        <FormCard title="Previous Class Details">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
            }}
          >
            {[
              ['Board', 'Madhya Pradesh Board'],
              ['Class / Level', '12th (Higher Secondary)'],
              ['Stream', 'Science (PCM)'],
              ['Year of Passing', '2023'],
              ['Percentage / CGPA', '88.5%'],
              ['Roll Number', 'MP23SC12345'],
            ].map(([l, v]) => (
              <div key={l} className="dbt-info-field">
                <p className="dbt-info-label">{l}</p>
                <p className="dbt-info-value">{v}</p>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
