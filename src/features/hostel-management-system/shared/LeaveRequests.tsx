import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  OtpModal,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { SectionNote } from '../components/ui';
import {
  MOCK_STUDENT_ID,
  MOCK_STUDENT_NAME,
  MOCK_WARDEN_HOSTEL_ID,
  MOCK_WARDEN_NAME,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { LeaveRequest } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const STATUS_VARIANT = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
} as const;

const blank = () => ({
  leaveType: 'Leave' as LeaveRequest['leaveType'],
  fromDate: today(),
  toDate: today(),
  destination: '',
  reason: '',
  parentMobile: '',
  parentEmail: '',
});

type Form = ReturnType<typeof blank>;

/** The notification the parent receives before the request reaches the warden. */
function buildParentMail(form: Form, hostelName: string) {
  return {
    to: form.parentEmail || 'parent@example.com',
    subject: `Hostel ${form.leaveType} request from ${MOCK_STUDENT_NAME} (${MOCK_STUDENT_ID})`,
    body: `Dear Parent / Guardian,

Your ward ${MOCK_STUDENT_NAME} (Enrollment ${MOCK_STUDENT_ID}), a resident of ${hostelName}, has applied for ${form.leaveType.toLowerCase()} with the following details:

  From date   : ${form.fromDate || '—'}
  To date     : ${form.toDate || '—'}
  Destination : ${form.destination || '—'}
  Reason      : ${form.reason || '—'}

A One Time Password has been sent to your registered mobile number${
      form.parentMobile ? ` ending ${form.parentMobile.slice(-4)}` : ''
    }. The request is forwarded to the hostel warden only after that OTP is confirmed.

If you did not expect this request, please contact the hostel office immediately.

Regards,
Hostel Management System
Devi Ahilya Vishwavidyalaya, Indore`,
  };
}

