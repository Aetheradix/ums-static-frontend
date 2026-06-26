import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type LeaveApplication, leaveApplications } from '../../mocks';
import { lmsUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'approve'; item: LeaveApplication }
  | { mode: 'reject'; item: LeaveApplication }
  | { mode: 'view'; item: LeaveApplication };

const studentRequests = leaveApplications.filter(a => a.role === 'Student');

export default function StudentLeaveRequests() {
  const [data, setData] = useState<LeaveApplication[]>(studentRequests);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [remarks, setRemarks] = useState('');

  const handleApprove = () => {
    if (popup.mode !== 'approve') return;
    setData(prev =>
      prev.map(d =>
        d.id === popup.item.id ? { ...d, status: 'Approved', remarks } : d
      )
    );
    ToastService.success(`Approved leave for ${popup.item.applicant}`);
    setPopup({ mode: 'closed' });
    setRemarks('');
  };

  const handleReject = () => {
    if (popup.mode !== 'reject') return;
    if (!remarks.trim()) {
      ToastService.error('Remarks required for rejection.');
      return;
    }
    setData(prev =>
      prev.map(d =>
        d.id === popup.item.id ? { ...d, status: 'Rejected', remarks } : d
      )
    );
    ToastService.error(`Rejected leave for ${popup.item.applicant}`);
    setPopup({ mode: 'closed' });
    setRemarks('');
  };

  const viewItem = popup.mode === 'view' ? popup.item : null;
  const actionItem =
    popup.mode === 'approve' || popup.mode === 'reject' ? popup.item : null;

  return (
    <FormPage
      title="Student Leave Requests"
      description="Review and action student leave applications for your courses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Teacher Portal', to: lmsUrls.teacher.portal },
        { label: 'Student Leave Requests' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'applicant', header: 'Student Name' },
            { field: 'enrollmentNo', header: 'Enrollment No.' },
            { field: 'course', header: 'Course' },
            { field: 'semester', header: 'Semester' },
            {
              field: 'attendancePct',
              header: 'Attendance %',
              cell: (item: LeaveApplication) => (
                <span
                  style={{
                    fontWeight: 700,
                    color:
                      (item.attendancePct ?? 100) >= 75 ? '#16a34a' : '#ef4444',
                  }}
                >
                  {item.attendancePct ?? '—'}%
                </span>
              ),
            },
            { field: 'leaveType', header: 'Leave Type' },
            {
              field: 'days',
              header: 'Duration',
              cell: (item: LeaveApplication) => (
                <span>
                  {item.days}d ({item.fromDate})
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: LeaveApplication) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Approved'
                      ? 'approved'
                      : item.status === 'Rejected'
                        ? 'rejected'
                        : item.status === 'Pending'
                          ? 'pending'
                          : 'neutral'
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
          searchPlaceholder="Search student requests..."
        />
      </FormCard>

      {/* View Popup */}
      {viewItem && (
        <FormPopup
          visible={popup.mode === 'view'}
          onHide={() => setPopup({ mode: 'closed' })}
          title={`Leave Request — ${viewItem.applicant}`}
          subtitle={`${viewItem.enrollmentNo} · ${viewItem.course} · ${viewItem.semester}`}
          size="lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Leave Type', value: viewItem.leaveType },
              { label: 'From Date', value: viewItem.fromDate },
              { label: 'To Date', value: viewItem.toDate },
              { label: 'Days', value: String(viewItem.days) },
              { label: 'Attendance', value: `${viewItem.attendancePct}%` },
              { label: 'Applied On', value: viewItem.appliedDate },
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
              marginBottom: '1rem',
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
              {viewItem.reason}
            </p>
          </div>
          {viewItem.attendancePct !== undefined &&
            viewItem.attendancePct < 75 && (
              <div
                style={{
                  padding: '0.75rem',
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  borderRadius: 8,
                  marginBottom: '1rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.813rem',
                    color: '#b91c1c',
                    fontWeight: 600,
                  }}
                >
                  ⚠ Student's attendance ({viewItem.attendancePct}%) is below
                  75%. Review carefully before approving.
                </p>
              </div>
            )}
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
              ? 'Approve Student Leave'
              : 'Reject Student Leave'
          }
          subtitle={`${actionItem.applicant} — ${actionItem.leaveType} (${actionItem.days} days)`}
        >
          <TextArea
            label="Remarks"
            placeholder={
              popup.mode === 'approve'
                ? 'Optional remarks for student...'
                : 'Reason for rejection (required)'
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
