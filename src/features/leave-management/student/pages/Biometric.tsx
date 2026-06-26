import { FormCard, FormPage, StatCard } from 'shared/new-components';
import BiometricWidget from '../../shared/BiometricWidget';
import { lmsUrls } from '../../urls';

const PUNCH_HISTORY = [
  { date: '25 Jun 2024', punchIn: '08:55', punchOut: '16:00', hours: '7h 05m', status: 'OK' },
  { date: '24 Jun 2024', punchIn: '08:50', punchOut: '15:50', hours: '7h 00m', status: 'OK' },
  { date: '22 Jun 2024', punchIn: '--:--', punchOut: '--:--', hours: '--', status: 'Leave' },
  { date: '21 Jun 2024', punchIn: '09:05', punchOut: '16:05', hours: '7h 00m', status: 'Late Entry' },
  { date: '20 Jun 2024', punchIn: '08:45', punchOut: '16:00', hours: '7h 15m', status: 'OK' },
  { date: '19 Jun 2024', punchIn: '08:55', punchOut: '15:55', hours: '7h 00m', status: 'OK' },
  { date: '18 Jun 2024', punchIn: '--:--', punchOut: '--:--', hours: '--', status: 'Absent' },
  { date: '17 Jun 2024', punchIn: '08:50', punchOut: '16:00', hours: '7h 10m', status: 'OK' },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  OK: { bg: '#dcfce7', color: '#15803d' },
  'Late Entry': { bg: '#fef3c7', color: '#b45309' },
  Leave: { bg: '#f0f9ff', color: '#0369a1' },
  Absent: { bg: '#fee2e2', color: '#b91c1c' },
};

export default function StudentBiometric() {
  return (
    <FormPage
      title="Biometric Records"
      description="View your daily punch records and attendance statistics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Student Portal', to: lmsUrls.student.portal },
        { label: 'Biometric' },
      ]}
    >
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard title="Today Punch In" value="08:55 AM" icon="login" colorScheme="green" subtitle="On time" />
        <StatCard title="Working Hours" value="In Class" icon="schedule" colorScheme="blue" subtitle="Ongoing" />
        <StatCard title="Attendance %" value="87%" icon="percent" colorScheme="teal" subtitle="This month" />
        <StatCard title="Late Entries" value="1" icon="schedule" colorScheme="amber" subtitle="This month" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <FormCard title="Today's Biometric">
          <BiometricWidget
            punchIn="08:55"
            punchOut="--:--"
            workingHours="In Class"
            presentDays={18}
            absentDays={2}
            lateEntries={1}
            attendancePct={87}
            biometricStatus="OK"
          />
        </FormCard>

        <FormCard title="June 2024 Summary">
          {[
            { label: 'Working Days', value: '22' },
            { label: 'Days Present', value: '19' },
            { label: 'Absent', value: '1' },
            { label: 'On Leave', value: '1' },
            { label: 'Avg Punch In', value: '08:52 AM' },
            { label: 'Avg Punch Out', value: '04:00 PM' },
            { label: 'Late Entries', value: '1' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid #f9fafb' }}>
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>{s.label}</span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600, color: '#111827' }}>{s.value}</span>
            </div>
          ))}
        </FormCard>
      </div>

      {/* History Table */}
      <FormCard title="Punch History — June 2024">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Date', 'Punch In', 'Punch Out', 'Hours', 'Status'].map(h => (
                <th key={h} style={{ fontSize: '0.688rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PUNCH_HISTORY.map((rec, i) => (
              <tr key={i}>
                <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', fontSize: '0.813rem', fontWeight: 500 }}>{rec.date}</td>
                <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', fontSize: '0.813rem' }}>{rec.punchIn}</td>
                <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', fontSize: '0.813rem' }}>{rec.punchOut}</td>
                <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', fontSize: '0.813rem' }}>{rec.hours}</td>
                <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ display: 'inline-flex', padding: '0.125rem 0.5rem', borderRadius: 9999, fontSize: '0.688rem', fontWeight: 600, background: STATUS_STYLES[rec.status]?.bg || '#f3f4f6', color: STATUS_STYLES[rec.status]?.color || '#6b7280' }}>
                    {rec.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
