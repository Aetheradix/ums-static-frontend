import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Declaration, OtpModal } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';

const ASSIGNED_COLLEGE = {
  district: 'Vidisha',
  udise: '23310124311',
  collegeName: 'GHSS BOYS TYONDA(9 to 12)',
  subject: 'Hindi - MS Teachers',
  panel: 'Varg- 2 Hindi',
};

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

  const handleVerifyOtp = (code: string) => {
    if (code === '123456') {
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
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4 rounded-xl border p-8">
          <span className="material-symbols-rounded text-emerald-500 text-[72px]">
            check_circle
          </span>
          <h2 className="text-2xl font-bold text-emerald-500">
            Request Submitted
          </h2>
          <p className="text-sm max-w-md">
            Your joining request for{' '}
            <strong>{ASSIGNED_COLLEGE.collegeName}</strong> has been
            successfully submitted and locked. You can no longer make changes.
          </p>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Candidate Joining Request"
      description="Submit your joining request to your allocated college after receiving the joining order."
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'Candidate Portal', to: '/recruitment-management/candidate' },
        { label: 'Joining Request' },
      ]}
    >
      <FormCard title="Allocated College Details" icon="school">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 rounded-xl border p-4 mb-6">
          <div>
            <p className="text-xs mb-0.5">District</p>
            <p className="text-sm font-semibold">{ASSIGNED_COLLEGE.district}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5">UDISE Code</p>
            <p className="text-sm font-semibold font-mono">
              {ASSIGNED_COLLEGE.udise}
            </p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs mb-0.5">College Name</p>
            <p className="text-sm font-semibold">
              {ASSIGNED_COLLEGE.collegeName}
            </p>
          </div>
          <div>
            <p className="text-xs mb-0.5">Subject</p>
            <p className="text-sm font-semibold">{ASSIGNED_COLLEGE.subject}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5">Panel</p>
            <p className="text-sm font-semibold">{ASSIGNED_COLLEGE.panel}</p>
          </div>
        </div>

        {/* Remark */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Remark <span className="text-red-500">*</span>
          </label>
          <textarea
            value={remark}
            onChange={e => setRemark(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
            placeholder="Enter your joining remarks here..."
          />
          <div className="text-right text-xs mt-1">{remark.length}/500</div>
        </div>

        {/* Declaration */}
        <div className="mb-6">
          <Declaration
            id="joining-declaration"
            checked={declaration}
            onChange={setDeclaration}
            text="I hereby declare that I have verified all the details and wish to submit my joining request. I understand that this process is irreversible and no modifications can be made after submission."
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t">
          <Button
            label="Request"
            icon="send"
            type="button"
            variant="primary"
            onClick={handleRequestClick}
          />
        </div>
      </FormCard>

      <OtpModal
        visible={showOtp}
        onHide={() => setShowOtp(false)}
        onVerify={handleVerifyOtp}
        length={6}
        verifyLabel="Verify & Submit"
      />
    </FormPage>
  );
}
