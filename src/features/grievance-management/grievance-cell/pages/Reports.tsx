import { FormCard, FormPage } from 'shared/new-components';
import { complaints, grievanceCategories } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function GrievanceCellReports() {
  // Department-wise stats
  const deptStats = [...new Set(complaints.map(c => c.assignedDept))].map(
    dept => {
      const deptComplaints = complaints.filter(c => c.assignedDept === dept);
      return {
        dept,
        total: deptComplaints.length,
        closed: deptComplaints.filter(c => c.status === 'Closed').length,
        pending: deptComplaints.filter(c => c.status !== 'Closed').length,
      };
    }
  );

  // Category-wise stats
  const catStats = grievanceCategories.map(cat => {
    const catComplaints = complaints.filter(c => c.category === cat.name);
    return {
      name: cat.name,
      code: cat.code,
      total: catComplaints.length,
      closed: catComplaints.filter(c => c.status === 'Closed').length,
      open: catComplaints.filter(c => c.status !== 'Closed').length,
      color: cat.color,
    };
  });

  // Status breakdown
  const statusStats = [
    {
      label: 'Submitted',
      count: complaints.filter(c => c.status === 'Submitted').length,
      color: '#f59e0b',
    },
    {
      label: 'Department Review',
      count: complaints.filter(c => c.status === 'Department Review').length,
      color: '#3b82f6',
    },
    {
      label: 'HoD Review',
      count: complaints.filter(c => c.status === 'HoD Review').length,
      color: '#6366f1',
    },
    {
      label: 'Committee Review',
      count: complaints.filter(c => c.status === 'Committee Review').length,
      color: '#8b5cf6',
    },
    {
      label: 'Registrar Decision',
      count: complaints.filter(c => c.status === 'Registrar Decision').length,
      color: '#10b981',
    },
    {
      label: 'Closed',
      count: complaints.filter(c => c.status === 'Closed').length,
      color: '#64748b',
    },
  ];

  return (
    <FormPage
      title="Analytics & Reports"
      description="Grievance Cell — System-wide complaint analytics"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell', to: grvUrls.cell.portal },
        { label: 'Reports' },
      ]}
    >
      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-3xl font-bold text-slate-800">
            {complaints.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Total Complaints</p>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">
            {complaints.filter(c => c.complaintType === 'Student').length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Student Complaints</p>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">
            {complaints.filter(c => c.complaintType === 'Teacher').length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Staff/Teacher Complaints
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {complaints.filter(c => c.status === 'Closed').length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Resolved & Closed</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <FormCard title="Status-wise Breakdown">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {statusStats.map(s => (
            <div
              key={s.label}
              className="flex items-center gap-3 p-3 rounded border bg-slate-50"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <div className="flex-1">
                <p className="text-xs text-slate-600 font-medium">{s.label}</p>
              </div>
              <p className="text-lg font-bold text-slate-800">{s.count}</p>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Department-wise */}
      <FormCard title="Department-wise Report">
        <table className="grv-table w-full text-xs">
          <thead>
            <tr>
              <th>Department</th>
              <th className="text-center">Total</th>
              <th className="text-center">Open</th>
              <th className="text-center">Closed</th>
              <th className="text-center">Resolution Rate</th>
            </tr>
          </thead>
          <tbody>
            {deptStats.map(d => (
              <tr key={d.dept}>
                <td className="font-medium text-slate-700">{d.dept}</td>
                <td className="text-center font-bold">{d.total}</td>
                <td className="text-center text-orange-600 font-semibold">
                  {d.pending}
                </td>
                <td className="text-center text-green-600 font-semibold">
                  {d.closed}
                </td>
                <td className="text-center">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${d.total ? Math.round((d.closed / d.total) * 100) : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 w-8">
                      {d.total ? Math.round((d.closed / d.total) * 100) : 0}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>

      {/* Category-wise */}
      <FormCard title="Category-wise Report">
        <table className="grv-table w-full text-xs">
          <thead>
            <tr>
              <th>Category</th>
              <th>Code</th>
              <th className="text-center">Total</th>
              <th className="text-center">Open</th>
              <th className="text-center">Closed</th>
            </tr>
          </thead>
          <tbody>
            {catStats.map(c => (
              <tr key={c.code}>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="font-medium text-slate-700">{c.name}</span>
                  </div>
                </td>
                <td className="font-mono text-blue-600 font-bold">{c.code}</td>
                <td className="text-center font-bold">{c.total}</td>
                <td className="text-center text-orange-600 font-semibold">
                  {c.open}
                </td>
                <td className="text-center text-green-600 font-semibold">
                  {c.closed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
