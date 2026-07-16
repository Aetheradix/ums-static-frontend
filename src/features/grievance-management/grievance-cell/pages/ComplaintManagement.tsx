import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const statusColors: Record<string, string> = {
  Submitted: 'grv-status-pill pending',
  'Department Review': 'grv-status-pill review',
  'HoD Review': 'grv-status-pill review',
  'Committee Review': 'grv-status-pill review',
  'Registrar Decision': 'grv-status-pill approved',
  Closed: 'grv-status-pill closed',
};

export default function GrievanceCellComplaintManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = complaints.filter(c => {
    const matchSearch =
      c.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Submitted').length,
    inProcess: complaints.filter(c =>
      ['Department Review', 'HoD Review', 'Committee Review'].includes(c.status)
    ).length,
    decided: complaints.filter(c => c.status === 'Registrar Decision').length,
    closed: complaints.filter(c => c.status === 'Closed').length,
  };

  return (
    <FormPage
      title="Complaint Management"
      description="Grievance Cell — Central complaint monitoring dashboard"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell', to: grvUrls.cell.portal },
        { label: 'Complaint Management' },
      ]}
    >
      <div className="mb-4">
        <Button
          label="← Back to Cell Portal"
          variant="outlined"
          onClick={() => navigate(grvUrls.cell.portal)}
        />
      </div>

      {/* KPI Cards Row */}
      <div className="grv-stats-grid">
        <StatCard
          title="Total"
          value={stats.total}
          icon="folder_open"
          colorScheme="blue"
          subtitle="All complaints"
        />
        <StatCard
          title="Submitted"
          value={stats.pending}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Pending review"
        />
        <StatCard
          title="In Process"
          value={stats.inProcess}
          icon="cached"
          colorScheme="purple"
          subtitle="Under review"
        />
        <StatCard
          title="Registrar"
          value={stats.decided}
          icon="gavel"
          colorScheme="indigo"
          subtitle="Awaiting decision"
        />
        <StatCard
          title="Closed"
          value={stats.closed}
          icon="check_circle"
          colorScheme="green"
          subtitle="Resolved cases"
        />
      </div>

      <FormCard title="All Complaints">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            className="grv-input flex-1"
            placeholder="Search by Ticket, Name, Subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="grv-input w-52"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Department Review">Department Review</option>
            <option value="HoD Review">HoD Review</option>
            <option value="Committee Review">Committee Review</option>
            <option value="Registrar Decision">Registrar Decision</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Responsive, Bordered Table Container */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="grv-table w-full text-xs">
            <thead>
              <tr>
                <th>Ticket No</th>
                <th>Complainant</th>
                <th>Type</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Submitted</th>
                <th>Hearing Date</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No complaints found.
                  </td>
                </tr>
              )}
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="font-mono font-bold text-blue-700">
                    {c.ticketNo}
                  </td>
                  <td>
                    <p className="font-semibold">{c.studentName}</p>
                    <p className="text-slate-400">{c.enrollmentNo}</p>
                  </td>
                  <td>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.complaintType === 'Student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}
                    >
                      {c.complaintType}
                    </span>
                  </td>
                  <td>{c.category}</td>
                  <td className="max-w-xs truncate">{c.subject}</td>
                  <td>{c.submittedDate}</td>
                  <td>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${c.hearingDate && c.hearingDate !== '—' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {c.hearingDate ?? '—'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={statusColors[c.status] || 'grv-status-pill'}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <Button
                      label="Review →"
                      variant="primary"
                      onClick={() =>
                        navigate(`${grvUrls.cell.committee}?id=${c.id}`)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
