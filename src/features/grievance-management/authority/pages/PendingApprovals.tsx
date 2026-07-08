import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup } from 'shared/new-components';
import { complaints, notesheets } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AuthorityPendingApprovals() {
  const [list, setList] = useState(
    complaints.filter(
      c =>
        c.status === 'Forwarded' ||
        c.status === 'Under Review' ||
        c.status === 'Escalated'
    )
  );

  const [selectedId, setSelectedId] = useState(list[0]?.id ?? '');
  const [remarks, setRemarks] = useState('');
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showReturnPopup, setShowReturnPopup] = useState(false);

  const activeTicket = list.find(c => c.id === selectedId);
  const activeNotesheet = notesheets.find(
    n => n.complaintNo === activeTicket?.ticketNo
  );

  const handleApprove = () => {
    setList(prev => prev.filter(c => c.id !== selectedId));
    ToastService.success(
      `Grievance resolution approved and signed digitally. Sanction order generated.`
    );
    setShowApprovePopup(false);
    setRemarks('');
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      ToastService.error('Rejection remarks are required.');
      return;
    }
    setList(prev => prev.filter(c => c.id !== selectedId));
    ToastService.error(`Grievance petition rejected.`);
    setShowRejectPopup(false);
    setRemarks('');
  };

  const handleReturn = () => {
    if (!remarks.trim()) {
      ToastService.error('Return instructions are required.');
      return;
    }
    setList(prev => prev.filter(c => c.id !== selectedId));
    ToastService.success(`Notesheet returned back to department custodian.`);
    setShowReturnPopup(false);
    setRemarks('');
  };

  return (
    <FormPage
      title="Appellate Approvals Center"
      description="Approve, reject, or return official departmental resolutions and digital notesheets."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Authority Portal', to: grvUrls.authority.portal },
        { label: 'Pending Approvals' },
      ]}
    >
      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 2fr' }}
      >
        {/* Left Side List */}
        <FormCard title="Approvals Queue" icon="inbox">
          <div className="space-y-3">
            {list.length === 0 ? (
              <p className="text-xs text-slate-400">
                All pending approvals have been successfully addressed.
              </p>
            ) : (
              list.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedId === c.id
                      ? 'border-indigo-600 bg-indigo-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 font-mono text-xs font-bold text-blue-600">
                    <span>{c.ticketNo}</span>
                    <span
                      className={`grv-status-pill ${c.status.toLowerCase().replace(' ', '-')}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs line-clamp-1">
                    {c.subject}
                  </h4>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    From: {c.assignedDept}
                  </span>
                </div>
              ))
            )}
          </div>
        </FormCard>

        {/* Right Side Review & Actions */}
        {activeTicket ? (
          <div className="space-y-4">
            <FormCard title={`Reviewing: ${activeTicket.ticketNo}`}>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grv-info-field">
                    <span className="grv-info-label">Complainant</span>
                    <span className="grv-info-value">
                      {activeTicket.isAnonymous
                        ? 'Anonymous'
                        : activeTicket.studentName}
                    </span>
                  </div>
                  <div className="grv-info-field">
                    <span className="grv-info-label">Forwarding Section</span>
                    <span className="grv-info-value">
                      {activeTicket.assignedDept}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <span className="grv-info-label">Subject</span>
                  <p className="font-bold text-slate-800 text-sm">
                    {activeTicket.subject}
                  </p>
                  <span className="grv-info-label block mt-2">
                    Petition Description
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                    {activeTicket.description}
                  </p>
                </div>
              </div>
            </FormCard>

            {activeNotesheet && (
              <FormCard title="Digital eNotesheet" icon="history_edu">
                <div className="grv-notesheet text-xs">
                  <div className="grv-notesheet-header">
                    <span className="grv-notesheet-no">
                      {activeNotesheet.notesheetNo}
                    </span>
                    <span className="grv-notesheet-stamp">
                      File: {activeNotesheet.fileNo}
                    </span>
                  </div>
                  <div className="grv-notesheet-row mb-2">
                    <div className="grv-notesheet-field">
                      <label>Nodal Officer Remarks</label>
                      <p className="grv-notesheet-remark-box">
                        {activeNotesheet.remarks}
                      </p>
                    </div>
                  </div>
                  <div className="grv-notesheet-field">
                    <label>Appellate Recommendation</label>
                    <span className="font-bold text-indigo-700">
                      {activeNotesheet.recommendation}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 border-t border-slate-100 pt-4">
                  <Button
                    label="Return to Dept"
                    icon="reply"
                    variant="outlined"
                    onClick={() => setShowReturnPopup(true)}
                  />
                  <Button
                    label="Reject Petition"
                    icon="times"
                    variant="danger"
                    onClick={() => setShowRejectPopup(true)}
                  />
                  <Button
                    label="Approve & Sign"
                    icon="check"
                    variant="primary"
                    onClick={() => setShowApprovePopup(true)}
                  />
                </div>
              </FormCard>
            )}
          </div>
        ) : (
          <FormCard>
            <div className="text-center py-12 text-slate-400">
              Select an item from the queue to start review.
            </div>
          </FormCard>
        )}
      </div>

      {/* Approve Popup */}
      {showApprovePopup && (
        <FormPopup
          visible={showApprovePopup}
          onHide={() => setShowApprovePopup(false)}
          title="Approve & Generate Sanction Order"
          subtitle={`This will apply your digital signature on notesheet for ticket ${activeTicket?.ticketNo}`}
        >
          <FormGrid columns={1}>
            <p className="text-xs text-slate-500">
              The approval order will be auto-synced with BSNL SMS gateway and
              email server to alert the petitioner immediately.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowApprovePopup(false)}
              />
              <Button
                label="Confirm & eSign"
                variant="primary"
                onClick={handleApprove}
              />
            </div>
          </FormGrid>
        </FormPopup>
      )}

      {/* Reject Popup */}
      {showRejectPopup && (
        <FormPopup
          visible={showRejectPopup}
          onHide={() => setShowRejectPopup(false)}
          title="Reject Grievance Petition"
          subtitle={`Rejecting complaint ticket: ${activeTicket?.ticketNo}`}
        >
          <FormGrid columns={1}>
            <TextArea
              label="Official Rejection Reason *"
              placeholder="State clear regulatory reasons for rejecting the petition..."
              value={remarks}
              onChange={setRemarks}
              rows={3}
              required
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowRejectPopup(false)}
              />
              <Button
                label="Confirm Rejection"
                variant="danger"
                onClick={handleReject}
              />
            </div>
          </FormGrid>
        </FormPopup>
      )}

      {/* Return Popup */}
      {showReturnPopup && (
        <FormPopup
          visible={showReturnPopup}
          onHide={() => setShowReturnPopup(false)}
          title="Return Notesheet back to Department Custodian"
          subtitle={`Returning notesheet file: ${activeNotesheet?.notesheetNo}`}
        >
          <FormGrid columns={1}>
            <TextArea
              label="Audit Instructions / Correction remarks *"
              placeholder="Detail reasons for returning the notesheet..."
              value={remarks}
              onChange={setRemarks}
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
                variant="primary"
                onClick={handleReturn}
              />
            </div>
          </FormGrid>
        </FormPopup>
      )}
    </FormPage>
  );
}
