import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const STUDENT = studentApplications[2]; // Anita Patel

export default function TeacherStudentProfile() {
  return (
    <FormPage
      title="Student Academic Profile"
      description="View complete student academic record for scholarship verification."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Teacher Portal', to: dbtUrls.teacher.portal },
        { label: 'Student Profile' },
      ]}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Profile Card */}
        <FormCard>
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                fontSize: '2rem',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              {STUDENT.studentName.charAt(0)}
            </div>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
              {STUDENT.studentName}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 4 }}>
              {STUDENT.enrollmentNo}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {STUDENT.course} · {STUDENT.branch}
            </p>
            <div
              style={{
                marginTop: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}
            >
              <div
                style={{
                  padding: '0.5rem',
                  background: '#f0fdf4',
                  borderRadius: 6,
                  border: '1px solid #bbf7d0',
                }}
              >
                <p
                  style={{
                    fontSize: '0.625rem',
                    color: '#16a34a',
                    fontWeight: 700,
                  }}
                >
                  ATTENDANCE
                </p>
                <p
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#15803d',
                  }}
                >
                  {STUDENT.attendancePct}%
                </p>
              </div>
              <div
                style={{
                  padding: '0.5rem',
                  background: '#eff6ff',
                  borderRadius: 6,
                  border: '1px solid #bfdbfe',
                }}
              >
                <p
                  style={{
                    fontSize: '0.625rem',
                    color: '#2563eb',
                    fontWeight: 700,
                  }}
                >
                  CGPA
                </p>
                <p
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#1d4ed8',
                  }}
                >
                  {STUDENT.cgpa}
                </p>
              </div>
            </div>
          </div>
        </FormCard>

        <div>
          <FormCard title="Personal & Academic Details" className="mb-4">
            <FormGrid columns={3}>
              {[
                ['Category', STUDENT.category],
                ['Department', STUDENT.department],
                ['Semester', STUDENT.semester],
                ['Annual Income', `₹${STUDENT.annualIncome.toLocaleString()}`],
                ['Academic Year', STUDENT.academicYear],
                ['Mobile', '9876500001'],
                ['Email', 'anita.patel@davv.ac.in'],
                ['Date of Birth', '12 Jan 2001'],
                ['Hostel', 'Hosteller'],
              ].map(([l, v]) => (
                <div key={l} className="dbt-info-field">
                  <p className="dbt-info-label">{l}</p>
                  <p className="dbt-info-value">{v}</p>
                </div>
              ))}
            </FormGrid>
          </FormCard>

          <FormCard title="Semester-wise Performance">
            <div style={{ overflowX: 'auto' }}>
              <table className="dbt-table">
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>SGPA</th>
                    <th>Attendance</th>
                    <th>Internal Marks</th>
                    <th>Backlogs</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Sem I', '8.8', '91%', '88/100', 'None'],
                    ['Sem II', '9.2', '93%', '92/100', 'None'],
                    [
                      'Sem III (Current)',
                      STUDENT.cgpa.toString(),
                      `${STUDENT.attendancePct}%`,
                      '90/100',
                      'None',
                    ],
                  ].map(r => (
                    <tr key={r[0]}>
                      {r.map(c => (
                        <td key={c}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
