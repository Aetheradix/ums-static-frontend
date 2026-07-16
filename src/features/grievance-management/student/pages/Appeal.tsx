import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextArea, DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const APPEAL_GROUNDS = [
  {
    name: 'Resolution not satisfactory / insufficient',
    value: 'Unsatisfactory Resolution',
  },
  {
    name: 'Complaint was dismissed without proper inquiry',
    value: 'Improper Dismissal',
  },
  { name: 'Resolution was not implemented', value: 'Non-Implementation' },
  { name: 'New evidence / facts have emerged', value: 'New Evidence' },
  {
    name: 'Procedural violations during hearing',
    value: 'Procedural Violation',
  },
  {
    name: 'Bias or conflict of interest identified',
    value: 'Bias / Conflict of Interest',
  },
  { name: 'Other grounds (specify in description)', value: 'Other' },
];

const APPEAL_TIMELINE = [
  {
    step: '1',
    label: 'File Appeal',
    desc: 'Submit your appeal citing specific grounds and supporting documents.',
  },
  {
    step: '2',
    label: 'Registrar Review',
    desc: 'Registrar office reviews the original file and appeal petition within 10 days.',
  },
  {
    step: '3',
    label: 'Committee Hearing',
    desc: 'If grounds are valid, referred to SGRC/Committee for formal hearing within 30 days.',
  },
  {
    step: '4',
    label: 'Vice Chancellor',
    desc: 'Complex or unresolved appeals escalated to VC for final decision.',
  },
  {
    step: '5',
    label: 'Final Decision',
    desc: 'Official order issued. Decision is final and binding as per university statutes.',
  },
];

