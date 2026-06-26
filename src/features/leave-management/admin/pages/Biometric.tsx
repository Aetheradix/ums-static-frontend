import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { biometricRecords } from '../../mocks';
import { lmsUrls } from '../../urls';

const missing = biometricRecords.filter(b => b.status === 'Missing Punch');
const late = biometricRecords.filter(b => b.status === 'Late Entry');
const ok = biometricRecords.filter(b => b.status === 'OK');

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  OK: { bg: '#dcfce7', color: '#15803d' },
  'Missing Punch': { bg: '#fee2e2', color: '#b91c1c' },
  'Late Entry': { bg: '#fef3c7', color: '#b45309' },
  'Early Exit': { bg: '#faf5ff', color: '#7c3aed' },
};

export default function Biometric() {
  return (
    <FormPage
      title="Biometric Management"
      description="View biometric punch records, missing entries, and daily working hours."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
        { label: 'Biometric' },
      ]}
    >
      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Punches"
          value={biometricRecords.length}
          icon="fingerprint"
          colorScheme="blue"
          subtitle="Today"
        />
        <StatCard
          title="OK Records"
          value={ok.length}
          icon="check_circle"
          colorScheme="green"
          subtitle="No issues"
        />
        <StatCard
          title="Missing Punch"
          value={missing.length}
          icon="warning"
          colorScheme="red"
          subtitle="Needs action"
        />
        <StatCard
          title="Late Entries"
          value={late.length}
          icon="schedule"
          colorScheme="amber"
          subtitle="Today"
        />
      </div>

      {/* Biometric Records Table */}
      <FormCard title="Today's Biometric Records — 26 Jun 2024">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {[
                '#',
                'Employee',
                'Department',
                'Punch In',
                'Punch Out',
                'Working Hours',
                'Status',
              ].map(h => (
                <th
                  key={h}
                  style={{
                    fontSize: '0.688rem',
                    fontWeight: 600,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.5rem 0.75rem',
                    borderBottom: '1px solid #e5e7eb',
                    textAlign: 'left',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {biometricRecords.map((rec, i) => (
              <tr key={rec.id}>
                <td
                  style={{
                    fontSize: '0.813rem',
                    padding: '0.625rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
                    color: '#9ca3af',
                  }}
                >
                  {i + 1}
                </td>
                <td
                  style={{
                    fontSize: '0.813rem',
                    padding: '0.625rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
                    fontWeight: 600,
                  }}
                >
                  {rec.employee}
                </td>
                <td
                  style={{
                    fontSize: '0.813rem',
                    padding: '0.625rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
                    color: '#6b7280',
                  }}
                >
                  {rec.department}
                </td>
                <td
                  style={{
                    fontSize: '0.813rem',
                    padding: '0.625rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  {rec.punchIn}
                </td>
                <td
                  style={{
                    fontSize: '0.813rem',
                    padding: '0.625rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  {rec.punchOut}
                </td>
                <td
                  style={{
                    fontSize: '0.813rem',
                    padding: '0.625rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  {rec.workingHours}
                </td>
                <td
                  style={{
                    padding: '0.625rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.125rem 0.5rem',
                      borderRadius: 9999,
                      fontSize: '0.688rem',
                      fontWeight: 600,
                      background: STATUS_STYLES[rec.status]?.bg,
                      color: STATUS_STYLES[rec.status]?.color,
                    }}
                  >
                    {rec.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>

      {/* Monthly Summary */}
      <FormCard title="Monthly Summary — June 2024" className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Total Working Days', value: 21 },
            { label: 'Average Punch In', value: '09:05 AM' },
            { label: 'Average Punch Out', value: '05:15 PM' },
            { label: 'Average Working Hours', value: '7h 42m' },
            { label: 'Attendance %', value: '93.2%' },
            { label: 'Missing Punch Incidents', value: 18 },
          ].map(s => (
            <div
              key={s.label}
              style={{
                padding: '1rem',
                border: '1px solid #f3f4f6',
                borderRadius: 8,
                background: '#f9fafb',
              }}
            >
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 6,
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
