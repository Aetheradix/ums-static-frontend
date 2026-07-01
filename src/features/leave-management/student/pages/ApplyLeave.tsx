import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { leaveTypes, students } from '../../mocks';
import { lmsUrls } from '../../urls';

const STUDENT = students[0];

const STUDENT_LEAVE_OPTIONS = leaveTypes
  .filter(lt => lt.applicableFor !== 'Employee' && lt.status === 'Active')
  .map(lt => ({ name: lt.name, value: lt.id }));

const EMPTY = {
  leaveType: '',
  fromDate: undefined as Date | undefined,
  toDate: undefined as Date | undefined,
  reason: '',
  parentContact: '',
  emergencyContact: '',
  address: '',
};

export default function StudentApplyLeave() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const selected = leaveTypes.find(lt => lt.id === form.leaveType);

  const validate = () => {
    if (!form.leaveType) {
      ToastService.error('Please select a leave type.');
      return false;
    }
    if (!form.fromDate) {
      ToastService.error('From date is required.');
      return false;
    }
    if (!form.toDate) {
      ToastService.error('To date is required.');
      return false;
    }
    if (!form.reason.trim()) {
      ToastService.error('Reason is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (STUDENT.attendancePct < 75) {
      ToastService.error(
        'Your attendance is below 75%. Leave may not be approved.'
      );
    }
    setSaving(true);
    setTimeout(() => {
      ToastService.success(
        'Leave application submitted! Awaiting teacher approval.'
      );
      setSaving(false);
      navigate(lmsUrls.student.myLeave);
    }, 800);
  };

  return (
    <FormPage
      title="Apply for Leave"
      description="Submit your leave application for teacher approval."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Student Portal', to: lmsUrls.student.portal },
        { label: 'Apply Leave' },
      ]}
    >
      {/* Attendance Alert */}
      {STUDENT.attendancePct < 75 && (
        <div
          style={{
            padding: '0.875rem 1rem',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: 8,
            marginBottom: '1rem',
          }}
        >
          <p
            style={{ fontSize: '0.813rem', color: '#b91c1c', fontWeight: 600 }}
          >
            ⚠ Your current attendance is {STUDENT.attendancePct}% which is below
            the required 75%. Your leave application may be rejected.
          </p>
        </div>
      )}

      <div className="w-full">
        {/* Student Info */}
        <FormCard title="Student Information" icon="school">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Name', value: STUDENT.name },
              { label: 'Enrollment No.', value: STUDENT.enrollmentNo },
              { label: 'Course', value: STUDENT.course },
              { label: 'Semester', value: STUDENT.semester },
              { label: 'Department', value: STUDENT.department },
              { label: 'Attendance %', value: `${STUDENT.attendancePct}%` },
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
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color:
                      f.label === 'Attendance %'
                        ? STUDENT.attendancePct >= 75
                          ? '#16a34a'
                          : '#ef4444'
                        : '#111827',
                  }}
                >
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Leave Details */}
        <FormCard
          title="Leave Details"
          subtitle="Select type and duration"
          icon="calendar"
          className="mt-4"
        >
          <FormGrid columns={2}>
            <DropDownList
              label="Leave Type"
              data={STUDENT_LEAVE_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="Select Leave Type"
              value={form.leaveType}
              onChange={v =>
                setForm(f => ({ ...f, leaveType: String(v ?? '') }))
              }
              required
            />
            {selected && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  justifyContent: 'flex-end',
                }}
              >
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Max: <strong>{selected.maxDays} days</strong>
                </p>
                {selected.attachmentMandatory && (
                  <p style={{ fontSize: '0.688rem', color: '#ef4444' }}>
                    ⚠ Medical certificate required
                  </p>
                )}
              </div>
            )}
            <DatePicker
              label="From Date"
              value={form.fromDate}
              onChange={v => setForm(f => ({ ...f, fromDate: v as Date }))}
              required
            />
            <DatePicker
              label="To Date"
              value={form.toDate}
              onChange={v => setForm(f => ({ ...f, toDate: v as Date }))}
              required
            />
          </FormGrid>
          <TextArea
            label="Reason for Leave"
            placeholder="Provide a detailed reason for your leave..."
            value={form.reason}
            onChange={v => setForm(f => ({ ...f, reason: v }))}
            rows={3}
            required
          />
        </FormCard>

        {/* Contact During Leave */}
        <FormCard title="Contact Information" icon="phone" className="mt-4">
          <FormGrid columns={2}>
            <TextBox
              label="Parent/Guardian Contact"
              placeholder="Parent name & number"
              value={form.parentContact}
              onChange={v => setForm(f => ({ ...f, parentContact: v }))}
            />
            <TextBox
              label="Emergency Contact"
              placeholder="Emergency contact number"
              value={form.emergencyContact}
              onChange={v => setForm(f => ({ ...f, emergencyContact: v }))}
            />
          </FormGrid>
          <TextArea
            label="Address During Leave"
            placeholder="Your address during leave period"
            value={form.address}
            onChange={v => setForm(f => ({ ...f, address: v }))}
            rows={2}
          />
        </FormCard>

        {/* Leave Balance */}
        <FormCard title="Available Leave Balance" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { type: 'Casual Leave', balance: STUDENT.leaveBalance.casual },
              { type: 'Medical Leave', balance: STUDENT.leaveBalance.medical },
              { type: 'Special Leave', balance: STUDENT.leaveBalance.special },
            ].map(b => (
              <div
                key={b.type}
                style={{
                  textAlign: 'center',
                  padding: '0.875rem',
                  border: '1px solid #f3f4f6',
                  borderRadius: 8,
                  background: '#f9fafb',
                }}
              >
                <p
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: b.balance > 0 ? '#16a34a' : '#ef4444',
                  }}
                >
                  {b.balance}
                </p>
                <p
                  style={{
                    fontSize: '0.688rem',
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {b.type}
                </p>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(lmsUrls.student.portal)}
          />
          <Button
            label="Save as Draft"
            variant="outlined"
            icon="save"
            onClick={() => ToastService.success('Draft saved.')}
          />
          <Button
            label="Submit Application"
            variant="primary"
            icon="send"
            isLoading={saving}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </FormPage>
  );
}
