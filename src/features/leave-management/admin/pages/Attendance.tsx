import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { todayAttendance } from '../../mocks';
import { lmsUrls } from '../../urls';

const present = todayAttendance.filter(a => a.status === 'Present').length;
const absent = todayAttendance.filter(a => a.status === 'Absent').length;
const onLeave = todayAttendance.filter(a => a.status === 'Leave').length;
const late = todayAttendance.filter(a => a.status === 'Late').length;

const STATUS_COLORS: Record<string, string> = {
  Present: '#16a34a',
  Absent: '#ef4444',
  Leave: '#f59e0b',
  Late: '#8b5cf6',
  Holiday: '#0369a1',
};


export default function Attendance() {
  return (
    <FormPage
      title="Attendance Management"
      description="Today's attendance overview and employee punch records."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
        { label: 'Attendance' },
      ]}
    >
      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard title="Present" value={present} icon="check_circle" colorScheme="green" subtitle="Today" />
        <StatCard title="Absent" value={absent} icon="cancel" colorScheme="red" subtitle="Today" />
        <StatCard title="On Leave" value={onLeave} icon="event_busy" colorScheme="orange" subtitle="Today" />
        <StatCard title="Late Entry" value={late} icon="schedule" colorScheme="purple" subtitle="Today" />
      </div>

      {/* Attendance Bar Chart */}
      <FormCard title="Department Attendance — Today">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
          {[
            { dept: 'Computer Science', present: 12, total: 15 },
            { dept: 'Mathematics', present: 8, total: 10 },
            { dept: 'Physics', present: 9, total: 12 },
            { dept: 'Chemistry', present: 7, total: 10 },
            { dept: 'Electronics', present: 11, total: 14 },
            { dept: 'MBA', present: 10, total: 12 },
            { dept: 'Civil Engineering', present: 8, total: 10 },
            { dept: 'Administration', present: 18, total: 20 },
          ].map(d => {
            const pct = Math.round((d.present / d.total) * 100);
            const color = pct >= 85 ? '#16a34a' : pct >= 70 ? '#f59e0b' : '#ef4444';
            return (
              <div key={d.dept} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '10rem', fontSize: '0.813rem', color: '#6b7280', flexShrink: 0 }}>{d.dept}</span>
                <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 9999, height: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 9999, transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color, width: '3rem', textAlign: 'right', flexShrink: 0 }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </FormCard>

      {/* Employee Grid */}
      <FormCard title="Employee Attendance Records" className="mt-4">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['#', 'Employee', 'Department', 'Punch In', 'Punch Out', 'Working Hrs', 'Status', 'Mapped Leave'].map(h => (
                <th key={h} style={{ fontSize: '0.688rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todayAttendance.map((rec, i) => (
              <tr key={rec.id}>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', color: '#9ca3af' }}>{i + 1}</td>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}>{rec.employee}</td>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', color: '#6b7280' }}>{rec.department}</td>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>{rec.punchIn}</td>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>{rec.punchOut}</td>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>{rec.workingHours}</td>
                <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.125rem 0.5rem', borderRadius: 9999, fontSize: '0.688rem', fontWeight: 600, background: STATUS_COLORS[rec.status] + '22', color: STATUS_COLORS[rec.status] }}>
                    {rec.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', color: '#9ca3af' }}>{rec.mappedLeave ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
