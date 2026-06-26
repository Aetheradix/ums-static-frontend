import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { leaveApplications } from '../../mocks';
import BiometricWidget from '../../shared/BiometricWidget';
import LeaveBalanceCard, {
  type LeaveBalanceEntry,
} from '../../shared/LeaveBalanceCard';
import { lmsUrls } from '../../urls';
import './Dashboard.css';

const MY_TEACHER = 'Prof. Vijay Reddy';

const myApps = leaveApplications.filter(a => a.applicant === MY_TEACHER);
const pending = myApps.filter(a => a.status === 'Pending').length;

const studentPending = leaveApplications.filter(
  a => a.role === 'Student' && a.status === 'Pending'
);

const LEAVE_BALANCE: LeaveBalanceEntry[] = [
  { type: 'Casual Leave', allocated: 12, used: 1, remaining: 11 },
  { type: 'Medical Leave', allocated: 20, used: 2, remaining: 18 },
  {
    type: 'Earned Leave',
    allocated: 15,
    used: 0,
    remaining: 15,
    carryForward: 8,
  },
  { type: 'Half Pay Leave', allocated: 20, used: 0, remaining: 20 },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Teacher Dashboard"
      description={`Welcome, ${MY_TEACHER} — CS Department`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Teacher Portal', to: lmsUrls.teacher.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI */}
      <div className="lms-dashboard-stats">
        <StatCard
          title="Available Leave"
          value="44 days"
          icon="event_available"
          colorScheme="green"
          subtitle="All types combined"
        />
        <StatCard
          title="Applied This Year"
          value={myApps.length + 3}
          icon="assignment"
          colorScheme="blue"
          trend={{ value: 2, direction: 'up', label: 'vs last year' }}
        />
        <StatCard
          title="Pending Requests"
          value={pending}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Awaiting approval"
        />
        <StatCard
          title="Student Requests"
          value={studentPending.length}
          icon="school"
          colorScheme="purple"
          subtitle="Pending your review"
        />
      </div>

      {/* Charts row */}
      <div className="lms-charts-row">
        {/* Leave Balance */}
        <FormCard title="Leave Balance — Current Year">
          <LeaveBalanceCard entries={LEAVE_BALANCE} showCarryForward />
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                color: '#6b7280',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: '#dbeafe',
                  border: '1px solid #1d4ed8',
                  display: 'inline-block',
                }}
              />
              Allocated
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                color: '#6b7280',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: '#fee2e2',
                  border: '1px solid #b91c1c',
                  display: 'inline-block',
                }}
              />
              Used
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                color: '#6b7280',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: '#dcfce7',
                  border: '1px solid #15803d',
                  display: 'inline-block',
                }}
              />
              Remaining
            </span>
          </div>
        </FormCard>

        {/* Biometric */}
        <FormCard title="Today's Biometric">
          <BiometricWidget
            punchIn="09:00"
            punchOut="--:--"
            workingHours="In Progress"
            presentDays={19}
            absentDays={1}
            lateEntries={1}
            attendancePct={91}
            biometricStatus="OK"
          />
        </FormCard>
      </div>

      {/* Quick Actions + Student Requests */}
      <div className="lms-charts-row">
        {/* Quick Actions */}
        <FormCard title="Quick Actions">
          <div className="lms-quick-actions">
            {[
              {
                label: 'Apply Leave',
                icon: 'plus-circle',
                path: lmsUrls.teacher.applyLeave,
              },
              {
                label: 'My Applications',
                icon: 'list',
                path: lmsUrls.teacher.myApplications,
              },
              {
                label: 'Student Requests',
                icon: 'users',
                path: lmsUrls.teacher.studentRequests,
              },
              {
                label: 'View Attendance',
                icon: 'calendar',
                path: lmsUrls.teacher.attendance,
              },
              {
                label: 'Biometric Log',
                icon: 'id-card',
                path: lmsUrls.teacher.biometric,
              },
              {
                label: 'My Reports',
                icon: 'chart-bar',
                path: lmsUrls.teacher.reports,
              },
            ].map(a => (
              <button
                key={a.label}
                type="button"
                className="lms-quick-action-btn"
                onClick={() => navigate(a.path)}
              >
                <i className={`pi pi-${a.icon}`} />
                {a.label}
              </button>
            ))}
          </div>
        </FormCard>

        {/* Recent My Applications */}
        <FormCard title="My Recent Applications">
          {myApps.length === 0 ? (
            <p
              style={{
                fontSize: '0.813rem',
                color: '#9ca3af',
                padding: '1rem 0',
              }}
            >
              No applications found.
            </p>
          ) : (
            myApps.slice(0, 5).map(app => (
              <div
                key={app.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                    {app.leaveType}
                  </p>
                  <p style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                    {app.fromDate} – {app.toDate} ({app.days}d)
                  </p>
                </div>
                <span
                  style={{
                    display: 'inline-flex',
                    padding: '0.125rem 0.5rem',
                    borderRadius: 9999,
                    fontSize: '0.688rem',
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
            ))
          )}
        </FormCard>
      </div>

      {/* Student Leave Pending */}
      <FormCard title="Student Leave Requests — Pending Your Review">
        <table className="lms-table">
          <thead>
            <tr>
              {[
                'Student',
                'Enrollment',
                'Leave Type',
                'Duration',
                'Attendance %',
                'Reason',
              ].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentPending.slice(0, 5).map(app => (
              <tr key={app.id}>
                <td>{app.applicant}</td>
                <td>{app.enrollmentNo}</td>
                <td>{app.leaveType}</td>
                <td>{app.days} days</td>
                <td
                  style={{
                    color:
                      (app.attendancePct ?? 100) >= 75 ? '#16a34a' : '#ef4444',
                    fontWeight: 600,
                  }}
                >
                  {app.attendancePct}%
                </td>
                <td
                  style={{
                    maxWidth: '12rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {app.reason}
                </td>
              </tr>
            ))}
            {studentPending.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: 'center',
                    color: '#9ca3af',
                    padding: '1.5rem',
                  }}
                >
                  No pending student requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
