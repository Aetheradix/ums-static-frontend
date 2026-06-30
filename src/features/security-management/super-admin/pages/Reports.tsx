import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, Tabs } from 'shared/new-components';
import { incidents } from '../../mocks';
import { smsUrls } from '../../urls';
import './Dashboard.css';

type ReportTab =
  | 'summary'
  | 'category'
  | 'department'
  | 'priority'
  | 'monthly'
  | 'pending'
  | 'closed';

const TABS = [
  { label: 'Incident Summary', key: 'summary' },
  { label: 'Category Wise', key: 'category' },
  { label: 'Department Wise', key: 'department' },
  { label: 'Priority Wise', key: 'priority' },
  { label: 'Monthly Report', key: 'monthly' },
  { label: 'Pending Incidents', key: 'pending' },
  { label: 'Closed Incidents', key: 'closed' },
];

const mockExport = (type: string) =>
  ToastService.success(`Exporting ${type} report... (simulated)`);

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
    <Button
      label="Print"
      icon="print"
      variant="outlined"
      size="small"
      onClick={() => mockExport(`${label} Print`)}
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

export default function SuperAdminReports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('summary');

  const categoryData = [
    ['Harassment', '2', '1 Resolved', '1 Active'],
    ['Theft & Robbery', '1', '1 Resolved', '0 Active'],
    ['Cyber Security', '1', '0 Resolved', '1 Active'],
    ['Fire & Safety', '1', '1 Closed', '0 Active'],
    ['Physical Security', '1', '0 Resolved', '1 Active'],
  ];

  const deptData = [
    ['Computer Science', '1', '1 Closed', '0 Pending'],
    ['Physics', '1', '1 Resolved', '0 Pending'],
    ['Chemistry', '1', '0 Resolved', '1 Active'],
    ['Mechanical Engg.', '1', '0 Resolved', '1 Active'],
    ['Electronics', '1', '0 Resolved', '1 Active'],
    ['Administration', '1', '1 Closed', '0 Pending'],
  ];

  const monthlyData = [
    ['January 2024', '4', '2', '2'],
    ['February 2024', '7', '5', '2'],
    ['March 2024', '3', '3', '0'],
    ['April 2024', '9', '6', '3'],
    ['May 2024', '5', '4', '1'],
    ['June 2024', '6', '2', '4'],
  ];

  return (
    <FormPage
      title="Security Reports"
      description="Generate comprehensive security incident reports and analytics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
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
              <ExportBar label="Incident Summary" />
              <ReportTable
                headers={[
                  '#',
                  'Incident ID',
                  'Category',
                  'Reported By',
                  'Location',
                  'Priority',
                  'Status',
                  'Date',
                ]}
                rows={incidents.map((i, idx) => [
                  String(idx + 1),
                  i.incidentId,
                  i.category,
                  i.reportedBy,
                  i.location,
                  i.priority,
                  i.status,
                  i.reportedDate,
                ])}
              />
            </>
          )}
          {activeTab === 'category' && (
            <>
              <ExportBar label="Category Wise" />
              <ReportTable
                headers={['Category', 'Total', 'Resolved', 'Active']}
                rows={categoryData}
              />
            </>
          )}
          {activeTab === 'department' && (
            <>
              <ExportBar label="Department Wise" />
              <ReportTable
                headers={[
                  'Department',
                  'Total Incidents',
                  'Resolved',
                  'Pending',
                ]}
                rows={deptData}
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
                headers={['Month', 'Total Incidents', 'Resolved', 'Pending']}
                rows={monthlyData}
              />
            </>
          )}
          {activeTab === 'pending' && (
            <>
              <ExportBar label="Pending Incidents" />
              <ReportTable
                headers={[
                  '#',
                  'Incident ID',
                  'Category',
                  'Priority',
                  'Status',
                  'Reported Date',
                  'Assigned To',
                ]}
                rows={incidents
                  .filter(i => i.status !== 'Closed' && i.status !== 'Resolved')
                  .map((i, idx) => [
                    String(idx + 1),
                    i.incidentId,
                    i.category,
                    i.priority,
                    i.status,
                    i.reportedDate,
                    i.assignedTo,
                  ])}
              />
            </>
          )}
          {activeTab === 'closed' && (
            <>
              <ExportBar label="Closed Incidents" />
              <ReportTable
                headers={[
                  '#',
                  'Incident ID',
                  'Category',
                  'Priority',
                  'Resolution Notes',
                  'Date',
                ]}
                rows={incidents
                  .filter(i => i.status === 'Closed' || i.status === 'Resolved')
                  .map((i, idx) => [
                    String(idx + 1),
                    i.incidentId,
                    i.category,
                    i.priority,
                    i.resolutionNotes || '—',
                    i.reportedDate,
                  ])}
              />
            </>
          )}
        </div>
      </FormCard>
    </FormPage>
  );
}
