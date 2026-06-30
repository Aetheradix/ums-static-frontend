import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, Tabs } from 'shared/new-components';
import {
  certificates,
  trainers,
  trainingAttendance,
  trainingPrograms,
} from '../../mocks';
import { tdmUrls } from '../../urls';

type ReportTab =
  | 'master'
  | 'trainer'
  | 'attendance'
  | 'certificate'
  | 'budget'
  | 'audit';

const TABS = [
  { label: 'Training Master', key: 'master' },
  { label: 'Trainer Performance', key: 'trainer' },
  { label: 'Attendance', key: 'attendance' },
  { label: 'Certificates', key: 'certificate' },
  { label: 'Budget', key: 'budget' },
  { label: 'Audit', key: 'audit' },
];

const mockExport = (type: string) => {
  ToastService.success(`Exporting ${type} report... (simulated)`);
};

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('master');

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

  const Table = ({
    headers,
    rows,
  }: {
    headers: string[];
    rows: string[][];
  }) => (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}
      >
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
                  letterSpacing: '0.05em',
                  padding: '0.5rem 0.75rem',
                  borderBottom: '1px solid #e5e7eb',
                  textAlign: 'left',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    fontSize: '0.813rem',
                    padding: '0.625rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
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
    </div>
  );

  return (
    <FormPage
      title="Training Reports & Analytics"
      description="Generate, export and print comprehensive reports for NAAC/AICTE compliance."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Reports' },
      ]}
    >
      <FormCard>
        <Tabs
          tabs={TABS.map(t => ({ title: t.label, content: <></> }))}
          activeIndex={TABS.findIndex(t => t.key === activeTab)}
          onTabChange={e => setActiveTab(TABS[e.index].key as ReportTab)}
        />
        <div style={{ marginTop: '1.5rem' }}>
          {activeTab === 'master' && (
            <>
              <ExportBar label="Training Master" />
              <Table
                headers={[
                  '#',
                  'Programme Title',
                  'Category',
                  'Mode',
                  'Start Date',
                  'End Date',
                  'Trainer',
                  'Status',
                ]}
                rows={trainingPrograms.map((p, i) => [
                  String(i + 1),
                  p.title,
                  p.category,
                  p.mode,
                  p.startDate,
                  p.endDate,
                  p.trainer,
                  p.status,
                ])}
              />
            </>
          )}

          {activeTab === 'trainer' && (
            <>
              <ExportBar label="Trainer Performance" />
              <Table
                headers={[
                  '#',
                  'Trainer Name',
                  'Department',
                  'Type',
                  'Sessions',
                  'Rating',
                  'Certifications',
                ]}
                rows={trainers.map((t, i) => [
                  String(i + 1),
                  t.name,
                  t.department,
                  t.trainerType,
                  String(t.totalSessions),
                  `${t.rating.toFixed(1)} / 5.0`,
                  String(t.certifications.length),
                ])}
              />
            </>
          )}

          {activeTab === 'attendance' && (
            <>
              <ExportBar label="Attendance" />
              <Table
                headers={[
                  '#',
                  'Participant',
                  'Department',
                  'Training Programme',
                  'Date',
                  'Punch In',
                  'Punch Out',
                  'Status',
                ]}
                rows={trainingAttendance.map((a, i) => [
                  String(i + 1),
                  a.participantName,
                  a.department,
                  a.trainingTitle,
                  a.date,
                  a.punchIn,
                  a.punchOut,
                  a.status,
                ])}
              />
            </>
          )}

          {activeTab === 'certificate' && (
            <>
              <ExportBar label="Certificate Registry" />
              <Table
                headers={[
                  '#',
                  'Certificate No',
                  'Participant',
                  'Programme',
                  'Issue Date',
                  'Type',
                  'Status',
                ]}
                rows={certificates.map((c, i) => [
                  String(i + 1),
                  c.certificateNo,
                  c.participantName,
                  c.trainingTitle,
                  c.issueDate,
                  c.type,
                  c.status,
                ])}
              />
            </>
          )}

          {activeTab === 'budget' && (
            <>
              <ExportBar label="Budget & Expenses" />
              <Table
                headers={[
                  '#',
                  'Training Programme',
                  'Category',
                  'Mode',
                  'Estimated Budget',
                  'Approval Status',
                  'Approved By',
                ]}
                rows={trainingPrograms
                  .filter(p => p.budget && p.budget > 0)
                  .map((p, i) => [
                    String(i + 1),
                    p.title,
                    p.category,
                    p.mode,
                    `₹${p.budget.toLocaleString()}`,
                    p.approvalStatus,
                    p.approvedBy || '—',
                  ])}
              />
            </>
          )}

          {activeTab === 'audit' && (
            <>
              <ExportBar label="Audit" />
              <Table
                headers={[
                  '#',
                  'Date',
                  'Action',
                  'Performed By',
                  'Module',
                  'Record',
                  'Details',
                ]}
                rows={[
                  [
                    '1',
                    '26 Jun 2024 10:15',
                    'Approved Budget',
                    'Finance Officer',
                    'Budget Approval',
                    'REQ-2024-001',
                    'Approved ₹45,000 for Python Workshop',
                  ],
                  [
                    '2',
                    '25 Jun 2024 14:30',
                    'Generated Certificates',
                    'Admin',
                    'Certificate Mgmt',
                    'AI FDP',
                    'Bulk generated 45 certificates',
                  ],
                  [
                    '3',
                    '25 Jun 2024 11:00',
                    'Registered Trainer',
                    'Admin',
                    'Trainer Master',
                    'Dr. Ramesh Kumar',
                    'New external trainer added',
                  ],
                  [
                    '4',
                    '24 Jun 2024 16:00',
                    'Scheduled Session',
                    'Training Coord',
                    'Training Schedule',
                    'SES-2024-012',
                    'Session rescheduled to 25 Jun',
                  ],
                  [
                    '5',
                    '23 Jun 2024 10:30',
                    'Feedback Exported',
                    'Admin',
                    'Feedback Mgmt',
                    'Leadership Workshop',
                    'Exported feedback to Excel',
                  ],
                  [
                    '6',
                    '22 Jun 2024 08:45',
                    'Attendance Marked',
                    'System',
                    'Attendance Mgmt',
                    'Cloud Computing',
                    'Auto-sync from QR scans completed',
                  ],
                ]}
              />
            </>
          )}
        </div>
      </FormCard>
    </FormPage>
  );
}
