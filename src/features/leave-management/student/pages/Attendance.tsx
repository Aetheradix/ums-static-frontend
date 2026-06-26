import { FormCard, FormPage, StatCard } from 'shared/new-components';
import AttendanceCalendar from '../../shared/AttendanceCalendar';
import { students } from '../../mocks';
import { lmsUrls } from '../../urls';

const STUDENT = students[0];

export default function StudentAttendance() {
  return (
    <FormPage
      title="My Attendance"
      description="View your attendance percentage, calendar and monthly summary."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Student Portal', to: lmsUrls.student.portal },
        { label: 'Attendance' },
      ]}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Attendance %"
          value={`${STUDENT.attendancePct}%`}
          icon="percent"
          colorScheme={STUDENT.attendancePct >= 75 ? 'green' : 'red'}
          subtitle="This semester"
        />
        <StatCard title="Present Days" value="87" icon="check_circle" colorScheme="green" subtitle="This semester" />
        <StatCard title="Absent Days" value="8" icon="cancel" colorScheme="red" subtitle="This semester" />
        <StatCard title="On Leave" value="5" icon="event_busy" colorScheme="orange" subtitle="Approved leaves" />
      </div>

      {STUDENT.attendancePct < 75 && (
        <div style={{ padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.813rem', color: '#b91c1c', fontWeight: 600 }}>
            ⚠ Your attendance is below 75%. You may not be eligible to appear in exams. Please consult your class teacher.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Calendar */}
        <FormCard title="Attendance Calendar — June 2024">
          <AttendanceCalendar />
        </FormCard>

        {/* Stats Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormCard title="Monthly Breakdown — June 2024">
            {[
              { label: 'Working Days', value: 22, color: '#374151' },
              { label: 'Present', value: 19, color: '#16a34a' },
              { label: 'Absent', value: 1, color: '#ef4444' },
              { label: 'On Leave', value: 1, color: '#f59e0b' },
              { label: 'Holidays', value: 8, color: '#0369a1' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>{s.label}</span>
                <span style={{ fontSize: '0.938rem', fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </FormCard>

          <FormCard title="Subject-wise Attendance">
            {[
              { subject: 'Data Structures', pct: 92, color: '#16a34a' },
              { subject: 'OS', pct: 85, color: '#16a34a' },
              { subject: 'DBMS', pct: 78, color: '#f59e0b' },
              { subject: 'CN', pct: 88, color: '#16a34a' },
              { subject: 'SE', pct: 72, color: '#ef4444' },
            ].map(s => (
              <div key={s.subject} style={{ marginBottom: '0.625rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.subject}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: s.color }}>{s.pct}%</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 9999, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 9999 }} />
                </div>
              </div>
            ))}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
