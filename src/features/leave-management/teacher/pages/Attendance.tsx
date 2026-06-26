import { FormCard, FormPage, StatCard } from 'shared/new-components';
import AttendanceCalendar from '../../shared/AttendanceCalendar';
import { lmsUrls } from '../../urls';

export default function TeacherAttendance() {
  return (
    <FormPage
      title="My Attendance"
      description="View your attendance calendar, monthly summary and leave records."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Teacher Portal', to: lmsUrls.teacher.portal },
        { label: 'Attendance' },
      ]}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Present Days" value="19" icon="check_circle" colorScheme="green" subtitle="This month" />
        <StatCard title="Absent Days" value="1" icon="cancel" colorScheme="red" subtitle="This month" />
        <StatCard title="Leave Days" value="2" icon="event_busy" colorScheme="orange" subtitle="This month" />
        <StatCard title="Attendance %" value="91%" icon="percent" colorScheme="blue" subtitle="This month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Calendar */}
        <FormCard title="Attendance Calendar — June 2024">
          <AttendanceCalendar />
        </FormCard>

        {/* Monthly Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormCard title="Monthly Breakdown">
            {[
              { label: 'Total Working Days', value: 22, color: '#374151' },
              { label: 'Present', value: 19, color: '#16a34a' },
              { label: 'Absent', value: 1, color: '#ef4444' },
              { label: 'On Leave', value: 2, color: '#f59e0b' },
              { label: 'Late Entries', value: 1, color: '#8b5cf6' },
              { label: 'Holidays', value: 8, color: '#0369a1' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>{s.label}</span>
                <span style={{ fontSize: '0.938rem', fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </FormCard>

          <FormCard title="Semester Summary">
            {[
              { label: 'Total Days', value: 120, pct: 100, color: '#374151' },
              { label: 'Present', value: 105, pct: 87, color: '#16a34a' },
              { label: 'On Leave', value: 10, pct: 8, color: '#f59e0b' },
              { label: 'Absent', value: 5, pct: 4, color: '#ef4444' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.label}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: s.color }}>{s.value} days</span>
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
