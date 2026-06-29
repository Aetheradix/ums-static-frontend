import { FormCard, FormPage } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const STUDENTS = studentApplications.slice(0, 5);

export default function TeacherAttendanceVerify() {
  return (
    <FormPage
      title="Attendance Verification"
      description="Verify student attendance eligibility for scholarship (minimum 75% required)."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Teacher Portal', to: dbtUrls.teacher.portal },
        { label: 'Attendance Verification' },
      ]}
    >
      <FormCard title="Attendance Eligibility Check — Department Students">
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            background: '#eff6ff',
            borderRadius: 8,
            border: '1px solid #bfdbfe',
          }}
        >
          <p
            style={{ fontSize: '0.813rem', color: '#1d4ed8', fontWeight: 600 }}
          >
            ℹ Minimum 75% attendance is mandatory for scholarship eligibility.
            Below 75% = automatically ineligible.
          </p>
        </div>

        {STUDENTS.map(s => (
          <div
            key={s.id}
            style={{
              padding: '1rem',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              marginBottom: '0.75rem',
              background: '#fff',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  {s.studentName}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {s.enrollmentNo} · {s.course} {s.branch} · {s.semester}
                </p>
              </div>
              <span
                className={`dbt-status-pill ${s.attendancePct >= 75 ? 'approved' : 'rejected'}`}
              >
                {s.attendancePct >= 75 ? 'Eligible' : 'Ineligible'}
              </span>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Attendance Percentage
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: s.attendancePct >= 75 ? '#16a34a' : '#b91c1c',
                  }}
                >
                  {s.attendancePct}%
                </span>
              </div>
              <div className="dbt-bar-track">
                <div
                  className="dbt-bar-fill"
                  style={{
                    width: `${s.attendancePct}%`,
                    background: s.attendancePct >= 75 ? '#16a34a' : '#ef4444',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 2,
                }}
              >
                <span style={{ fontSize: '0.625rem', color: '#9ca3af' }}>
                  0%
                </span>
                <span style={{ fontSize: '0.625rem', color: '#d97706' }}>
                  75% (Min)
                </span>
                <span style={{ fontSize: '0.625rem', color: '#9ca3af' }}>
                  100%
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                marginTop: '0.75rem',
              }}
            >
              {['Sem Theory', 'Practicals', 'Tutorials', 'Overall'].map(
                (sub, i) => (
                  <div
                    key={sub}
                    style={{
                      padding: '0.375rem',
                      background: '#f9fafb',
                      borderRadius: 6,
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.625rem',
                        color: '#9ca3af',
                        marginBottom: 2,
                      }}
                    >
                      {sub}
                    </p>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#374151',
                      }}
                    >
                      {
                        [
                          s.attendancePct - 2,
                          s.attendancePct + 4,
                          s.attendancePct,
                          s.attendancePct,
                        ][i]
                      }
                      %
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </FormCard>
    </FormPage>
  );
}
