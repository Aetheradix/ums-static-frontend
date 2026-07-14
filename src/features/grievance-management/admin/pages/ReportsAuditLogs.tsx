import { FormCard, FormPage } from 'shared/new-components';
import { auditLogs, complaints, grievanceCategories } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AdminReportsAuditLogs() {
  const statusStats = [
    {
      label: 'Total Complaints',
      value: complaints.length,
      color: 'text-slate-800',
    },
    {
      label: 'Open',
      value: complaints.filter(c => c.status !== 'Closed').length,
      color: 'text-orange-600',
    },
    {
      label: 'Closed',
      value: complaints.filter(c => c.status === 'Closed').length,
      color: 'text-green-600',
    },
    {
      label: 'Student',
      value: complaints.filter(c => c.complaintType === 'Student').length,
      color: 'text-blue-600',
    },
    {
      label: 'Staff/Teacher',
      value: complaints.filter(c => c.complaintType === 'Teacher').length,
      color: 'text-purple-600',
    },
    {
      label: 'Categories',
      value: grievanceCategories.length,
      color: 'text-teal-600',
    },
  ];

  return (
    <FormPage
      title="Reports & Audit Logs"
      description="System-wide analytics and user activity audit trail"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'Reports & Audit' },
      ]}
    >
      {/* System KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {statusStats.map(s => (
          <div
            key={s.label}
            className="bg-white rounded-lg border p-4 text-center"
          >
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category Report */}
      <FormCard title="Category-wise Complaint Summary">
        <table className="grv-table w-full text-xs">
          <thead>
            <tr>
              <th>Category</th>
              <th>Code</th>
              <th>Committee</th>
              <th className="text-center">Total</th>
              <th className="text-center">Open</th>
              <th className="text-center">Closed</th>
            </tr>
          </thead>
          <tbody>
            {grievanceCategories.map(cat => {
              const catComplaints = complaints.filter(
                c => c.category === cat.name
              );
              return (
                <tr key={cat.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-medium">{cat.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-blue-600 font-bold">
                    {cat.code}
                  </td>
                  <td className="text-slate-500 truncate max-w-48">
                    {cat.committee}
                  </td>
                  <td className="text-center font-bold">
                    {catComplaints.length}
                  </td>
                  <td className="text-center text-orange-600">
                    {catComplaints.filter(c => c.status !== 'Closed').length}
                  </td>
                  <td className="text-center text-green-600">
                    {catComplaints.filter(c => c.status === 'Closed').length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </FormCard>

      {/* Audit Logs */}
      <FormCard title="User Activity Audit Trail">
        <p className="text-xs text-slate-500 mb-3">
          Complete log of all system actions. All operations are timestamped and
          non-repudiable.
        </p>
        <table className="grv-table w-full text-xs">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Action</th>
              <th>Module</th>
              <th>Performed By</th>
              <th>Role</th>
              <th>IP Address</th>
              <th>Date</th>
              <th>Time</th>
              <th>Ticket</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id}>
                <td className="font-mono text-slate-400">{log.id}</td>
                <td className="font-medium text-slate-700">{log.action}</td>
                <td className="text-slate-500">{log.module}</td>
                <td className="font-semibold">{log.performedBy}</td>
                <td>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                    {log.role}
                  </span>
                </td>
                <td className="font-mono text-slate-400">{log.ipAddress}</td>
                <td>{log.date}</td>
                <td>{log.time}</td>
                <td className="font-mono text-blue-600">
                  {log.ticketNo || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
