import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, Tabs } from 'shared/new-components';
import { incidents } from '../../mocks';
import '../../super-admin/pages/Dashboard.css';
import { smsUrls } from '../../urls';

type ReportTab = 'summary' | 'priority' | 'monthly' | 'pending' | 'closed';
const TABS = [
  { label: 'Summary', key: 'summary' },
  { label: 'Priority Wise', key: 'priority' },
  { label: 'Monthly', key: 'monthly' },
  { label: 'Pending', key: 'pending' },
  { label: 'Closed', key: 'closed' },
];

const mockExport = (type: string) =>
  ToastService.success(`Exporting ${type} report...`);
const ExportBar = ({ label }: { label: string }) => (
  <div className="flex gap-3 mb-4">
    <Button
      label="Export PDF"
      icon="file-pdf"
      variant="outlined"
      size="small"
      onClick={() => mockExport(`${label} PDF`)}
    />
    <Button
      label="Export Excel"
      icon="file-excel"
      variant="outlined"
      size="small"
      onClick={() => mockExport(`${label} Excel`)}
    />
  </div>
);

const ReportTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        {headers.map(h => (
          <th
            key={h}
            style={{
              fontSize: '0.688rem',
              fontWeight: 600,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              textAlign: 'left',
              padding: '0.5rem 0.75rem',
              borderBottom: '2px solid #f3f4f6',
            }}
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, idx) => (
        <tr key={idx} style={{ borderBottom: '1px solid #f9fafb' }}>
          {row.map((cell, cidx) => (
            <td
              key={cidx}
              style={{
                padding: '0.625rem 0.75rem',
                fontSize: '0.813rem',
                color: '#374151',
              }}
            >
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default function SecurityAdminReports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('summary');

  return (
    <FormPage
      title="Security Reports"
      description="Generate incident reports and track security performance metrics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Security Admin', to: smsUrls.securityAdmin.portal },
        { label: 'Reports' },
      ]}
    >
      <FormCard>
        <Tabs
          tabs={TABS.map(t => ({ title: t.label, content: <></> }))}
          activeIndex={TABS.findIndex(t => t.key === activeTab)}
          onTabChange={e => setActiveTab(TABS[e.index].key as ReportTab)}
        />
        <div style={{ marginTop: '1.25rem' }}>
          {activeTab === 'summary' && (
            <>
              <ExportBar label="Summary" />
              <ReportTable
                headers={[
                  '#',
                  'Incident ID',
                  'Category',
                  'Priority',
                  'Assigned To',
                  'Status',
                  'Date',
                ]}
                rows={incidents.map((i, idx) => [
                  String(idx + 1),
                  i.incidentId,
                  i.category,
                  i.priority,
                  i.assignedTo,
                  i.status,
                  i.reportedDate,
                ])}
              />
            </>
          )}
          {activeTab === 'priority' && (
            <>
              <ExportBar label="Priority Wise" />
              <ReportTable
                headers={['Priority', 'Total', 'Open', 'Resolved', 'Closed']}
                rows={[
                  ['Critical', '2', '1', '0', '1'],
                  ['High', '2', '0', '1', '1'],
                  ['Medium', '1', '1', '0', '0'],
                  ['Low', '1', '0', '1', '0'],
                ]}
              />
            </>
          )}
          {activeTab === 'monthly' && (
            <>
              <ExportBar label="Monthly" />
              <ReportTable
                headers={['Month', 'Total', 'Resolved', 'Pending']}
                rows={[
                  ['Jan', '4', '2', '2'],
                  ['Feb', '7', '5', '2'],
                  ['Mar', '3', '3', '0'],
                  ['Apr', '9', '6', '3'],
                  ['May', '5', '4', '1'],
                  ['Jun', '6', '2', '4'],
                ]}
              />
            </>
          )}
          {activeTab === 'pending' && (
            <>
              <ExportBar label="Pending" />
              <ReportTable
                headers={[
                  '#',
                  'Incident ID',
                  'Category',
                  'Priority',
                  'Status',
                  'Days Open',
                ]}
                rows={incidents
                  .filter(i => i.status !== 'Closed')
                  .map((i, idx) => [
                    String(idx + 1),
                    i.incidentId,
                    i.category,
                    i.priority,
                    i.status,
                    '2',
                  ])}
              />
            </>
          )}
          {activeTab === 'closed' && (
            <>
              <ExportBar label="Closed" />
              <ReportTable
                headers={['#', 'Incident ID', 'Category', 'Resolution']}
                rows={incidents
                  .filter(i => i.status === 'Closed' || i.status === 'Resolved')
                  .map((i, idx) => [
                    String(idx + 1),
                    i.incidentId,
                    i.category,
                    i.resolutionNotes || '—',
                  ])}
              />
            </>
          )}
        </div>
      </FormCard>
    </FormPage>
  );
}
