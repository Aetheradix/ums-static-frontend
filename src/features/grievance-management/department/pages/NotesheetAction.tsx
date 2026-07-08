import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function DepartmentNotesheetAction() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateId = location.state?.complaintId;
  const complaintId = stateId || 'GRV001';

  const complaint = complaints.find(c => c.id === complaintId) || complaints[0];

  const [form, setForm] = useState({
    notesheetNo: `NS/2026/00${Math.floor(Math.random() * 900 + 100)}`,
    complaintNo: complaint.ticketNo,
    fileNo: `EXAM/GRV/2026/${Math.floor(Math.random() * 900 + 100)}`,
    currentOfficer: 'Dr. Rakesh Verma',
    officerDesignation: 'Controller of Examinations',
    department: 'Examination Department',
    subject: `Notesheet regarding: ${complaint.subject}`,
    remarks: '',
    recommendation: '',
    digitalSigned: false,
  });

  const [saving, setSaving] = useState(false);

  const handleAction = (type: string) => {
    if (!form.remarks.trim()) {
      ToastService.error('Please enter official remarks on the notesheet.');
      return;
    }
    if (type === 'Approve' && !form.digitalSigned) {
      ToastService.error(
        'Aadhaar digital eSign authentication is mandatory for approving notesheets.'
      );
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      ToastService.success(`Notesheet successfully marked as: ${type}`);
      navigate(grvUrls.department.inbox);
    }, 800);
  };

  const handleDownload = () => {
    ToastService.success(
      'Notesheet PDF generated & downloading... (RTI Compliant format)'
    );
  };

  return (
    <FormPage
      title="Digital Notesheet Portal"
      description="Compile official verification records, append recommendations, sign via eSign and dispatch to Authority for sanction order."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Department Portal', to: grvUrls.department.portal },
        { label: 'Inbox', to: grvUrls.department.inbox },
        { label: 'Notesheet Action' },
      ]}
    >
      <div className="grv-alert warning">
        <i className="pi pi-history_edu"></i>
        <div>
          <strong>eOffice Compliance:</strong> Any modification made here will
          append a new section to the permanent notesheet ledger. Deletion is
          prohibited by university audit guidelines.
        </div>
      </div>

      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '2fr 1fr' }}
      >
        <FormCard title="Digital eNotesheet Form Editor" icon="edit">
          <FormGrid columns={2}>
            <TextBox
              label="Notesheet Serial No."
              value={form.notesheetNo}
              onChange={val => setForm(f => ({ ...f, notesheetNo: val }))}
              disabled
            />
            <TextBox
              label="Grievance Ticket Ref"
              value={form.complaintNo}
              onChange={val => setForm(f => ({ ...f, complaintNo: val }))}
              disabled
            />
            <TextBox
              label="eOffice File No."
              value={form.fileNo}
              onChange={val => setForm(f => ({ ...f, fileNo: val }))}
              required
            />
            <TextBox
              label="Drafting Officer"
              value={`${form.currentOfficer} (${form.officerDesignation})`}
              onChange={() => {}}
              disabled
            />
          </FormGrid>

          <div className="mt-4">
            <TextBox
              label="Notesheet Subject"
              value={form.subject}
              onChange={val => setForm(f => ({ ...f, subject: val }))}
              required
            />
          </div>

          <div className="mt-4">
            <TextArea
              label="Official Notesheet Remarks (Audit logged) *"
              placeholder="Record official feedback, findings, and departmental decisions..."
              value={form.remarks}
              onChange={val => setForm(f => ({ ...f, remarks: val }))}
              rows={6}
              required
            />
          </div>

          <div className="mt-4">
            <TextArea
              label="Statutory Recommendations / Corrective Directions"
              placeholder="Specify the exact solution proposed for registrar/finance approval..."
              value={form.recommendation}
              onChange={val => setForm(f => ({ ...f, recommendation: val }))}
              rows={3}
            />
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <Checkbox
              label="Authenticate and digitally sign notesheet via eSign (Aadhaar OTP required)"
              checked={form.digitalSigned}
              onChange={val => setForm(f => ({ ...f, digitalSigned: val }))}
            />
            {form.digitalSigned && (
              <div className="mt-2 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <i className="pi pi-verified text-lg"></i>
                <span>
                  Digital Signature Verified: RAKESH VERMA (COE-DAVV). Timestamp
                  locked.
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-between items-center gap-2 border-t border-slate-100 pt-4 mt-6">
            <div className="flex gap-2">
              <Button
                label="Save Draft"
                icon="save"
                variant="outlined"
                onClick={() => ToastService.success('Notesheet draft saved.')}
              />
              <Button
                label="Export PDF"
                icon="download"
                variant="outlined"
                onClick={handleDownload}
              />
            </div>
            <div className="flex gap-2">
              <Button
                label="Reject Notesheet"
                icon="times"
                variant="danger"
                onClick={() => handleAction('Reject')}
              />
              <Button
                label="Return Notesheet"
                icon="reply"
                variant="outlined"
                onClick={() => handleAction('Return')}
              />
              <Button
                label="eSign & Forward"
                icon="send"
                variant="primary"
                isLoading={saving}
                onClick={() => handleAction('Approve')}
              />
            </div>
          </div>
        </FormCard>

        {/* Info panel */}
        <div className="space-y-4 text-xs">
          <FormCard title="Original Student Petition" icon="description">
            <div className="space-y-2">
              <span className="grv-info-label">Subject</span>
              <p className="font-bold text-slate-800">{complaint.subject}</p>
              <span className="grv-info-label">Description</span>
              <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 leading-normal max-h-48 overflow-y-auto">
                {complaint.description}
              </p>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
