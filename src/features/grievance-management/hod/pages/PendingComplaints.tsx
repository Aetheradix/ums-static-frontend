import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const statusColors: Record<string, string> = {
  'Department Review': 'grv-status-pill review',
  'HoD Review': 'grv-status-pill review',
  'Committee Review': 'grv-status-pill review',
  'Registrar Decision': 'grv-status-pill approved',
  Submitted: 'grv-status-pill pending',
  Closed: 'grv-status-pill closed',
};

export default function HodPendingComplaints() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const hodComplaints = complaints.filter(
    c => c.status === 'Department Review' || c.status === 'HoD Review'
  );

  const filtered = hodComplaints.filter(
    c =>
      c.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormPage
      title="Pending Complaints"
      description="Complaints awaiting HoD review — Department forwarded files"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'HoD Portal', to: grvUrls.hod.portal },
        { label: 'Pending Complaints' },
      ]}
    >
      <div className="mb-4">
        <Button
          label="← Back to HoD Portal"
          variant="outlined"
          onClick={() => navigate(grvUrls.hod.portal)}
        />
      </div>

      <FormCard
        title={`Inbox (${filtered.length} complaint${filtered.length !== 1 ? 's' : ''})`}
      >
        <div className="flex gap-3 mb-4">
          <input
            className="grv-input flex-1"
            placeholder="Search by Ticket No, Student Name or Subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <table className="grv-table w-full text-xs">
          <thead>
            <tr>
              <th>Ticket No</th>
              <th>Complainant</th>
              <th>Category</th>
              <th>Subject</th>
              <th>Dept</th>
              <th>Submitted</th>
              <th>Status</th>
              <th className="text-center">Review</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-400">
                  No pending complaints found.
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
                <td>{c.category}</td>
                <td className="max-w-xs truncate">{c.subject}</td>
                <td className="text-slate-500">{c.assignedDept}</td>
                <td>{c.submittedDate}</td>
                <td>
                  <span className={statusColors[c.status] || 'grv-status-pill'}>
                    {c.status}
                  </span>
                </td>
                <td className="text-center">
                  <Button
                    label="Review →"
                    variant="primary"
                    onClick={() => navigate(`${grvUrls.hod.review}?id=${c.id}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
