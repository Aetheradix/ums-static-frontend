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

const MY_ENROLLMENT = 'CS2021001';
const myApps = leaveApplications.filter(a => a.enrollmentNo === MY_ENROLLMENT);

const buildTimeline = (app: LeaveApplication): TimelineStep[] => {
  const steps: TimelineStep[] = [
    {
      actor: app.applicant,
      role: 'Student',
      action: 'submitted',
      date: app.appliedDate,
      remarks: app.reason,
    },
  ];
  if (app.status === 'Approved') {
    steps.push({
      actor: 'Prof. Vijay Reddy',
      role: 'Class Teacher',
      action: 'approved',
      date: app.fromDate,
      remarks: 'Approved.',
    });
    steps.push({
      actor: 'Dr. Rajesh Kumar',
      role: 'HOD',
      action: 'approved',
      date: app.fromDate,
    });
  } else if (app.status === 'Rejected') {
    steps.push({
      actor: 'Prof. Vijay Reddy',
      role: 'Class Teacher',
      action: 'rejected',
      date: app.fromDate,
      remarks: app.remarks,
    });
  } else {
    steps.push({
      actor: 'Prof. Vijay Reddy',
      role: 'Class Teacher',
      action: 'pending',
      date: '—',
    });
  }
  return steps;
};

type PopupState = { mode: 'closed' } | { mode: 'view'; item: LeaveApplication };

export default function MyLeave() {
  const [data] = useState<LeaveApplication[]>(myApps);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

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
      description="View and track all your submitted leave requests."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Student Portal', to: lmsUrls.student.portal },
        { label: 'My Leave' },
      ]}
    >
      {data.length === 0 ? (
        <FormCard>
          <div
            style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}
          >
            <i
              className="pi pi-file"
              style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                display: 'block',
              }}
            />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>
              No leave applications yet
            </p>
            <p style={{ fontSize: '0.813rem', marginTop: 4 }}>
              Submit your first leave application to get started.
            </p>
          </div>
        </FormCard>
      ) : (
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
              {
                field: 'status',
                header: 'Teacher Status',
                cell: (item: LeaveApplication) => (
                  <StatusBadge
                    label={item.status}
                    variant={getVariant(item.status)}
                  />
                ),
              },
              {
                field: 'remarks',
                header: 'Admin Status',
                cell: (item: LeaveApplication) => (
                  <StatusBadge
                    label={item.status === 'Approved' ? 'Approved' : 'Pending'}
                    variant={
                      item.status === 'Approved' ? 'approved' : 'pending'
                    }
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
            searchPlaceholder="Search my applications..."
          />
        </FormCard>
      )}

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
              { label: 'Days', value: String(popup.item.days) },
              { label: 'Applied On', value: popup.item.appliedDate },
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
                marginBottom: 4,
              }}
            >
              REASON
            </p>
            <p style={{ fontSize: '0.813rem', color: '#374151' }}>
              {popup.item.reason}
            </p>
          </div>
          {popup.item.remarks && (
            <div
              style={{
                padding: '0.75rem',
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                borderRadius: 8,
                marginBottom: '1.25rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                }}
              >
                APPROVER REMARKS
              </p>
              <p style={{ fontSize: '0.813rem', color: '#c2410c' }}>
                {popup.item.remarks}
              </p>
            </div>
          )}
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
