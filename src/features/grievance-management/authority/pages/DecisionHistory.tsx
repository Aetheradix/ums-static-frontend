import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AuthorityDecisionHistory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const historyList = complaints.filter(
    c =>
      c.status === 'Closed' ||
      c.status === 'Resolved' ||
      c.status === 'Rejected'
  );

  const filtered = historyList.filter(
    c =>
      c.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormPage
      title="Statutory Decision History"
      description="Permanent ledger record of all final decision orders and digital signatures logged by your credentials."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Authority Portal', to: grvUrls.authority.portal },
        { label: 'Decision History' },
      ]}
    >
      <div className="flex gap-2 mb-4">
        <Button
          label="Export PDF Ledger"
          icon="file-pdf"
          variant="outlined"
          size="small"
          onClick={() =>
            ToastService.success(
              'Exporting permanent decision history PDF ledger...'
            )
          }
        />
        <Button
          label="Export CSV Audit"
          icon="file-excel"
          variant="outlined"
          size="small"
          onClick={() => ToastService.success('Exporting CSV audit report...')}
        />
      </div>

      <FormCard title="Appellate Decision Logs Registry" icon="history_edu">
        <div className="mb-4">
          <input
            type="text"
            className="grv-search-input w-full"
            placeholder="Search decision history registry by student, ticket no, subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="grv-empty">
            <i className="pi pi-history text-gray-300"></i>
            <p>No historical appellate decisions matched your filters.</p>
          </div>
        ) : (
          <table className="grv-table text-xs">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Student / Program</th>
                <th>Subject Petition</th>
                <th>Close Date</th>
                <th>Resolution Outcome</th>
                <th>Escalation Level</th>
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
                      {c.studentName}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.enrollmentNo || 'N/A'}
                    </span>
                  </td>
                  <td className="font-bold text-slate-700">{c.subject}</td>
                  <td>{c.closedDate || c.resolvedDate || '—'}</td>
                  <td>
                    <p className="italic max-w-sm line-clamp-2">
                      "{c.resolutionRemarks || 'Petition resolved/closed.'}"
                    </p>
                  </td>
                  <td>
                    <span className="font-bold text-slate-600">
                      Level {c.escalationLevel}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(grvUrls.authority.approvals)}
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
