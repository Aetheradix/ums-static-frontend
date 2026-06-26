import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, Tabs } from 'shared/new-components';
import { departments, employees, leaveApplications } from '../../mocks';
import { lmsUrls } from '../../urls';

type ReportTab = 'employee' | 'student' | 'department' | 'attendance' | 'balance' | 'ltc' | 'audit';

const TABS = [
  { label: 'Employee Leave', key: 'employee' },
  { label: 'Student Leave', key: 'student' },
  { label: 'Department', key: 'department' },
  { label: 'Attendance', key: 'attendance' },
  { label: 'Leave Balance', key: 'balance' },
  { label: 'LTC', key: 'ltc' },
  { label: 'Audit', key: 'audit' },
];

const mockExport = (type: string) => {
  ToastService.success(`Exporting ${type} report... (simulated)`);
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('employee');

  const employeeLeave = leaveApplications.filter(a => a.role === 'Teacher');
  const studentLeave = leaveApplications.filter(a => a.role === 'Student');

  const ExportBar = ({ label }: { label: string }) => (
    <div className="flex gap-3 mb-4">
      <Button label="Export PDF" icon="file-pdf" variant="outlined" size="small" onClick={() => mockExport(`${label} PDF`)} />
      <Button label="Export Excel" icon="file-excel" variant="outlined" size="small" onClick={() => mockExport(`${label} Excel`)} />
      <Button label="Print" icon="print" variant="outlined" size="small" onClick={() => mockExport(`${label} Print`)} />
    </div>
  );

  const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>{headers.map(h => <th key={h} style={{ fontSize: '0.688rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => <td key={j} style={{ fontSize: '0.813rem', padding: '0.625rem 0.75rem', borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <FormPage
      title="Reports & Analytics"
      description="Generate, view and export leave, attendance, and LTC reports."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
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
          {activeTab === 'employee' && (
            <>
              <ExportBar label="Employee Leave" />
              <Table
                headers={['#', 'Employee', 'Department', 'Leave Type', 'From', 'To', 'Days', 'Status']}
                rows={employeeLeave.map((a, i) => [
                  String(i + 1), a.applicant, a.department, a.leaveType,
                  a.fromDate, a.toDate, String(a.days), a.status,
                ])}
              />
            </>
          )}

          {activeTab === 'student' && (
            <>
              <ExportBar label="Student Leave" />
              <Table
                headers={['#', 'Student', 'Enrollment', 'Course', 'Leave Type', 'Days', 'Status', 'Attendance %']}
                rows={studentLeave.map((a, i) => [
                  String(i + 1), a.applicant, a.enrollmentNo ?? '—', a.course ?? '—',
                  a.leaveType, String(a.days), a.status, `${a.attendancePct ?? '—'}%`,
                ])}
              />
            </>
          )}

          {activeTab === 'department' && (
            <>
              <ExportBar label="Department" />
              <Table
                headers={['#', 'Department', 'Total Applications', 'Approved', 'Rejected', 'Pending', 'Approval %']}
                rows={departments.slice(0, 12).map((d, i) => {
                  const apps = leaveApplications.filter(a => a.department === d);
                  const total = apps.length || (i % 5) + 2;
                  const approved = Math.floor(total * 0.6);
                  const rejected = Math.floor(total * 0.15);
                  const pending = total - approved - rejected;
                  return [String(i + 1), d, String(total), String(approved), String(rejected), String(pending), `${Math.round((approved / total) * 100)}%`];
                })}
              />
            </>
          )}

          {activeTab === 'attendance' && (
            <>
              <ExportBar label="Attendance" />
              <Table
                headers={['#', 'Employee', 'Department', 'Present Days', 'Absent Days', 'Leave Days', 'Late Days', 'Attendance %']}
                rows={employees.map((e, i) => {
                  const present = 18 + (i % 3);
                  const absent = 1 + (i % 2);
                  const leave = i % 3;
                  const late = i % 2;
                  const total = present + absent + leave;
                  return [String(i + 1), e.name, e.department, String(present), String(absent), String(leave), String(late), `${Math.round((present / total) * 100)}%`];
                })}
              />
            </>
          )}

          {activeTab === 'balance' && (
            <>
              <ExportBar label="Leave Balance" />
              <Table
                headers={['#', 'Employee', 'Department', 'CL Balance', 'ML Balance', 'EL Balance', 'HPL Balance']}
                rows={employees.map((e, i) => [
                  String(i + 1), e.name, e.department,
                  String(e.leaveBalance.casual), String(e.leaveBalance.medical),
                  String(e.leaveBalance.earned), String(e.leaveBalance.halfPay),
                ])}
              />
            </>
          )}

          {activeTab === 'ltc' && (
            <>
              <ExportBar label="LTC" />
              <Table
                headers={['#', 'Employee', 'Department', 'Journey Type', 'Destination', 'Travel Date', 'Claim Amount', 'Status']}
                rows={[
                  ['1', 'Dr. Rajesh Kumar', 'Computer Science', 'Domestic', 'Mumbai → Delhi', '15 May 2024', '₹45,000', 'Approved'],
                  ['2', 'Prof. Anil Verma', 'Physics', 'Domestic', 'Bangalore → Chennai', '10 Apr 2024', '₹12,000', 'Pending'],
                  ['3', 'Dr. Kavitha Nair', 'MBA', 'Domestic', 'Delhi → Jaipur', '20 Mar 2024', '₹28,000', 'Approved'],
                  ['4', 'Dr. Sunita Rao', 'Chemistry', 'International', 'India → Singapore', '14 Feb 2024', '₹1,25,000', 'Rejected'],
                  ['5', 'Prof. Suresh Pillai', 'Civil Engineering', 'Domestic', 'Hyderabad → Mysore', '1 Jun 2024', '₹18,000', 'Pending'],
                  ['6', 'Dr. Anitha Menon', 'Biotechnology', 'Domestic', 'Pune → Goa', '25 Jan 2024', '₹35,000', 'Approved'],
                ]}
              />
            </>
          )}

          {activeTab === 'audit' && (
            <>
              <ExportBar label="Audit" />
              <Table
                headers={['#', 'Date', 'Action', 'Performed By', 'Module', 'Record', 'Details']}
                rows={[
                  ['1', '26 Jun 2024 09:15', 'Approved Leave', 'Dr. Rajesh Kumar', 'Leave Requests', 'LMS-2024-0001', 'Student leave approved'],
                  ['2', '25 Jun 2024 14:30', 'Created Leave Type', 'Admin', 'Leave Types', 'Compensatory Off', 'New leave type added'],
                  ['3', '25 Jun 2024 11:00', 'Rejected Leave', 'Prof. Suresh Pillai', 'Leave Requests', 'LMS-2024-0005', 'Low attendance'],
                  ['4', '24 Jun 2024 16:00', 'Updated Policy', 'Admin', 'Leave Policy', 'Faculty Policy 2024', 'Max days updated to 42'],
                  ['5', '23 Jun 2024 10:30', 'LTC Approved', 'Registrar', 'LTC Management', 'LTC-001', 'Approved ₹45,000 claim'],
                  ['6', '22 Jun 2024 08:45', 'Attendance Sync', 'System', 'Biometric', 'All Employees', 'Daily sync completed'],
                ]}
              />
            </>
          )}
        </div>
      </FormCard>
    </FormPage>
  );
}
