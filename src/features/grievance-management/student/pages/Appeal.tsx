import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function StudentAppeal() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateId = location.state?.complaintId;

  // Filter resolved/closed complaints that student can appeal
  const eligibleComplaints = complaints.filter(
    c => c.status === 'Resolved' || c.status === 'Closed'
  );

  const [form, setForm] = useState({
    ticketId: stateId || (eligibleComplaints[0]?.id ?? ''),
    reason: '',
    solution: '',
    evidenceName: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleFileAttach = () => {
    setForm(f => ({ ...f, evidenceName: 'Appended_Fresh_Evidence.pdf' }));
    ToastService.success('Appended_Fresh_Evidence.pdf attached.');
  };

  const handleSubmit = () => {
    if (!form.ticketId) {
      ToastService.error('Please select a ticket to appeal.');
      return;
    }
    if (!form.reason.trim() || !form.solution.trim()) {
      ToastService.error('Appeal reason and requested solution are required.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      ToastService.success(
        'Appeal filed successfully. Ticket auto-escalated to Level 4 (HoD/Registrar Panel).'
      );
      navigate(grvUrls.student.track);
    }, 1000);
  };

  return (
    <FormPage
      title="File an Appeal"
      description="Lodge an appeal to the SGRC appellate authority if you are unsatisfied with the lower-level resolution."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'Appeal' },
      ]}
    >
      <div className="grv-alert info">
        <i className="pi pi-shield"></i>
        <div>
          <strong>UGC SGRC Appellate Protocol:</strong> Complainants have the
          statutory right to file an appeal within 15 days of resolution
          publication. Appeals are routed straight to Level 4 (HoD / Registrar
          Office).
        </div>
      </div>

      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.5fr 1fr' }}
      >
        <FormCard title="Appeal Petition Form" icon="edit_note">
          <FormGrid columns={1}>
            <DropDownList
              label="Select Resolved/Closed Ticket to Appeal"
              data={eligibleComplaints.map(c => ({
                name: `${c.ticketNo} — ${c.subject.substring(0, 50)}...`,
                value: c.id,
              }))}
              textField="name"
              optionValue="value"
              value={form.ticketId}
              onChange={val =>
                setForm(f => ({ ...f, ticketId: String(val ?? '') }))
              }
              required
            />

            <div className="mt-2">
              <TextArea
                label="Detailed Reason of Appeal"
                placeholder="Explain why the resolution remarks provided by the department are unsatisfactory..."
                value={form.reason}
                onChange={val => setForm(f => ({ ...f, reason: val }))}
                rows={4}
                required
              />
            </div>

            <div className="mt-2">
              <TextArea
                label="Proposed / Desired Correction Solution"
                placeholder="Specify what exact corrective action will satisfy this grievance..."
                value={form.solution}
                onChange={val => setForm(f => ({ ...f, solution: val }))}
                rows={3}
                required
              />
            </div>

            <div className="mt-2">
              <TextBox
                label="Add Fresh Evidentiary Materials"
                placeholder="Name of newly added evidence document"
                value={form.evidenceName}
                onChange={val => setForm(f => ({ ...f, evidenceName: val }))}
                disabled
              />
              <div className="mt-2 flex justify-start">
                <Button
                  label="Attach Fresh Document"
                  icon="upload"
                  variant="outlined"
                  size="small"
                  onClick={handleFileAttach}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => navigate(grvUrls.student.portal)}
              />
              <Button
                label="Lodge Appeal"
                icon="send"
                variant="primary"
                isLoading={submitting}
                onClick={handleSubmit}
              />
            </div>
          </FormGrid>
        </FormCard>

        {/* Info panel */}
        <div className="space-y-4">
          <FormCard title="Eligible Tickets Status" icon="list">
            {eligibleComplaints.length === 0 ? (
              <p className="text-xs text-slate-400">
                You have no resolved or closed tickets eligible for appeal.
              </p>
            ) : (
              <div className="space-y-2">
                {eligibleComplaints.map(c => (
                  <div
                    key={c.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <span className="font-extrabold text-blue-600 block">
                      {c.ticketNo}
                    </span>
                    <span className="font-bold text-slate-700 block my-1">
                      {c.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Resolved Date: {c.resolvedDate || '—'}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1 italic">
                      Resolution: "{c.resolutionRemarks || 'N/A'}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
