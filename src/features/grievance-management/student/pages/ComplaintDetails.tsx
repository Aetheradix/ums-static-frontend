import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { complaints, notesheets } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function StudentComplaintDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateId = location.state?.complaintId;
  const complaintId = stateId || 'GRV001';

  const [complaint, setComplaint] = useState(
    complaints.find(c => c.id === complaintId) || complaints[0]
  );

  const [commentText, setCommentText] = useState('');
  const relatedNotesheet = notesheets.find(
    n => n.notesheetNo === complaint.notesheetNo
  );

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      author: 'Arjun Sharma (Student)',
      role: 'Student',
      message: commentText,
      date: 'Just Now',
      isInternal: false,
    };
    setComplaint(c => ({
      ...c,
      comments: [...c.comments, newComment],
    }));
    setCommentText('');
    ToastService.success('Comment posted successfully.');
  };

  const handleCloseTicket = () => {
    setComplaint(c => ({
      ...c,
      status: 'Closed',
    }));
    ToastService.success('Ticket closed successfully.');
  };

  const isClosed = complaint.status === 'Closed';
  const isResolved = complaint.status === 'Resolved';
  const isBreached = complaint.slaStatus === 'Breached';
  const isNearBreach = complaint.slaStatus === 'Near Breach';

  return (
    <FormPage
      title={`Complaint Actions Desk: ${complaint.ticketNo}`}
      description="View real-time investigation progress, notesheets, and submit comments."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'Track Complaint', to: grvUrls.student.track },
        { label: 'Grievance Details' },
      ]}
    >
      <div className="grv-bottom-row">
        {/* Left Column: Complaint Details & Timeline */}
        <div className="space-y-6">
          {/* Main Info */}
          <FormCard title="Grievance Details Information" icon="info">
            <FormGrid columns={2}>
              <div className="grv-info-field">
                <span className="grv-info-label">Category / Area</span>
                <span className="grv-info-value">{complaint.category}</span>
              </div>
              <div className="grv-info-field">
                <span className="grv-info-label">Sub-Category</span>
                <span className="grv-info-value">{complaint.subCategory}</span>
              </div>
              <div className="grv-info-field">
                <span className="grv-info-label">Incident Date</span>
                <span className="grv-info-value">{complaint.incidentDate}</span>
              </div>
              <div className="grv-info-field">
                <span className="grv-info-label">Submitted On</span>
                <span className="grv-info-value">
                  {complaint.submittedDate}
                </span>
              </div>
              <div className="grv-info-field">
                <span className="grv-info-label">Assigned Department</span>
                <span className="grv-info-value">{complaint.assignedDept}</span>
              </div>
              <div className="grv-info-field">
                <span className="grv-info-label">Current Nodal Officer</span>
                <span className="grv-info-value">{complaint.assignedTo}</span>
              </div>
            </FormGrid>

            <div className="border-t border-slate-100 mt-4 pt-4">
              <span className="grv-info-label">Subject Petition</span>
              <p className="font-bold text-slate-800 text-sm mb-3">
                {complaint.subject}
              </p>

              <span className="grv-info-label">Elaborated Description</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {complaint.description}
              </p>
            </div>
          </FormCard>

          {/* Digital Notesheet Panel */}
          {relatedNotesheet && (
            <FormCard
              title="Digital eOffice Notesheet Action Trail"
              icon="history_edu"
            >
              <div className="grv-notesheet">
                <div className="grv-notesheet-header">
                  <span className="grv-notesheet-no">
                    {relatedNotesheet.notesheetNo}
                  </span>
                  <span className="grv-notesheet-stamp">
                    File Ref: {relatedNotesheet.fileNo}
                  </span>
                </div>
                <div className="grv-notesheet-row">
                  <div className="grv-notesheet-field">
                    <label>Current Custodian Officer</label>
                    <span>
                      {relatedNotesheet.currentOfficer} (
                      {relatedNotesheet.officerDesignation})
                    </span>
                  </div>
                  <div className="grv-notesheet-field">
                    <label>Department Section</label>
                    <span>{relatedNotesheet.department}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-[10px] text-amber-800 font-bold block mb-1">
                    OFFICER NOTES & REMARKS
                  </label>
                  <p className="grv-notesheet-remark-box">
                    {relatedNotesheet.remarks}
                  </p>
                </div>
                <div className="mt-3">
                  <label className="text-[10px] text-amber-800 font-bold block mb-1">
                    PROPOSED RECOMMENDATION
                  </label>
                  <p className="text-xs text-slate-700">
                    {relatedNotesheet.recommendation}
                  </p>
                </div>
                {relatedNotesheet.digitalSigned && (
                  <div className="grv-notesheet-signature">
                    <i className="pi pi-verified text-emerald-600 text-lg"></i>
                    <div className="grv-sig-box">
                      <strong>Digitally Signed via eSign</strong>
                      <div className="text-[9px] font-mono">
                        Date: {relatedNotesheet.createdDate}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FormCard>
          )}

          {/* Evidence Attachments */}
          <FormCard title="Attached Supporting Documents" icon="cloud_download">
            {complaint.attachments.length === 0 ? (
              <p className="text-xs text-slate-400">
                No file attachments uploaded for this ticket.
              </p>
            ) : (
              <div className="space-y-2">
                {complaint.attachments.map(a => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <i className="pi pi-file-pdf text-red-500 text-lg"></i>
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {a.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {a.size} · Uploaded by {a.uploadedBy} on{' '}
                          {a.uploadedOn}
                        </span>
                      </div>
                    </div>
                    <Button
                      label="Download"
                      icon="download"
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        ToastService.success(
                          `Downloading attachment file: ${a.name}`
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </FormCard>

          {/* Comments Section */}
          <FormCard title="Petition Comments & Queries thread" icon="comment">
            <div className="space-y-4 mb-4">
              {complaint.comments.map(c => (
                <div
                  key={c.id}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">{c.author}</span>
                    <span className="text-[10px] text-slate-400">{c.date}</span>
                  </div>
                  <p className="text-slate-600">{c.message}</p>
                </div>
              ))}
            </div>

            {!isClosed && (
              <div className="space-y-3">
                <TextArea
                  label="Add Comment or Clarification Request"
                  value={commentText}
                  onChange={setCommentText}
                  placeholder="Type your message to the redressal team..."
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    label="Submit Message"
                    icon="send"
                    variant="primary"
                    onClick={handleAddComment}
                  />
                </div>
              </div>
            )}
          </FormCard>
        </div>

        {/* Right Column: Workflow Journey & SLA indicators */}
        <div className="space-y-6">
          {/* SLA Status Widget */}
          <FormCard title="SLA & Escalation Info" icon="schedule">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Current Status:</span>
                <span
                  className={`grv-status-pill ${complaint.status.toLowerCase().replace(' ', '-')}`}
                >
                  {complaint.status}
                </span>
              </div>

              {!isClosed && !isResolved && (
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">
                    TIME REMAINING TO BREACH
                  </span>
                  <div
                    className={`grv-sla-counter ${isBreached ? 'breached' : isNearBreach ? 'near' : 'ok'} w-full justify-center`}
                  >
                    {isBreached
                      ? 'SLA VIOLATED / ESCALATED'
                      : `${complaint.slaRemainingHrs} Hours Left`}
                  </div>
                  <div className="grv-bar-track mt-2">
                    <div
                      className={`grv-bar-fill ${isBreached ? 'bg-red-500' : isNearBreach ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{
                        width: `${Math.max(0, Math.min(100, (complaint.slaRemainingHrs / 72) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Escalation Stage:</span>
                  <span className="font-bold text-slate-700">
                    Level {complaint.escalationLevel}
                  </span>
                </div>
                {complaint.escalatedTo && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Escalated To:</span>
                    <span className="font-bold text-red-600">
                      {complaint.escalatedTo}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FormCard>

          {/* Timeline journey */}
          <FormCard title="Grievance Redressal Timeline" icon="track_changes">
            <div className="grv-timeline">
              {complaint.timeline.map((step, idx) => (
                <div key={step.id} className="grv-timeline-step">
                  <div className="grv-timeline-icon-wrap">
                    <div
                      className="grv-timeline-icon"
                      style={{
                        background: step.done
                          ? '#dcfce7'
                          : step.active
                            ? '#dbeafe'
                            : '#f3f4f6',
                        color: step.done
                          ? '#16a34a'
                          : step.active
                            ? '#2563eb'
                            : '#9ca3af',
                      }}
                    >
                      {step.done ? (
                        <i className="pi pi-check text-xs"></i>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    {idx < complaint.timeline.length - 1 && (
                      <div
                        className={`grv-timeline-line ${step.done ? 'bg-green-500' : 'bg-slate-200'}`}
                      />
                    )}
                  </div>
                  <div className="grv-timeline-body">
                    <span className="grv-timeline-title block">
                      {step.action}
                    </span>
                    <span className="grv-timeline-subtitle block text-[10px]">
                      {step.performedBy} ({step.role})
                    </span>
                    <span className="grv-timeline-date block">{step.date}</span>
                    {step.remarks && (
                      <p className="grv-timeline-remark">{step.remarks}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FormCard>

          {/* Actions */}
          {!isClosed && (
            <FormCard title="Actions Box">
              <div className="space-y-2">
                {isResolved && (
                  <Button
                    label="Accept Resolution & Close Ticket"
                    icon="check"
                    variant="primary"
                    className="w-full text-xs"
                    onClick={handleCloseTicket}
                  />
                )}
                <Button
                  label="Initiate Appeal Review"
                  icon="shield"
                  variant="danger"
                  className="w-full text-xs"
                  onClick={() =>
                    navigate(grvUrls.student.appeal, {
                      state: { complaintId: complaint.id },
                    })
                  }
                  disabled={isClosed}
                />
              </div>
            </FormCard>
          )}
        </div>
      </div>
    </FormPage>
  );
}
