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

export default function RegistrarPendingDecisions() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const pendingComplaints = complaints.filter(
    c => c.status === 'Committee Review' || c.status === 'Registrar Decision'
  );

  const filtered = pendingComplaints.filter(
    c =>
      c.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormPage
      title="Pending Decisions"
      description="Registrar Desk — Files awaiting final sanction order"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Registrar', to: grvUrls.registrar.portal },
        { label: 'Pending Decisions' },
      ]}
    >
      <FormCard title={`Files Pending Sanction (${filtered.length})`}>
        <div className="mb-4">
          <input
            className="grv-input w-full md:w-80"
            placeholder="Search by ticket, name, subject..."
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
              <th>Submitted</th>
              <th>Status</th>
              <th className="text-center">Decision</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400">
                  No pending decisions.
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
                <td>{c.submittedDate}</td>
                <td>
                  <span className={statusColors[c.status] || 'grv-status-pill'}>
                    {c.status}
                  </span>
                </td>
                <td className="text-center">
                  <Button
                    label="Issue Order →"
                    variant="primary"
                    onClick={() =>
                      navigate(`${grvUrls.registrar.decision}?id=${c.id}`)
                    }
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
