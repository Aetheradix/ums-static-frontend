import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { leaveApplications, students } from '../../mocks';
import AttendanceCalendar from '../../shared/AttendanceCalendar';
import BiometricWidget from '../../shared/BiometricWidget';
import LeaveBalanceCard, {
  type LeaveBalanceEntry,
} from '../../shared/LeaveBalanceCard';
import { lmsUrls } from '../../urls';

const MY_STUDENT = students[0]; // Arjun Sharma CS2021001
const myApps = leaveApplications.filter(
  a => a.enrollmentNo === MY_STUDENT.enrollmentNo
);
const pending = myApps.filter(a => a.status === 'Pending').length;
const approved = myApps.filter(a => a.status === 'Approved').length;
const rejected = myApps.filter(a => a.status === 'Rejected').length;

const LEAVE_BALANCE: LeaveBalanceEntry[] = [
  { type: 'Casual Leave', allocated: 10, used: 2, remaining: 8 },
  { type: 'Medical Leave', allocated: 8, used: 3, remaining: 5 },
  { type: 'Special Leave', allocated: 3, used: 1, remaining: 2 },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Student Dashboard"
      description={`Welcome, ${MY_STUDENT.name} — ${MY_STUDENT.enrollmentNo} · ${MY_STUDENT.course}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Student Portal', to: lmsUrls.student.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Attendance %"
          value={`${MY_STUDENT.attendancePct}%`}
          icon="percent"
          colorScheme={MY_STUDENT.attendancePct >= 75 ? 'green' : 'red'}
          subtitle="This semester"
          trend={{ value: 2, direction: 'up', label: 'vs last month' }}
        />
        <StatCard
          title="Leave Balance"
          value="15 days"
          icon="event_available"
          colorScheme="blue"
          subtitle="All types"
        />
        <StatCard
          title="Applied Leaves"
          value={myApps.length + 2}
          icon="assignment"
          colorScheme="purple"
          subtitle="This year"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Awaiting approval"
        />
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Biometric Widget */}
        <FormCard title="Today's Biometric">
          <BiometricWidget
            punchIn="08:55"
            punchOut="--:--"
            workingHours="In Class"
            presentDays={18}
            absentDays={2}
            lateEntries={1}
            attendancePct={MY_STUDENT.attendancePct}
            biometricStatus="OK"
          />
        </FormCard>

        {/* Leave Status */}
        <FormCard title="Leave Status Summary">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {[
              {
                label: 'Approved',
                value: approved + 2,
                color: '#16a34a',
                bg: '#dcfce7',
              },
              {
                label: 'Pending',
                value: pending,
                color: '#b45309',
                bg: '#fef3c7',
              },
              {
                label: 'Rejected',
                value: rejected,
                color: '#b91c1c',
                bg: '#fee2e2',
              },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  textAlign: 'center',
                  padding: '0.875rem',
                  borderRadius: 8,
                  background: s.bg,
                }}
              >
                <p
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: s.color,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: s.color,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              Recent Applications
            </p>
            {myApps.slice(0, 2).map(app => (
              <div
                key={app.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.375rem 0',
                  borderBottom: '1px solid #f9fafb',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {app.leaveType} ({app.days}d)
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    padding: '0.125rem 0.5rem',
                    borderRadius: 9999,
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    background:
                      app.status === 'Approved'
                        ? '#dcfce7'
                        : app.status === 'Rejected'
                          ? '#fee2e2'
                          : '#fef3c7',
                    color:
                      app.status === 'Approved'
                        ? '#15803d'
                        : app.status === 'Rejected'
                          ? '#b91c1c'
                          : '#b45309',
                  }}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </FormCard>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        {/* Attendance Calendar */}
        <FormCard title="Attendance Calendar — June 2024">
          <AttendanceCalendar />
        </FormCard>

        {/* Leave Balance */}
        <FormCard title="Leave Balance">
          <LeaveBalanceCard entries={LEAVE_BALANCE} />
          <div style={{ marginTop: '0.75rem' }}>
            <p
              style={{
                fontSize: '0.688rem',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Note: Leaves below 75% attendance may not be approved.
            </p>
          </div>
        </FormCard>
      </div>

      {/* Quick Actions */}
      <FormCard title="Quick Actions">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
          {[
            {
              label: 'Apply Leave',
              icon: 'plus-circle',
              path: lmsUrls.student.applyLeave,
            },
            {
              label: 'Track Requests',
              icon: 'list',
              path: lmsUrls.student.myLeave,
            },
            {
              label: 'View Attendance',
              icon: 'calendar',
              path: lmsUrls.student.attendance,
            },
            {
              label: 'Biometric Log',
              icon: 'id-card',
              path: lmsUrls.student.biometric,
            },
            {
              label: 'Notifications',
              icon: 'bell',
              path: lmsUrls.student.notifications,
            },
          ].map(a => (
            <button
              key={a.label}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.875rem',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '0.813rem',
                fontWeight: 500,
                color: '#111827',
                transition: 'all 0.15s',
              }}
              onClick={() => navigate(a.path)}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6';
                (e.currentTarget as HTMLElement).style.color = '#3b82f6';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                (e.currentTarget as HTMLElement).style.color = '#111827';
              }}
            >
              <i
                className={`pi pi-${a.icon}`}
                style={{ fontSize: '0.875rem' }}
              />
              {a.label}
            </button>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