export default function Appeal() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployee = location.pathname.includes('/teacher');
  const portalUrls = isEmployee ? grvUrls.teacher : grvUrls.student;

  // Closed complaints only
  const closedComplaints = complaints.filter(c => c.status === 'Closed');

  // Form state
  const [selectedTicket, setSelectedTicket] = useState('');
  const [appealGround, setAppealGround] = useState('');
  const [appealDescription, setAppealDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appealRef, setAppealRef] = useState('');

  const selectedComplaint = closedComplaints.find(
    c => c.ticketNo === selectedTicket
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(prev => [...prev, ...Array.from(e.target.files!)].slice(0, 3));
  };

  const handleSubmit = () => {
    if (!selectedTicket) {
      ToastService.error('Please select a complaint to appeal.');
      return;
    }
    if (!appealGround) {
      ToastService.error('Please select the grounds for appeal.');
      return;
    }
    if (!appealDescription.trim() || appealDescription.length < 50) {
      ToastService.error(
        'Please provide a detailed description of at least 50 characters.'
      );
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const ref = `APPEAL/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
      setAppealRef(ref);
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // ─── No closed complaints ─────────────────────────────────────────
  if (closedComplaints.length === 0) {
    return (
      <FormPage
        title="File an Appeal"
        description="Appeals can only be filed for complaints that have been officially Closed."
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          {
            label: isEmployee ? 'Employee Login' : 'Student Login',
            to: portalUrls.portal,
          },
          { label: 'File Appeal' },
        ]}
      >
        <FormCard title="">
          <div className="flex flex-col items-center py-12 gap-4">
            <span className="material-symbols-outlined text-slate-300 text-6xl">
              lock_open
            </span>
            <h2 className="text-lg font-bold text-slate-700">
              No Closed Complaints Found
            </h2>
            <p className="text-sm text-slate-500 text-center max-w-md">
              The Appeal module is only available for complaints with status{' '}
              <strong>Closed</strong>. You currently have no closed complaints
              to appeal.
            </p>
            <Button
              label="← Back to Dashboard"
              variant="outlined"
              onClick={() => navigate(portalUrls.portal)}
            />
          </div>
        </FormCard>
      </FormPage>
    );
  }

  // ─── Success Screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <FormPage
        title="Appeal Submitted Successfully"
        description="Your appeal has been registered and forwarded to the Registrar's office."
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          {
            label: isEmployee ? 'Employee Login' : 'Student Login',
            to: portalUrls.portal,
          },
          { label: 'File Appeal' },
        ]}
      >
        <FormCard title="">
          <div className="flex flex-col items-center py-12 gap-5">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600 text-5xl">
                balance
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Appeal Registered!
            </h2>
            <p className="text-slate-500 text-sm text-center max-w-lg">
              Your appeal petition has been received. The Registrar will review
              within 10 working days and notify you of the outcome.
            </p>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl px-8 py-4 text-center">
              <p className="text-xs text-purple-500 font-medium mb-1">
                APPEAL REFERENCE NUMBER
              </p>
              <p className="text-2xl font-mono font-bold text-purple-700">
                {appealRef}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-lg text-xs text-slate-500">
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                <span className="material-symbols-outlined text-slate-400 text-base">
                  confirmation_number
                </span>
                <div>
                  <p className="font-semibold text-slate-700">
                    Original Ticket
                  </p>
                  <p>{selectedTicket}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                <span className="material-symbols-outlined text-slate-400 text-base">
                  gavel
                </span>
                <div>
                  <p className="font-semibold text-slate-700">Ground</p>
                  <p className="truncate max-w-[100px]">{appealGround}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                <span className="material-symbols-outlined text-slate-400 text-base">
                  hourglass_top
                </span>
                <div>
                  <p className="font-semibold text-slate-700">Review Period</p>
                  <p>10 Working Days</p>
                </div>
              </div>
            </div>
            <Button
              label="← Back to Dashboard"
              variant="outlined"
              onClick={() => navigate(portalUrls.portal)}
            />
          </div>
        </FormCard>
      </FormPage>
    );
  }

  // ─── Main Appeal Form ────────────────────────────────────────────
  return (
    <FormPage
      title="File an Appeal"
      description="Not satisfied with the resolution? Appeal your closed complaint to the Registrar's office."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        {
          label: isEmployee ? 'Employee Login' : 'Student Login',
          to: portalUrls.portal,
        },
        { label: 'File Appeal' },
      ]}
    >
      <div className="mb-3">
        <Button
          label="← Back"
          variant="outlined"
          onClick={() => navigate(portalUrls.portal)}
        />
      </div>

      {/* ── Important Notice ─────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
        <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5 shrink-0">
          info
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Appeal Eligibility
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Appeals can only be filed for complaints with status{' '}
            <strong>Closed</strong>. You have{' '}
            <strong>{closedComplaints.length}</strong> eligible complaint
            {closedComplaints.length > 1 ? 's' : ''}. Appeals must be filed
            within <strong>30 days</strong> of the closure date.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left: Appeal Form ───────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <FormCard title="Select Complaint to Appeal">
            <DropDownList
              label="Closed Complaint *"
              data={closedComplaints.map(c => ({
                name: `${c.ticketNo} — ${c.subject.substring(0, 50)}`,
                value: c.ticketNo,
              }))}
              textField="name"
              optionValue="value"
              value={selectedTicket}
              onChange={v => setSelectedTicket(v as string)}
            />

            {selectedComplaint && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-base">
                    info
                  </span>
                  <span className="font-semibold text-slate-700">
                    Complaint Summary
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-slate-500">Category:</span>{' '}
                    <span className="font-medium text-slate-700">
                      {selectedComplaint.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Submitted:</span>{' '}
                    <span className="font-medium text-slate-700">
                      {selectedComplaint.submittedDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Closed:</span>{' '}
                    <span className="font-medium text-slate-700">
                      {selectedComplaint.closedDate ?? '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Department:</span>{' '}
                    <span className="font-medium text-slate-700">
                      {selectedComplaint.assignedDept}
                    </span>
                  </div>
                </div>
                {selectedComplaint.resolutionRemarks && (
                  <div className="mt-2">
                    <p className="text-slate-500 mb-0.5">Resolution given:</p>
                    <p className="text-slate-700 italic">
                      "{selectedComplaint.resolutionRemarks}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </FormCard>

          <FormCard title="Appeal Details">
            <div className="space-y-3">
              <DropDownList
                label="Grounds for Appeal *"
                data={APPEAL_GROUNDS}
                textField="name"
                optionValue="value"
                value={appealGround}
                onChange={v => setAppealGround(v as string)}
              />

              <div>
                <TextArea
                  label="Detailed Justification *"
                  placeholder="Clearly state why you are not satisfied with the resolution. Include specific points from the original case, what was left unaddressed, and what outcome you are seeking. Minimum 50 characters required."
                  value={appealDescription}
                  onChange={setAppealDescription}
                  rows={6}
                />
                <p className="text-xs text-slate-400 text-right mt-1">
                  {appealDescription.length} characters (min 50)
                </p>
              </div>

              {/* Supporting documents */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Additional Evidence / Documents (Optional)
                </label>
                <label
                  htmlFor="appeal-doc-upload"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-purple-400 rounded-xl p-5 cursor-pointer transition-colors bg-slate-50 hover:bg-purple-50"
                >
                  <span className="material-symbols-outlined text-slate-400 text-3xl">
                    cloud_upload
                  </span>
                  <p className="text-sm font-medium text-slate-600">
                    Click to upload additional evidence
                  </p>
                  <p className="text-xs text-slate-400">
                    PDF, JPG, PNG — Max 5MB each — Up to 3 files
                  </p>
                </label>
                <input
                  id="appeal-doc-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                {files.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-purple-500 text-base">
                            attach_file
                          </span>
                          <span className="font-medium text-slate-700 truncate max-w-xs">
                            {f.name}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setFiles(p => p.filter((_, idx) => idx !== i))
                          }
                          className="text-red-400 hover:text-red-600"
                        >
                          <span className="material-symbols-outlined text-base">
                            close
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FormCard>

          <div className="flex justify-end gap-3 pb-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => navigate(portalUrls.portal)}
            />
            <Button
              label={submitting ? 'Submitting Appeal...' : 'Submit Appeal →'}
              variant="primary"
              onClick={handleSubmit}
            />
          </div>
        </div>

        {/* ── Right: Helper Panel ─────────────────────────────── */}
        <div className="space-y-4">
          {/* Appeal Flow */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-purple-600 text-lg">
                account_tree
              </span>
              <h3 className="text-sm font-bold text-purple-800">
                Appeal Process
              </h3>
            </div>
            <div className="space-y-3">
              {APPEAL_TIMELINE.map(s => (
                <div key={s.step} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-purple-800">
                      {s.label}
                    </p>
                    <p className="text-[11px] text-purple-600 leading-tight">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important notes */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-red-600 text-lg">
                warning
              </span>
              <h3 className="text-sm font-bold text-red-800">
                Important Notes
              </h3>
            </div>
            <ul className="text-xs text-red-700 space-y-1.5">
              <li className="flex gap-1.5">
                <span>•</span>
                <span>
                  Appeals must be filed within <strong>30 days</strong> of
                  complaint closure.
                </span>
              </li>
              <li className="flex gap-1.5">
                <span>•</span>
                <span>Only one appeal per complaint is permitted.</span>
              </li>
              <li className="flex gap-1.5">
                <span>•</span>
                <span>
                  False or frivolous appeals may attract disciplinary action.
                </span>
              </li>
              <li className="flex gap-1.5">
                <span>•</span>
                <span>
                  The final decision by VC is binding and non-reversible.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
