import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { lmsUrls } from '../../urls';

const mockExport = (type: string) => ToastService.success(`Exporting ${type}... (simulated)`);

const MY_DATA = {
  applications: [
    { type: 'Casual Leave', from: '2024-05-15', to: '2024-05-16', days: 2, status: 'Approved' },
    { type: 'Medical Leave', from: '2024-04-08', to: '2024-04-10', days: 3, status: 'Approved' },
    { type: 'Earned Leave', from: '2024-03-25', to: '2024-03-28', days: 4, status: 'Rejected' },
    { type: 'Casual Leave', from: '2024-06-20', to: '2024-06-21', days: 2, status: 'Pending' },
  ],
};

export default function TeacherReports() {
  return (
    <FormPage
      title="My Reports"
      description="View your personal leave, attendance and balance reports."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Teacher Portal', to: lmsUrls.teacher.portal },
        { label: 'Reports' },
      ]}
    >
      {/* Export Bar */}
      <div className="flex gap-3 mb-6">
        <Button label="Export PDF" icon="file-pdf" variant="outlined" onClick={() => mockExport('PDF')} />
        <Button label="Export Excel" icon="file-excel" variant="outlined" onClick={() => mockExport('Excel')} />
        <Button label="Print" icon="print" variant="outlined" onClick={() => mockExport('Print')} />
      </div>

      {/* Leave Summary */}
      <FormCard title="Leave Summary — Current Academic Year">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Applied', value: 4, color: '#3b82f6' },
            { label: 'Approved', value: 2, color: '#16a34a' },
            { label: 'Rejected', value: 1, color: '#ef4444' },
            { label: 'Pending', value: 1, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '1rem', border: '1px solid #f3f4f6', borderRadius: 8, background: '#f9fafb' }}>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: '0.688rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['#', 'Leave Type', 'From', 'To', 'Days', 'Status'].map(h => (
                <th key={h} style={{ fontSize: '0.688rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MY_DATA.applications.map((app, i) => (
              <tr key={i}>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', color: '#9ca3af' }}>{i + 1}</td>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}>{app.type}</td>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>{app.from}</td>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>{app.to}</td>
                <td style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>{app.days}</td>
                <td style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ display: 'inline-flex', padding: '0.125rem 0.5rem', borderRadius: 9999, fontSize: '0.688rem', fontWeight: 600, background: app.status === 'Approved' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: app.status === 'Approved' ? '#15803d' : app.status === 'Rejected' ? '#b91c1c' : '#b45309' }}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>

      {/* Leave Balance Report */}
      <FormCard title="Leave Balance Report" className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { type: 'Casual Leave', alloc: 12, used: 1, remain: 11 },
            { type: 'Medical Leave', alloc: 20, used: 2, remain: 18 },
            { type: 'Earned Leave', alloc: 15, used: 0, remain: 15 },
            { type: 'Half Pay Leave', alloc: 20, used: 0, remain: 20 },
          ].map(b => (
            <div key={b.type} style={{ border: '1px solid #f3f4f6', borderRadius: 8, padding: '0.875rem', background: '#f9fafb' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.625rem' }}>{b.type}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.688rem', color: '#9ca3af' }}>Allocated</span>
                <span style={{ fontSize: '0.688rem', fontWeight: 700, color: '#1d4ed8' }}>{b.alloc}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.688rem', color: '#9ca3af' }}>Used</span>
                <span style={{ fontSize: '0.688rem', fontWeight: 700, color: '#b91c1c' }}>{b.used}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.688rem', color: '#9ca3af' }}>Remaining</span>
                <span style={{ fontSize: '0.688rem', fontWeight: 700, color: '#15803d' }}>{b.remain}</span>
              </div>
            </div>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
