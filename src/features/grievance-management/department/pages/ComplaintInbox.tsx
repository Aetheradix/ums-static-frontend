import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function DepartmentComplaintInbox() {
  const navigate = useNavigate();
  const [inboxList, setInboxList] = useState(
    complaints.filter(c => c.assignedDept === 'Examination Department')
  );

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  const handleQuickAssign = (id: string, officerName: string) => {
    setInboxList(prev =>
      prev.map(c =>
        c.id === id ? { ...c, assignedTo: officerName, status: 'Assigned' } : c
      )
    );
    ToastService.success(`Ticket auto assigned to: ${officerName}`);
  };

  const filtered = inboxList.filter(c => {
    const matchesSearch =
      c.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesPriority =
      filterPriority === 'ALL' || c.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <FormPage
      title="Department Complaint Inbox"
      description="Lodge investigations, review notesheets, forward cases, or assign tasks to departmental officers."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Department Portal', to: grvUrls.department.portal },
        { label: 'Inbox' },
      ]}
    >
      <div className="grv-filters-row">
        <input
          type="text"
          className="grv-search-input"
          placeholder="Search by student, ticket no, subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="grv-filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Review">Under Review</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          className="grv-filter-select"
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
        >
          <option value="ALL">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <FormCard title="Complaint Inbox Queue" icon="inbox">
        {filtered.length === 0 ? (
          <div className="grv-empty">
            <i className="pi pi-inbox text-gray-300"></i>
            <p>No complaints matched your search filter criteria.</p>
          </div>
        ) : (
          <table className="grv-table">
            <thead>
              <tr>
                <th>Ticket No</th>
                <th>Student / Program</th>
                <th>Urgency</th>
                <th>Grievance Topic</th>
                <th>SLA Time</th>
                <th>Assigned Nodal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const isUnassigned = c.assignedTo === 'Pending Assignment';
                return (
                  <tr key={c.id}>
                    <td className="font-mono font-bold text-blue-600">
                      {c.ticketNo}
                    </td>
                    <td>
                      <div className="font-bold text-slate-800">
                        {c.isAnonymous
                          ? 'Anonymous Complainant'
                          : c.studentName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {c.course || '—'} · {c.enrollmentNo || '—'}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`grv-status-pill ${c.priority.toLowerCase()}`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold text-slate-800 text-xs">
                        {c.subject}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {c.category} / {c.subCategory}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`grv-status-pill ${c.slaStatus === 'Breached' ? 'sla-breached' : c.slaStatus === 'Near Breach' ? 'sla-near' : 'sla-ok'}`}
                      >
                        {c.slaStatus === 'Breached'
                          ? 'Expired'
                          : `${c.slaRemainingHrs}h`}
                      </span>
                    </td>
                    <td>
                      {isUnassigned ? (
                        <button
                          onClick={() =>
                            handleQuickAssign(c.id, 'Dr. Rakesh Verma')
                          }
                          className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold hover:bg-amber-100"
                        >
                          Auto Assign Nodal
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-700">
                          {c.assignedTo}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button
                          label="Open Desk"
                          size="small"
                          onClick={() =>
                            navigate(grvUrls.department.details, {
                              state: { complaintId: c.id },
                            })
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </FormCard>
    </FormPage>
  );
}
