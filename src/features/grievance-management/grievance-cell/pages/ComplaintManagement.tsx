import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { complaints, grievanceCategories } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function GrievanceCellComplaintManagement() {
  const navigate = useNavigate();
  const [list] = useState(complaints);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const filtered = list.filter(c => {
    const matchesSearch =
      c.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'ALL' || c.category === category;
    const matchesStatus = status === 'ALL' || c.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExport = (type: string) => {
    ToastService.success(`Exporting master grievances data in ${type}...`);
  };

  return (
    <FormPage
      title="Master Complaint Management"
      description="System-wide administration of all academic, administrative, anti-ragging, and SC/ST grievances."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell Portal', to: grvUrls.cell.portal },
        { label: 'Management' },
      ]}
    >
      <div className="flex gap-2 mb-4">
        <Button
          label="Export PDF"
          icon="file-pdf"
          variant="outlined"
          size="small"
          onClick={() => handleExport('PDF')}
        />
        <Button
          label="Export Excel"
          icon="file-excel"
          variant="outlined"
          size="small"
          onClick={() => handleExport('Excel')}
        />
      </div>

      <div className="grv-filters-row">
        <input
          type="text"
          className="grv-search-input"
          placeholder="Search by ticket no, student, subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="grv-filter-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          {grievanceCategories.map(c => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="grv-filter-select"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Review">Under Review</option>
          <option value="Forwarded">Forwarded</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <FormCard title="Master Grievance Petitions Records" icon="list">
        {filtered.length === 0 ? (
          <div className="grv-empty">
            <i className="pi pi-list text-gray-300"></i>
            <p>No complaints matched your search filter criteria.</p>
          </div>
        ) : (
          <table className="grv-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Complainant Name</th>
                <th>Category</th>
                <th>Subject Petition</th>
                <th>Assigned Dept</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="font-mono font-bold text-blue-600">
                    {c.ticketNo}
                  </td>
                  <td>
                    <div className="font-bold text-slate-800">
                      {c.isAnonymous ? 'Anonymous' : c.studentName}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.enrollmentNo || 'N/A'}
                    </span>
                  </td>
                  <td>{c.category}</td>
                  <td>
                    <div className="font-bold text-slate-800 text-xs">
                      {c.subject}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Filed: {c.submittedDate}
                    </span>
                  </td>
                  <td>{c.assignedDept}</td>
                  <td>
                    <span
                      className={`grv-status-pill ${c.status.toLowerCase().replace(' ', '-')}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(grvUrls.cell.assignment, {
                          state: { complaintId: c.id },
                        })
                      }
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2 py-1 rounded"
                    >
                      Process Desk
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </FormCard>
    </FormPage>
  );
}
