import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
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

export default function StudentMyGrievances() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const myComplaints = complaints.filter(c => c.complaintType === 'Student');
  const filtered = myComplaints.filter(c => {
    const matchSearch =
      c.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <FormPage
      title="My Grievances"
      description="View and track all grievances submitted by you"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'My Grievances' },
      ]}
    >
      <div className="mb-4">
        <Button
          label="← Back to Portal"
          variant="outlined"
          onClick={() => navigate(grvUrls.student.portal)}
        />
      </div>
      <FormCard title="">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            className="grv-input flex-1"
            placeholder="Search by Ticket No or Subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="grv-input w-48"
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
          <Button
            label="＋ Raise New"
            variant="primary"
            onClick={() => navigate(grvUrls.student.raise)}
          />
        </div>

        <table className="grv-table w-full text-xs">
          <thead>
            <tr>
              <th>Ticket No</th>
              <th>Category</th>
              <th>Subject</th>
              <th>Submitted</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  No grievances found.
                </td>
              </tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="font-mono font-bold text-blue-700">
                  {c.ticketNo}
                </td>
                <td>{c.category}</td>
                <td className="max-w-xs truncate">{c.subject}</td>
                <td>{c.submittedDate}</td>
                <td>
                  <span className={statusColors[c.status] || 'grv-status-pill'}>
                    {c.status}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="text-blue-600 underline text-xs hover:text-blue-800"
                    onClick={() =>
                      navigate(`${grvUrls.student.details}?id=${c.id}`)
                    }
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
