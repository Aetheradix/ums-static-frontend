import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { auditLogs } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AdminAuditLogs() {
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const filtered = auditLogs.filter(log => {
    const matchesSearch =
      log.performedBy.toLowerCase().includes(search.toLowerCase()) ||
      (log.ticketNo &&
        log.ticketNo.toLowerCase().includes(search.toLowerCase())) ||
      log.action.toLowerCase().includes(search.toLowerCase());

    const matchesAction =
      selectedAction === 'ALL' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const handleExport = () => {
    ToastService.success(
      'Exporting permanent audit trail ledger... (eOffice RTI format)'
    );
  };

  const actionTypes = [
    'ALL',
    'Complaint Submitted',
    'Auto Assignment',
    'Notesheet Created',
    'Status Changed',
    'SLA Breach Auto-Escalate',
    'Complaint Resolved',
    'User Login',
    'SLA Rule Modified',
    'Appeal Filed',
    'UGC Sync Initiated',
  ];

  return (
    <FormPage
      title="RTI Audit Trail Logs"
      description="UGC-compliant permanent registry of system configuration updates, workflow routes, and security credentials access."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'Audit Logs' },
      ]}
    >
      <div className="flex gap-2 mb-4">
        <Button
          label="Export Compliance PDF Ledger"
          icon="file-pdf"
          variant="outlined"
          size="small"
          onClick={handleExport}
        />
      </div>

      <div className="grv-filters-row">
        <input
          type="text"
          className="grv-search-input"
          placeholder="Search by user, ticket, keyword..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="grv-filter-select"
          value={selectedAction}
          onChange={e => setSelectedAction(e.target.value)}
        >
          {actionTypes.map(act => (
            <option key={act} value={act}>
              {act}
            </option>
          ))}
        </select>
      </div>

      <FormCard title="System Audit Logs Trails" icon="history_edu">
        {filtered.length === 0 ? (
          <div className="grv-empty">
            <i className="pi pi-shield text-gray-300"></i>
            <p>
              No audit trail logs matching your search parameters were found.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map(log => (
              <div key={log.id} className="grv-audit-row">
                <div className="grv-audit-time">
                  {log.date} @ {log.time}
                </div>
                <div className="grv-audit-action">
                  <span className="font-bold text-slate-800">{log.action}</span>
                  {log.ticketNo && (
                    <span className="ml-2 font-mono text-[10px] font-bold text-blue-600">
                      ({log.ticketNo})
                    </span>
                  )}
                  {log.newValue && (
                    <span className="ml-2 text-[10px] text-indigo-600 bg-slate-50 border border-slate-200 px-1 py-0.5 rounded font-mono">
                      Change: {log.oldValue || 'N/A'} → {log.newValue}
                    </span>
                  )}
                </div>
                <div className="grv-audit-user">
                  <span className="font-bold block">{log.performedBy}</span>
                  <span className="text-[10px] text-slate-400 block">
                    {log.role} · IP: {log.ipAddress}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </FormCard>
    </FormPage>
  );
}
