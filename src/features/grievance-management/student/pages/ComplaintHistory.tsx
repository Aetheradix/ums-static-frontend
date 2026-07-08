import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function StudentComplaintHistory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Active mock student
  const STUDENT_ENROLL = 'CS2021001';
  // Include resolved/closed/withdrawn/rejected/appealed complaints
  const historyComplaints = complaints.filter(
    c =>
      (c.enrollmentNo === STUDENT_ENROLL || !c.isAnonymous) &&
      ['Resolved', 'Closed', 'Rejected', 'Withdrawn'].includes(c.status)
  );

  const filtered = historyComplaints.filter(
    c =>
      c.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = (type: string) => {
    ToastService.success(`Exporting grievance history in ${type} format...`);
  };

  return (
    <FormPage
      title="Complaint Archival History"
      description="View full list of your past closed, resolved, withdrawn, or settled grievance files."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'Complaint History' },
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

      <FormCard title="Resolved / Inactive Grievance Archives">
        <div className="mb-4">
          <input
            type="text"
            className="grv-search-input w-full"
            placeholder="Search archive history by ticket, category, subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="grv-empty">
            <i className="pi pi-history text-gray-300"></i>
            <p>
              No historical records matching the filter criteria were found.
            </p>
          </div>
        ) : (
          <table className="grv-table">
            <thead>
              <tr>
                <th>Ticket No.</th>
                <th>Category</th>
                <th>Subject Petition</th>
                <th>Date Lodged</th>
                <th>Resolution Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="font-mono font-bold text-blue-600">
                    {c.ticketNo}
                  </td>
                  <td>{c.category}</td>
                  <td>{c.subject}</td>
                  <td>{c.submittedDate}</td>
                  <td>{c.resolvedDate || c.closedDate || '—'}</td>
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
                        navigate(grvUrls.student.details, {
                          state: { complaintId: c.id },
                        })
                      }
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2 py-1 rounded"
                    >
                      Audit View
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