export default function LeaveRequests() {
  const { data, add, update } = useHms();
  const { isStudent, activePortal } = useHmsRole();

  const [form, setForm] = useState<Form>(blank);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [acting, setActing] = useState<LeaveRequest | null>(null);
  const [remarks, setRemarks] = useState('');

  const hostelName =
    data.hostels.find(h => h.id === MOCK_WARDEN_HOSTEL_ID)?.nameEn ??
    'the hostel';

  const rows = useMemo(
    () =>
      isStudent
        ? data.leaveRequests.filter(l => l.studentId === MOCK_STUDENT_ID)
        : data.leaveRequests.filter(l => l.hostelId === MOCK_WARDEN_HOSTEL_ID),
    [data.leaveRequests, isStudent]
  );

  const stats = useMemo(
    () => ({
      pending: rows.filter(l => l.status === 'Pending').length,
      approved: rows.filter(l => l.status === 'Approved').length,
      rejected: rows.filter(l => l.status === 'Rejected').length,
    }),
    [rows]
  );

  const mail = buildParentMail(form, hostelName);

  const sendOtp = () => {
    setPreviewOpen(false);
    setOtpOpen(true);
    ToastService.success(
      form.parentMobile
        ? `Notification sent and OTP delivered to the parent number ending ${form.parentMobile.slice(-4)}.`
        : 'Notification sent and OTP delivered to the registered parent number.'
    );
  };

  const raiseRequest = () => {
    add('leaveRequests', {
      id: uid('LV'),
      studentId: MOCK_STUDENT_ID,
      studentName: MOCK_STUDENT_NAME,
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      destination: form.destination,
      reason: form.reason,
      parentMobile: form.parentMobile,
      parentEmail: form.parentEmail,
      otpVerified: true,
      status: 'Pending',
      actionBy: '',
      actionDate: '',
      remarks: '',
    });
    setOtpOpen(false);
    setForm(blank());
    ToastService.success(
      'Parent consent verified — your request has been raised with the warden.'
    );
  };

  const decide = (status: LeaveRequest['status']) => {
    if (!acting) return;
    update('leaveRequests', acting.id, {
      ...acting,
      status,
      actionBy: MOCK_WARDEN_NAME,
      actionDate: today(),
      remarks,
    });
    ToastService.success(
      `${acting.studentName}'s ${acting.leaveType.toLowerCase()} request ${status.toLowerCase()}.`
    );
    setActing(null);
    setRemarks('');
  };

  return (
    <FormPage
      title={isStudent ? 'Leave Application' : 'Leave Requests'}
      description={
        isStudent
          ? 'Apply for leave or an outpass. Your parent is notified by SMS and email, and the request reaches the warden only after they confirm the OTP.'
          : 'Leave and outpass requests from your residents. Every request carries verified parent consent.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Leave Requests')}
    >
      <FormGrid columns={3}>
        <StatCard
          title="Pending Approval"
          value={stats.pending}
          icon="schedule"
          colorScheme="amber"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon="cancel"
          colorScheme="red"
        />
      </FormGrid>

      {isStudent && (
        <FormCard
          title="Apply for Leave / Outpass"
          subtitle="Review the notification your parent will receive, then confirm with the OTP sent to them."
          icon="directions"
        >
          <FormGrid columns={3}>
            <DropDownList
              label="Type"
              data={[
                { id: 'Leave', text: 'Leave (overnight or longer)' },
                { id: 'Outpass', text: 'Outpass (same day)' },
              ]}
              textField="text"
              valueField="id"
              value={form.leaveType}
              onChange={v =>
                setForm({
                  ...form,
                  leaveType: (v as LeaveRequest['leaveType']) ?? 'Leave',
                })
              }
            />
            <TextBox
              label="From Date"
              type="date"
              value={form.fromDate}
              onChange={v => setForm({ ...form, fromDate: v })}
            />
            <TextBox
              label="To Date"
              type="date"
              value={form.toDate}
              onChange={v => setForm({ ...form, toDate: v })}
            />
            <TextBox
              label="Destination"
              placeholder="Where you will be staying"
              value={form.destination}
              onChange={v => setForm({ ...form, destination: v })}
            />
            <TextBox
              label="Parent Mobile Number"
              maxLength={10}
              placeholder="OTP is sent here"
              value={form.parentMobile}
              onChange={v =>
                setForm({ ...form, parentMobile: v.replace(/\D/g, '') })
              }
            />
            <TextBox
              label="Parent Email"
              placeholder="Notification is emailed here"
              value={form.parentEmail}
              onChange={v => setForm({ ...form, parentEmail: v })}
            />
            <div className="md:col-span-3">
              <TextArea
                label="Reason"
                rows={2}
                placeholder="Why you need the leave or outpass"
                value={form.reason}
                onChange={v => setForm({ ...form, reason: v })}
              />
            </div>
          </FormGrid>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              label="Preview Parent Notification"
              variant="primary"
              icon="envelope"
              onClick={() => setPreviewOpen(true)}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm(blank())}
            />
          </div>
        </FormCard>
      )}

      <FormCard
        title={isStudent ? 'My Requests' : 'Requests from Residents'}
        icon="list"
      >
        <GridPanel<LeaveRequest>
          data={rows}
          searchBox
          searchPlaceholder="Search by student, destination or reason..."
          searchFields={['studentName', 'destination', 'reason']}
          pagination
          emptyMessage="No leave or outpass requests yet."
          columns={[
            ...(isStudent
              ? []
              : [
                  {
                    field: 'studentName' as const,
                    header: 'Student',
                    cell: (l: LeaveRequest) => (
                      <div className="flex flex-col">
                        <span className="font-semibold">{l.studentName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {l.studentId}
                        </span>
                      </div>
                    ),
                  },
                ]),
            { field: 'leaveType', header: 'Type', width: 110 },
            { field: 'fromDate', header: 'From', width: 120 },
            { field: 'toDate', header: 'To', width: 120 },
            {
              field: 'destination',
              header: 'Destination',
              cell: l => <>{l.destination || '—'}</>,
            },
            { field: 'reason', header: 'Reason' },
            {
              field: 'otpVerified',
              header: 'Parent Consent',
              width: 170,
              cell: l =>
                l.otpVerified ? (
                  <StatusBadge
                    label={
                      l.parentMobile
                        ? `Verified · ${l.parentMobile}`
                        : 'Verified'
                    }
                    variant="success"
                  />
                ) : (
                  <StatusBadge label="Not verified" variant="muted" />
                ),
            },
            {
              field: 'status',
              header: 'Status',
              width: 120,
              cell: l => (
                <StatusBadge
                  label={l.status}
                  variant={STATUS_VARIANT[l.status]}
                />
              ),
            },
            {
              field: 'actionBy',
              header: 'Actioned By',
              cell: l => <>{l.actionBy || '—'}</>,
            },
            ...(isStudent
              ? []
              : [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (l: LeaveRequest) =>
                      l.status === 'Pending' ? (
                        <Button
                          label="Review"
                          icon="pencil"
                          variant="primary"
                          size="small"
                          onClick={() => {
                            setActing(l);
                            setRemarks(l.remarks);
                          }}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">Closed</span>
                      ),
                  },
                ]),
          ]}
        />
      </FormCard>

      {/* ── Draft notification the parent receives ── */}
      <FormPopup
        visible={previewOpen}
        onHide={() => setPreviewOpen(false)}
        title="Parent Notification"
        subtitle="This is what goes to your parent before the request reaches the warden."
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPreviewOpen(false)}
            />
            <Button
              label="Send & Verify OTP"
              variant="primary"
              icon="send"
              onClick={sendOtp}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <SectionNote tone="info" title="Sent to both channels">
            An SMS with the OTP goes to{' '}
            {form.parentMobile || 'the registered parent mobile number'}, and
            this email goes to {mail.to}.
          </SectionNote>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">To:</span> {mail.to}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
                {mail.subject}
              </p>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-4 font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {mail.body}
            </pre>
          </div>
        </div>
      </FormPopup>

      <OtpModal
        visible={otpOpen}
        onHide={() => setOtpOpen(false)}
        onVerify={raiseRequest}
        subtitle={`Enter the 6-digit OTP sent to the parent's mobile number${
          form.parentMobile ? ` ending ${form.parentMobile.slice(-4)}` : ''
        }`}
        verifyLabel="Verify & Raise Request"
        onResend={() => ToastService.success('OTP re-sent to the parent.')}
      />

      {/* ── Warden decision ── */}
      <FormPopup
        visible={Boolean(acting)}
        onHide={() => setActing(null)}
        title="Review Leave Request"
        subtitle={
          acting
            ? `${acting.studentName} · ${acting.fromDate} to ${acting.toDate}`
            : ''
        }
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setActing(null)}
            />
            <Button
              label="Reject"
              variant="danger"
              icon="times"
              onClick={() => decide('Rejected')}
            />
            <Button
              label="Approve"
              variant="success"
              icon="check"
              onClick={() => decide('Approved')}
            />
          </div>
        }
      >
        {acting && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200">
                {acting.reason}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Destination: {acting.destination || '—'} · Parent consent{' '}
                {acting.otpVerified ? 'verified' : 'not verified'}
              </p>
            </div>
            <TextArea
              label="Remarks"
              rows={3}
              placeholder="Optional note recorded against your decision"
              value={remarks}
              onChange={setRemarks}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
