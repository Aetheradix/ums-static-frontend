import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, Switch, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { leaveTypes } from '../../mocks';
import { lmsUrls } from '../../urls';

const LEAVE_OPTIONS = leaveTypes
  .filter(lt => lt.applicableFor !== 'Student' && lt.status === 'Active')
  .map(lt => ({ name: lt.name, value: lt.id }));

const EMPTY_FORM = {
  leaveType: '', fromDate: undefined as Date | undefined, toDate: undefined as Date | undefined, halfDay: false,
  reason: '', emergencyContact: '', addressDuringLeave: '',
};

export default function ApplyLeave() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const selected = leaveTypes.find(lt => lt.id === form.leaveType);

  const validate = () => {
    if (!form.leaveType) { ToastService.error('Please select a leave type.'); return false; }
    if (!form.fromDate) { ToastService.error('From date is required.'); return false; }
    if (!form.toDate) { ToastService.error('To date is required.'); return false; }
    if (!form.reason.trim()) { ToastService.error('Reason is required.'); return false; }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      ToastService.success('Leave application submitted successfully!');
      setSaving(false);
      navigate(lmsUrls.teacher.myApplications);
    }, 800);
  };

  const handleDraft = () => {
    ToastService.success('Application saved as draft.');
  };

  return (
    <FormPage
      title="Apply for Leave"
      description="Submit your leave application for approval."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Teacher Portal', to: lmsUrls.teacher.portal },
        { label: 'Apply Leave' },
      ]}
    >
      <div style={{ maxWidth: '900px' }}>
        {/* Leave Details */}
        <FormCard title="Leave Details" subtitle="Select leave type and duration" icon="calendar">
          <FormGrid columns={2}>
            <DropDownList
              label="Leave Type"
              data={LEAVE_OPTIONS}
              textField="name"
              optionValue="value"
              placeholder="Select Leave Type"
              value={form.leaveType}
              onChange={v => setForm(f => ({ ...f, leaveType: String(v ?? '') }))}
              required
            />
            {selected && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', justifyContent: 'flex-end' }}>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Max: <strong>{selected.maxDays} days</strong> &bull; Carry Forward: <strong>{selected.carryForward ? 'Yes' : 'No'}</strong>
                </p>
                {selected.attachmentMandatory && (
                  <p style={{ fontSize: '0.688rem', color: '#ef4444' }}>⚠ Medical certificate required</p>
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
          {selected?.halfDayAllowed && (
            <Switch
              label="Apply for Half Day"
              checked={form.halfDay}
              onChange={v => setForm(f => ({ ...f, halfDay: v }))}
            />
          )}
          <TextArea
            label="Reason for Leave"
            placeholder="Please provide a brief reason for your leave request..."
            value={form.reason}
            onChange={v => setForm(f => ({ ...f, reason: v }))}
            rows={3}
            required
          />
        </FormCard>

        {/* Contact Info */}
        <FormCard title="Contact During Leave" subtitle="Emergency contact details" icon="phone" className="mt-4">
          <FormGrid columns={2}>
            <TextBox
              label="Emergency Contact Name & Number"
              placeholder="e.g. Spouse: 9876543210"
              value={form.emergencyContact}
              onChange={v => setForm(f => ({ ...f, emergencyContact: v }))}
            />
          </FormGrid>
          <TextArea
            label="Address During Leave"
            placeholder="Your address during the leave period"
            value={form.addressDuringLeave}
            onChange={v => setForm(f => ({ ...f, addressDuringLeave: v }))}
            rows={2}
          />
        </FormCard>

        {/* Current Balance Preview */}
        <FormCard title="Current Leave Balance" className="mt-4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
            {[
              { type: 'Casual', balance: 11, color: '#3b82f6' },
              { type: 'Medical', balance: 18, color: '#ef4444' },
              { type: 'Earned', balance: 15, color: '#10b981' },
              { type: 'Half Pay', balance: 20, color: '#f59e0b' },
            ].map(b => (
              <div key={b.type} style={{ textAlign: 'center', padding: '0.875rem', border: '1px solid #f3f4f6', borderRadius: 8, background: '#f9fafb' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: b.color }}>{b.balance}</p>
                <p style={{ fontSize: '0.688rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{b.type}</p>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={() => navigate(lmsUrls.teacher.portal)} />
          <Button label="Save as Draft" variant="outlined" icon="save" onClick={handleDraft} />
          <Button label="Submit Application" variant="primary" icon="send" isLoading={saving} onClick={handleSubmit} />
        </div>
      </div>
    </FormPage>
  );
}
