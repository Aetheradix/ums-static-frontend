import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import ApprovalTimeline, {
  type TimelineStep,
} from '../../shared/ApprovalTimeline';
import { type LeaveApplication, leaveApplications } from '../../mocks';
import { lmsUrls } from '../../urls';

const MY_TEACHER = 'Prof. Vijay Reddy';

// Include teacher's own applications + add a few more for demo
const teacherApps: LeaveApplication[] = [
  ...leaveApplications.filter(a => a.applicant === MY_TEACHER),
  {
    id: 'T001',
    appNo: 'LMS-2024-T001',
    applicant: MY_TEACHER,
    role: 'Teacher',
    department: 'Computer Science',
    leaveType: 'Casual Leave',
    fromDate: '2024-05-15',
    toDate: '2024-05-16',
    days: 2,
    appliedDate: '2024-05-13',
    currentApprover: 'Dr. Rajesh Kumar',
    status: 'Approved',
    reason: 'Personal work',
    remarks: 'Approved.',
  },
  {
    id: 'T002',
    appNo: 'LMS-2024-T002',
    applicant: MY_TEACHER,
    role: 'Teacher',
    department: 'Computer Science',
    leaveType: 'Medical Leave',
    fromDate: '2024-04-08',
    toDate: '2024-04-10',
    days: 3,
    appliedDate: '2024-04-07',
    currentApprover: 'Dr. Rajesh Kumar',
    status: 'Approved',
    reason: 'Fever and cold',
    remarks: 'Get well soon.',
  },
  {
    id: 'T003',
    appNo: 'LMS-2024-T003',
    applicant: MY_TEACHER,
    role: 'Teacher',
    department: 'Computer Science',
    leaveType: 'Earned Leave',
    fromDate: '2024-03-25',
    toDate: '2024-03-28',
    days: 4,
    appliedDate: '2024-03-20',
    currentApprover: 'Dr. Rajesh Kumar',
    status: 'Rejected',
    reason: 'Family vacation',
    remarks: 'Critical exam period. Cannot approve.',
  },
];

const buildTimeline = (app: LeaveApplication): TimelineStep[] => {
  const steps: TimelineStep[] = [
    {
      actor: app.applicant,
      role: 'Teacher',
      action: 'submitted',
      date: app.appliedDate,
      remarks: app.reason,
    },
  ];
  if (app.status === 'Approved') {
    steps.push({
      actor: app.currentApprover,
      role: 'HOD',
      action: 'approved',
      date: app.fromDate,
      remarks: app.remarks,
    });
  } else if (app.status === 'Rejected') {
    steps.push({
      actor: app.currentApprover,
      role: 'HOD',
      action: 'rejected',
      date: app.fromDate,
      remarks: app.remarks,
    });
  } else {
    steps.push({
      actor: app.currentApprover,
      role: 'HOD',
      action: 'pending',
      date: '—',
    });
  }
  return steps;
};

type PopupState = { mode: 'closed' } | { mode: 'view'; item: LeaveApplication };

export default function MyApplications() {
  const [data, setData] = useState<LeaveApplication[]>(teacherApps);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleWithdraw = (item: LeaveApplication) => {
    setData(prev =>
      prev.map(d => (d.id === item.id ? { ...d, status: 'Withdrawn' } : d))
    );
    ToastService.success('Application withdrawn.');
  };

  const getVariant = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Pending':
        return 'pending';
      default:
        return 'neutral';
    }
  };

  return (
    <FormPage
      title="My Leave Applications"
      description="Track and manage your submitted leave requests."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Teacher Portal', to: lmsUrls.teacher.portal },
        { label: 'My Applications' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'appNo', header: 'App No.' },
            { field: 'leaveType', header: 'Leave Type' },
            {
              field: 'days',
              header: 'Duration',
              cell: (item: LeaveApplication) => (
                <span>
                  {item.fromDate} — {item.toDate} ({item.days}d)
                </span>
              ),
            },
            { field: 'appliedDate', header: 'Applied On' },
            { field: 'currentApprover', header: 'Approver' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: LeaveApplication) => (
                <StatusBadge
                  label={item.status}
                  variant={getVariant(item.status)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: LeaveApplication) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'view', item })}
                  />
                  {item.status === 'Pending' && (
                    <Button
                      size="small"
                      label="Withdraw"
                      icon="times"
                      variant="danger"
                      onClick={() => handleWithdraw(item)}
                    />
                  )}
                  <Button
                    size="small"
                    label=""
                    icon="print"
                    variant="outlined"
                    onClick={() =>
                      ToastService.success(`Printing ${item.appNo}...`)
                    }
                  />
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search applications..."
        />
      </FormCard>

      {popup.mode === 'view' && (
        <FormPopup
          visible
          onHide={() => setPopup({ mode: 'closed' })}
          title={`Application — ${popup.item.appNo}`}
          subtitle={`${popup.item.leaveType} · ${popup.item.days} days`}
          size="lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Leave Type', value: popup.item.leaveType },
              {
                label: 'Duration',
                value: `${popup.item.fromDate} — ${popup.item.toDate}`,
              },
              { label: 'Applied On', value: popup.item.appliedDate },
              { label: 'Current Approver', value: popup.item.currentApprover },
            ].map(f => (
              <div key={f.label}>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 4,
                  }}
                >
                  {f.label}
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {f.value}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: 8,
              marginBottom: '1.25rem',
            }}
          >
            <p
              style={{
                fontSize: '0.688rem',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 4,
              }}
            >
              Reason
            </p>
            <p style={{ fontSize: '0.813rem', color: '#374151' }}>
              {popup.item.reason}
            </p>
          </div>
          <p
            style={{
              fontSize: '0.813rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            Approval Timeline
          </p>
          <ApprovalTimeline steps={buildTimeline(popup.item)} />
          <div className="flex justify-end mt-4">
            <Button
              label="Close"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
