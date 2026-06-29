import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ASSIGNED_SCHOOL = {
  district: 'Vidisha',
  udise: '23310124311',
  schoolName: 'GHSS BOYS TYONDA(9 to 12)',
  subject: 'Hindi - MS Teachers',
  panel: 'Varg- 2 Hindi',
};

// ─── OTP Modal ────────────────────────────────────────────────────────────────
function OtpModal({
  onVerify,
  onCancel,
}: {
  onVerify: (otp: string) => void;
  onCancel: () => void;
}) {
  const [otp, setOtp] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#1a2035] border border-slate-400/15 rounded-2xl p-8 w-[400px] shadow-2xl flex flex-col items-center text-center">
        <div className="w-full flex justify-end mb-2">
          <button
            onClick={onCancel}
            className="material-symbols-rounded text-slate-500 hover:text-white text-[20px] bg-transparent border-none cursor-pointer transition-colors"
          >
            close
          </button>
        </div>
        <h2 className="text-[18px] font-bold text-slate-200 mb-2">
          Verify OTP
        </h2>
        <p className="text-[13px] text-slate-400 mb-6">
          Please enter the 6-digit OTP sent to your registered email/mobile
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value)}
          placeholder="●●●●●●"
          className="w-48 bg-slate-400/10 border border-slate-400/20 rounded-lg px-4 py-3 text-[24px] tracking-[0.5em] text-center text-slate-200 focus:border-violet-500 outline-none transition-colors mb-4"
        />

        <button className="flex items-center gap-2 text-[12px] text-blue-400 hover:text-blue-300 font-semibold bg-transparent border-none cursor-pointer mb-8">
          <span className="material-symbols-rounded text-[14px]">refresh</span>
          Resend OTP
        </button>

        <div className="flex items-center gap-3 w-full">
          <div className="flex-1">
            <Button
              label="Cancel"
              icon="close"
              type="button"
              variant="outlined"
              onClick={onCancel}
            />
          </div>
          <div className="flex-1">
            <Button
              label="Verify & Lock"
              icon="lock"
              type="button"
              variant="primary"
              onClick={() => onVerify(otp)}
              disabled={otp.length !== 6}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CandidateJoiningRequestPage() {
  const [remark, setRemark] = useState('');
  const [declaration, setDeclaration] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRequestClick = () => {
    if (!declaration) {
      ToastService.error('Please accept the declaration before submitting.');
      return;
    }
    if (!remark.trim()) {
      ToastService.error('Please provide a remark.');
      return;
    }
    setShowOtp(true);
  };

  const handleVerifyOtp = (otp: string) => {
    if (otp === '123456') {
      // Mock validation
      setIsSubmitted(true);
      setShowOtp(false);
      ToastService.success('Joining request submitted successfully.');
    } else {
      ToastService.error('Invalid OTP. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <FormPage
        title="Candidate Joining Request"
        breadcrumbs={[
          { label: 'Recruitment Management', to: '/recruitment-management' },
          {
            label: 'Candidate Portal',
            to: '/recruitment-management/candidate',
          },
          { label: 'Joining Request' },
        ]}
      >
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4 bg-slate-400/5 border border-slate-400/15 rounded-2xl p-8">
          <span className="material-symbols-rounded text-emerald-500 text-[72px] drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            check_circle
          </span>
          <h2 className="text-2xl font-bold text-emerald-500">
            Request Submitted
          </h2>
          <p className="text-slate-400 text-sm max-w-md">
            Your joining request for{' '}
            <strong>{ASSIGNED_SCHOOL.schoolName}</strong> has been successfully
            submitted and locked. You can no longer make changes.
          </p>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Candidate Joining Request"
      description="Submit your joining request to your allocated school after receiving the joining order."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'Candidate Portal', to: '/recruitment-management/candidate' },
        { label: 'Joining Request' },
      ]}
    >
      <FormCard title="Allocated School Details" icon="school">
        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-400/10 mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600/20">
                {[
                  'District',
                  'UDISE Code',
                  'School Name',
                  'Subject',
                  'Panel',
                ].map(h => (
                  <th
                    key={h}
                    className="p-3 text-left text-[11px] text-blue-300 font-semibold uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-400/5 hover:bg-slate-400/5">
                <td className="p-3 text-[13px] text-slate-300">
                  {ASSIGNED_SCHOOL.district}
                </td>
                <td className="p-3 text-[13px] text-slate-300 font-mono">
                  {ASSIGNED_SCHOOL.udise}
                </td>
                <td className="p-3 text-[13px] text-slate-200 font-semibold">
                  {ASSIGNED_SCHOOL.schoolName}
                </td>
                <td className="p-3 text-[13px] text-slate-300">
                  {ASSIGNED_SCHOOL.subject}
                </td>
                <td className="p-3 text-[13px] text-slate-300">
                  {ASSIGNED_SCHOOL.panel}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Remark */}
        <div className="mb-6">
          <label className="block text-[12px] font-semibold text-slate-400 mb-2">
            Remark <span className="text-red-500">*</span>
          </label>
          <textarea
            value={remark}
            onChange={e => setRemark(e.target.value)}
            rows={4}
            className="w-full bg-slate-400/5 border border-slate-400/20 rounded-lg px-4 py-3 text-[13px] text-slate-200 focus:border-blue-500 outline-none transition-colors resize-none"
            placeholder="Enter your joining remarks here..."
          />
          <div className="text-right text-[11px] text-slate-500 mt-1">
            {remark.length}/500
          </div>
        </div>

        {/* Declaration */}
        <div className="mb-6">
          <p className="text-[14px] font-bold text-slate-200 mb-3">
            Declaration
          </p>
          <div className="flex items-start gap-3">
            <Checkbox
              id="joining-declaration"
              checked={declaration}
              onChange={setDeclaration}
            />
            <label
              htmlFor="joining-declaration"
              className="text-[12px] text-slate-400 leading-relaxed cursor-pointer mt-0.5"
            >
              I hereby declare that I have verified all the details and wish to
              submit my joining request. I understand that this process is
              irreversible and no modifications can be made after submission.
              <span className="text-red-500 ml-1">*</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Button
            label="Request"
            icon="send"
            type="button"
            variant="primary"
            onClick={handleRequestClick}
          />
        </div>
      </FormCard>

      {showOtp && (
        <OtpModal
          onVerify={handleVerifyOtp}
          onCancel={() => setShowOtp(false)}
        />
      )}
    </FormPage>
  );
}
