import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import '../../Grievance.css';

type ReportTab = 'summary' | 'sla' | 'escalation' | 'closed';

export default function DepartmentReports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('summary');

  const mockExport = (format: string) => {
    ToastService.success(`Exporting report as ${format}...`);
  };

  return (
    <FormPage
      title="Department Grievance Reports"
      description="View analytics, resolution graphs, and compliance statistics for the Examination Department."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Department Portal', to: grvUrls.department.portal },
        { label: 'Reports' },
      ]}
    >
      {/* Export Bar */}
      <div className="flex gap-3 mb-4">
        <Button
          label="Export PDF"
          icon="file-pdf"
          variant="outlined"
          size="small"
          onClick={() => mockExport('PDF')}
        />
        <Button
          label="Export Excel"
          icon="file-excel"
          variant="outlined"
          size="small"
          onClick={() => mockExport('Excel')}
        />
        <Button
          label="Print Report"
          icon="print"
          variant="outlined"
          size="small"
          onClick={() => mockExport('Print')}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 mb-6">
        {[
          { key: 'summary', label: 'Summary Report' },
          { key: 'sla', label: 'SLA Compliance' },
          { key: 'escalation', label: 'Escalation Logs' },
          { key: 'closed', label: 'Archived / Closed' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === t.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Summary */}
      {activeTab === 'summary' && (
        <FormCard title="Petitions Summary (Current Academic Year)">
          <table className="grv-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Assigned</th>
                <th>Under Investigation</th>
                <th>Resolved</th>
                <th>Avg Resolution Time (Days)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Academic Grievance</td>
                <td>48</td>
                <td>8</td>
                <td>40</td>
                <td>3.2 Days</td>
              </tr>
              <tr>
                <td>Financial Grievance</td>
                <td>12</td>
                <td>2</td>
                <td>10</td>
                <td>2.1 Days</td>
              </tr>
              <tr>
                <td>Examination Grievance</td>
                <td>34</td>
                <td>6</td>
                <td>28</td>
                <td>1.8 Days</td>
              </tr>
            </tbody>
          </table>
        </FormCard>
      )}

      {/* Tab 2: SLA */}
      {activeTab === 'sla' && (
        <FormCard title="SLA Violation Report (By Category)">
          <table className="grv-table">
            <thead>
              <tr>
                <th>Urgency Level</th>
                <th>Total Resolved</th>
                <th>Within SLA Target</th>
                <th>SLA Violations</th>
                <th>SLA Success Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Critical</td>
                <td>15</td>
                <td>14</td>
                <td>1</td>
                <td>93.3%</td>
              </tr>
              <tr>
                <td>High</td>
                <td>38</td>
                <td>34</td>
                <td>4</td>
                <td>89.4%</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>25</td>
                <td>24</td>
                <td>1</td>
                <td>96.0%</td>
              </tr>
              <tr>
                <td>Low</td>
                <td>16</td>
                <td>16</td>
                <td>0</td>
                <td>100.0%</td>
              </tr>
            </tbody>
          </table>
        </FormCard>
      )}

      {/* Tab 3: Escalation */}
      {activeTab === 'escalation' && (
        <FormCard title="Auto-Escalated Ticket Track Logs">
          <table className="grv-table">
            <thead>
              <tr>
                <th>Ticket No</th>
                <th>Original Owner</th>
                <th>Escalated To</th>
                <th>Reason</th>
                <th>Escalation Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-red-600">GRV/DAVV/2025/00289</td>
                <td>Accounts Section</td>
                <td>Registrar Office</td>
                <td>SLA response window exceeded 48 hours.</td>
                <td>L3 (Registrar review)</td>
              </tr>
              <tr>
                <td className="font-bold text-red-600">GRV/DAVV/2025/00201</td>
                <td>Hostel Warden</td>
                <td>Anti-Ragging Chief Warden</td>
                <td>Critical safety trigger timeline breach.</td>
                <td>L2 (Warden review)</td>
              </tr>
            </tbody>
          </table>
        </FormCard>
      )}

      {/* Tab 4: Closed */}
      {activeTab === 'closed' && (
        <FormCard title="Settled Grievance Archives">
          <table className="grv-table">
            <thead>
              <tr>
                <th>Ticket No</th>
                <th>Resolution Outcome</th>
                <th>Feedback Rating</th>
                <th>Settlement Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">GRV/DAVV/2025/00178</td>
                <td>SC scholarship processed via APBS and credited.</td>
                <td>⭐⭐⭐⭐⭐ Excellent</td>
                <td>4 days</td>
              </tr>
              <tr>
                <td className="font-bold">GRV/DAVV/2025/00067</td>
                <td>Convocation Ph.D. certificate dispatched via post.</td>
                <td>⭐⭐⭐⭐ Good</td>
                <td>9 days</td>
              </tr>
            </tbody>
          </table>
        </FormCard>
      )}
    </FormPage>
  );
}

const grvUrls = {
  portal: '/grievance-management',
  department: {
    portal: '/grievance-management/department',
    dashboard: '/grievance-management/department/dashboard',
    inbox: '/grievance-management/department/inbox',
    details: '/grievance-management/department/complaint-details',
    notesheet: '/grievance-management/department/notesheet',
    reports: '/grievance-management/department/reports',
  },
};
