import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import ApprovalTimeline, {
  type TimelineStep,
} from '../../shared/ApprovalTimeline';
import {
  type LeaveApplication,
  leaveApplications as initialData,
} from '../../mocks';
import { lmsUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'view'; item: LeaveApplication }
  | { mode: 'approve'; item: LeaveApplication }
  | { mode: 'reject'; item: LeaveApplication };

const getStatusVariant = (status: string) => {
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

const buildTimeline = (app: LeaveApplication): TimelineStep[] => {
  const steps: TimelineStep[] = [
    {
      actor: app.applicant,
      role: app.role,
      action: 'submitted',
      date: app.appliedDate,
      remarks: app.reason,
    },
  ];
  if (app.status === 'Approved') {
    steps.push({
      actor: app.currentApprover,
      role: 'Approver',
      action: 'approved',
      date: app.fromDate,
      remarks: app.remarks,
    });
  } else if (app.status === 'Rejected') {
    steps.push({
      actor: app.currentApprover,
      role: 'Approver',
      action: 'rejected',
      date: app.fromDate,
      remarks: app.remarks ?? 'Rejected by approver.',
    });
  } else if (app.status === 'Forwarded') {
    steps.push({
      actor: app.currentApprover,
      role: 'Approver',
      action: 'forwarded',
      date: app.fromDate,
    });
  } else {
    steps.push({
      actor: app.currentApprover,
      role: 'Approver',
      action: 'pending',
      date: '—',
    });
  }
  return steps;
};

export default function LeaveRequests() {
  const [data, setData] = useState<LeaveApplication[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [remarks, setRemarks] = useState('');

  const handleApprove = () => {
    if (popup.mode !== 'approve') return;
    setData(prev =>
      prev.map(d =>
        d.id === popup.item.id ? { ...d, status: 'Approved', remarks } : d
      )
    );
    ToastService.success(`Leave approved for ${popup.item.applicant}`);
    setPopup({ mode: 'closed' });
    setRemarks('');
  };

  const handleReject = () => {
    if (popup.mode !== 'reject') return;
    if (!remarks.trim()) {
      ToastService.error('Remarks are required for rejection.');
      return;
    }
    setData(prev =>
      prev.map(d =>
        d.id === popup.item.id ? { ...d, status: 'Rejected', remarks } : d
      )
    );
    ToastService.error(`Leave rejected for ${popup.item.applicant}`);
    setPopup({ mode: 'closed' });
    setRemarks('');
  };

  const viewItem = popup.mode === 'view' ? popup.item : null;
  const actionItem =
    popup.mode === 'approve' || popup.mode === 'reject' ? popup.item : null;

  return (
    <FormPage
      title="Leave Requests"
      description="Review and manage all employee and student leave applications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
        { label: 'Leave Requests' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'appNo', header: 'App No.' },
            { field: 'applicant', header: 'Applicant' },
            { field: 'role', header: 'Role' },
            { field: 'department', header: 'Department' },
            { field: 'leaveType', header: 'Leave Type' },
            {
              field: 'days',
              header: 'Duration',
              cell: (item: LeaveApplication) => (
                <span>
                  {item.fromDate} – {item.toDate} ({item.days}d)
                </span>
              ),
            },
            { field: 'appliedDate', header: 'Applied' },
            { field: 'currentApprover', header: 'Approver' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: LeaveApplication) => (
                <StatusBadge
                  label={item.status}
                  variant={getStatusVariant(item.status)}
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
                    <>
                      <Button
                        size="small"
                        label=""
                        icon="check"
                        variant="primary"
                        onClick={() => {
                          setRemarks('');
                          setPopup({ mode: 'approve', item });
                        }}
                      />
                      <Button
                        size="small"
                        label=""
                        icon="times"
                        variant="danger"
                        onClick={() => {
                          setRemarks('');
                          setPopup({ mode: 'reject', item });
                        }}
                      />
                    </>
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search applications..."
        />
      </FormCard>

      {/* View Popup */}
      {viewItem && (
        <FormPopup
          visible={popup.mode === 'view'}
          onHide={() => setPopup({ mode: 'closed' })}
          title={`Leave Application — ${viewItem.appNo}`}
          subtitle={`${viewItem.applicant} · ${viewItem.department}`}
          size="xl"
        >
          <FormGrid columns={3}>
            <div>
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Leave Type
              </p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {viewItem.leaveType}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Duration
              </p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {viewItem.fromDate} — {viewItem.toDate} ({viewItem.days} days)
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Applied Date
              </p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {viewItem.appliedDate}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '0.688rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Role
              </p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {viewItem.role}
              </p>
            </div>
            {viewItem.enrollmentNo && (
              <div>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: '#9ca3af',
                    marginBottom: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Enrollment No.
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {viewItem.enrollmentNo}
                </p>
              </div>
            )}
            {viewItem.attendancePct !== undefined && (
              <div>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: '#9ca3af',
                    marginBottom: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Attendance %
                </p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: viewItem.attendancePct >= 75 ? '#16a34a' : '#ef4444',
                  }}
                >
                  {viewItem.attendancePct}%
                </p>
              </div>
            )}
          </FormGrid>
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: 8,
              border: '1px solid #f3f4f6',
            }}
          >
            <p
              style={{
                fontSize: '0.688rem',
                color: '#9ca3af',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Reason
            </p>
            <p style={{ fontSize: '0.813rem', color: '#374151' }}>
              {viewItem.reason}
            </p>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <p
              style={{
                fontSize: '0.813rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                color: '#374151',
              }}
            >
              Approval Timeline
            </p>
            <ApprovalTimeline steps={buildTimeline(viewItem)} />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            {viewItem.status === 'Pending' && (
              <>
                <Button
                  label="Reject"
                  variant="danger"
                  icon="times"
                  onClick={() => {
                    setRemarks('');
                    setPopup({ mode: 'reject', item: viewItem });
                  }}
                />
                <Button
                  label="Approve"
                  variant="primary"
                  icon="check"
                  onClick={() => {
                    setRemarks('');
                    setPopup({ mode: 'approve', item: viewItem });
                  }}
                />
              </>
            )}
            <Button
              label="Close"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
          </div>
        </FormPopup>
      )}

      {/* Approve/Reject Popup */}
      {actionItem && (
        <FormPopup
          visible={popup.mode === 'approve' || popup.mode === 'reject'}
          onHide={() => setPopup({ mode: 'closed' })}
          title={
            popup.mode === 'approve'
              ? 'Approve Leave Request'
              : 'Reject Leave Request'
          }
          subtitle={`${actionItem.applicant} — ${actionItem.leaveType} (${actionItem.days} days)`}
        >
          <TextArea
            label="Remarks"
            placeholder={
              popup.mode === 'approve'
                ? 'Optional remarks...'
                : 'Please state the reason for rejection (required)'
            }
            value={remarks}
            onChange={setRemarks}
            rows={3}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            {popup.mode === 'approve' ? (
              <Button
                label="Confirm Approval"
                variant="primary"
                icon="check"
                onClick={handleApprove}
              />
            ) : (
              <Button
                label="Confirm Rejection"
                variant="danger"
                icon="times"
                onClick={handleReject}
              />
            )}
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
