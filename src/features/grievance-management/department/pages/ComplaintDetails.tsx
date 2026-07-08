import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, DropDownList } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup } from 'shared/new-components';
import { complaints, notesheets } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function DepartmentComplaintDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateId = location.state?.complaintId;
  const complaintId = stateId || 'GRV001';

  const [complaint, setComplaint] = useState(
    complaints.find(c => c.id === complaintId) || complaints[0]
  );

  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [forwardDept, setForwardDept] = useState('');
  const [forwardRemarks, setForwardRemarks] = useState('');
  const [showForwardPopup, setShowForwardPopup] = useState(false);
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [returnRemarks, setReturnRemarks] = useState('');

  const relatedNotesheet = notesheets.find(
    n => n.notesheetNo === complaint.notesheetNo
  );

  const handleResolve = () => {
    if (!resolutionRemarks.trim()) {
      ToastService.error('Please submit investigation and resolution remarks.');
      return;
    }
    setComplaint(c => ({
      ...c,
      status: 'Resolved',
      resolutionRemarks,
    }));
    ToastService.success('Grievance marked as resolved. Student notified.');
  };

  const handleForwardSubmit = () => {
    if (!forwardDept || !forwardRemarks.trim()) {
      ToastService.error('Forwarding department and remarks are required.');
      return;
    }
    setComplaint(c => ({
      ...c,
      status: 'Forwarded',
      assignedDept: forwardDept,
      timeline: [
        ...c.timeline,
        {
          id: `TL${Date.now()}`,
          action: 'Forwarded Department',
          performedBy: 'Dr. Rakesh Verma',
          role: 'Exam Controller',
          date: 'Just Now',
          remarks: `Forwarded to ${forwardDept}. Remarks: ${forwardRemarks}`,
          status: 'Forwarded',
          done: true,
          active: false,
        },
      ],
    }));
    setShowForwardPopup(false);
    ToastService.success(`Grievance forwarded to ${forwardDept}`);
  };

  const handleReturnSubmit = () => {
    if (!returnRemarks.trim()) {
      ToastService.error(
        'Please state the reasons for returning the complaint.'
      );
      return;
    }
    setComplaint(c => ({
      ...c,
      status: 'Submitted',
      assignedTo: 'Pending Assignment',
      timeline: [
        ...c.timeline,
        {
          id: `TL${Date.now()}`,
          action: 'Returned to Grievance Cell',
          performedBy: 'Dr. Rakesh Verma',
          role: 'Exam Controller',
          date: 'Just Now',
          remarks: `Returned with comments: ${returnRemarks}`,
          status: 'Submitted',
          done: true,
          active: false,
        },
      ],
    }));
    setShowReturnPopup(false);
    ToastService.success('Grievance returned to Grievance Cell Hub.');
  };

  return (
    <FormPage
      title={`Department Action Desk: ${complaint.ticketNo}`}
      description="Conduct investigations, generate notesheets, resolve petitions, or escalate to university authorities."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Department Portal', to: grvUrls.department.portal },
        { label: 'Inbox', to: grvUrls.department.inbox },
        { label: 'Complaint Details' },
      ]}
    >
      <div className="grv-bottom-row">
        {/* Left column details & notesheet */}
        <div className="space-y-6">
          <FormCard title="Complainant & Grievance Information" icon="info">
            <FormGrid columns={3}>
              <div className="grv-info-field">
                <span className="grv-info-label">Complainant Student</span>
                <span className="grv-info-value">
                  {complaint.isAnonymous
                    ? 'Anonymous Request'
                    : complaint.studentName}
                </span>
              </div>
              <div className="grv-info-field">
                <span className="grv-info-label">Enrollment ID</span>
                <span className="grv-info-value">
                  {complaint.isAnonymous ? 'N/A' : complaint.enrollmentNo}
                </span>
              </div>
              <div className="grv-info-field">
                <span className="grv-info-label">Program Course</span>
                <span className="grv-info-value">
                  {complaint.isAnonymous ? 'N/A' : complaint.course}
                </span>
              </div>
              <div className="grv-info-field">
                <span className="grv-info-label">Priority Level</span>
                <span
                  className={`grv-status-pill ${complaint.priority.toLowerCase()} block w-max`}
                >
                  {complaint.priority}
                </span>
              </div>
              <div className="grv-info-field">
                <span className="grv-info-label">Urgency SLA Deadline</span>
                <span className="grv-info-value font-mono">
                  {complaint.slaDeadline}
                </span>
              </div>
              <div className="grv-info-field">
                <span className="grv-info-label">Lodged Date</span>
                <span className="grv-info-value">
                  {complaint.submittedDate}
                </span>
              </div>
            </FormGrid>

            <div className="border-t border-slate-100 mt-4 pt-4">
              <span className="grv-info-label">Subject Heading</span>
              <p className="font-bold text-slate-800 text-sm mb-2">
                {complaint.subject}
              </p>
              <span className="grv-info-label">Petition Narrative</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {complaint.description}
              </p>
            </div>
          </FormCard>

          {/* Digital Notesheet section */}
          {relatedNotesheet ? (
            <FormCard title="Digital eOffice Notesheet" icon="history_edu">
              <div className="grv-notesheet">
                <div className="grv-notesheet-header">
                  <span className="grv-notesheet-no">
                    {relatedNotesheet.notesheetNo}
                  </span>
                  <span className="grv-notesheet-stamp">
                    File: {relatedNotesheet.fileNo}
                  </span>
                </div>
                <div className="grv-notesheet-row">
                  <div className="grv-notesheet-field">
                    <label>Signatory Officer</label>
                    <span>{relatedNotesheet.currentOfficer}</span>
                  </div>
                  <div className="grv-notesheet-field">
                    <label>Department Section</label>
                    <span>{relatedNotesheet.department}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="text-[10px] text-amber-800 font-bold block mb-1">
                    NOTES RECORD
                  </label>
                  <p className="grv-notesheet-remark-box">
                    {relatedNotesheet.remarks}
                  </p>
                </div>
                <div className="mt-2">
                  <label className="text-[10px] text-amber-800 font-bold block mb-1">
                    COMMITTEE RECOMMENDATIONS
                  </label>
                  <p className="text-xs text-slate-700">
                    {relatedNotesheet.recommendation}
                  </p>
                </div>
                {relatedNotesheet.digitalSigned && (
                  <div className="grv-notesheet-signature">
                    <i className="pi pi-verified text-emerald-600 text-lg"></i>
                    <div className="grv-sig-box">
                      <strong>eSign Authenticated</strong>
                      <div className="text-[9px] font-mono">
                        {relatedNotesheet.createdDate}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FormCard>
          ) : (
            <FormCard title="Digital Notesheet Actions">
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg text-center space-y-3">
                <i className="pi pi-file text-amber-500 text-3xl block"></i>
                <span className="font-bold text-amber-800 block text-sm">
                  Notesheet Not Generated Yet
                </span>
                <p className="text-xs text-slate-500">
                  UGC regulations require every official university grievance
                  process to maintain a digital notesheet trail for audit and
                  RTI compliance.
                </p>
                <Button
                  label="Initiate Digital Notesheet"
                  icon="plus"
                  variant="primary"
                  onClick={() =>
                    navigate(grvUrls.department.notesheet, {
                      state: { complaintId: complaint.id },
                    })
                  }
                />
              </div>
            </FormCard>
          )}

          {/* Investigation & Action Taken Form */}
          {complaint.status !== 'Resolved' && complaint.status !== 'Closed' && (
            <FormCard
              title="Submit Investigation & Redressal Remarks"
              icon="check_circle"
            >
              <FormGrid columns={1}>
                <TextArea
                  label="Internal Action Taken / Investigation Report Notes"
                  placeholder="Record internal verification notes, witness statements, or steps executed..."
                  value={internalNotes}
                  onChange={setInternalNotes}
                  rows={3}
                />
                <TextArea
                  label="Official Resolution Summary for Student *"
                  placeholder="Provide details about the refund processed, correction done, marks sheet issued..."
                  value={resolutionRemarks}
                  onChange={setResolutionRemarks}
                  rows={3}
                  required
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    label="Return to Cell"
                    icon="reply"
                    variant="outlined"
                    onClick={() => setShowReturnPopup(true)}
                  />
                  <Button
                    label="Forward / Escalate"
                    icon="send"
                    variant="outlined"
                    onClick={() => setShowForwardPopup(true)}
                  />
                  <Button
                    label="Mark Resolved"
                    icon="check"
                    variant="primary"
                    onClick={handleResolve}
                  />
                </div>
              </FormGrid>
            </FormCard>
          )}
        </div>

        {/* Right column sidebar */}
        <div className="space-y-6">
          <FormCard title="SLA & Urgency Counter">
            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span
                  className={`grv-status-pill ${complaint.status.toLowerCase().replace(' ', '-')}`}
                >
                  {complaint.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned To:</span>
                <span className="font-bold text-slate-700">
                  {complaint.assignedTo}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">
                  SLA RESOLUTION WINDOW
                </span>
                <div
                  className={`grv-sla-counter ${complaint.slaStatus === 'Breached' ? 'breached' : complaint.slaStatus === 'Near Breach' ? 'near' : 'ok'} w-full justify-center`}
                >
                  {complaint.slaStatus === 'Breached'
                    ? 'SLA VIOLATED'
                    : `${complaint.slaRemainingHrs} hrs remaining`}
                </div>
              </div>
            </div>
          </FormCard>

          <FormCard title="Petition Action History Log" icon="history">
            <div className="grv-timeline">
              {complaint.timeline.map((step, i) => (
                <div key={step.id} className="grv-timeline-step">
                  <div className="grv-timeline-icon-wrap">
                    <div className="grv-timeline-icon bg-slate-100 text-slate-500 text-xs">
                      {i + 1}
                    </div>
                    {i < complaint.timeline.length - 1 && (
                      <div className="grv-timeline-line bg-slate-200" />
                    )}
                  </div>
                  <div className="grv-timeline-body">
                    <span className="grv-timeline-title block">
                      {step.action}
                    </span>
                    <span className="grv-timeline-subtitle block text-[9px]">
                      {step.performedBy} ({step.role})
                    </span>
                    <span className="grv-timeline-date block">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </FormCard>
        </div>
      </div>

      {/* Forward/Escalate Popup */}
      {showForwardPopup && (
        <FormPopup
          visible={showForwardPopup}
          onHide={() => setShowForwardPopup(false)}
          title="Forward / Escalate Grievance Petition"
          subtitle={`Redirecting ${complaint.ticketNo} to next review node.`}
        >
          <FormGrid columns={1}>
            <DropDownList
              label="Target Authority / Department Section"
              data={[
                { name: 'SGRC Appellate Board', value: 'SGRC Appellate Board' },
                { name: 'SC/ST Redressal Cell', value: 'SC/ST Cell' },
                { name: 'Internal Complaints Committee', value: 'ICC' },
                {
                  name: 'Administration Registrar Office',
                  value: 'Registrar Office',
                },
              ]}
              textField="name"
              optionValue="value"
              value={forwardDept}
              onChange={(val: any) => setForwardDept(String(val ?? ''))}
              required
            />
            <div className="mt-2">
              <TextArea
                label="Official Forwarding Note / Reasons *"
                placeholder="Brief justification for referral..."
                value={forwardRemarks}
                onChange={setForwardRemarks}
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowForwardPopup(false)}
              />
              <Button
                label="Confirm Forward"
                variant="primary"
                onClick={handleForwardSubmit}
              />
            </div>
          </FormGrid>
        </FormPopup>
      )}

      {/* Return to Cell Popup */}
      {showReturnPopup && (
        <FormPopup
          visible={showReturnPopup}
          onHide={() => setShowReturnPopup(false)}
          title="Return Petition to Grievance Cell"
          subtitle={`Rejecting assignment for ${complaint.ticketNo}.`}
        >
          <FormGrid columns={1}>
            <TextArea
              label="Rejection / Return Remarks *"
              placeholder="State why this petition does not belong to your department or requires correction..."
              value={returnRemarks}
              onChange={setReturnRemarks}
              rows={3}
              required
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowReturnPopup(false)}
              />
              <Button
                label="Confirm Return"
                variant="danger"
                onClick={handleReturnSubmit}
              />
            </div>
          </FormGrid>
        </FormPopup>
      )}
    </FormPage>
  );
}
