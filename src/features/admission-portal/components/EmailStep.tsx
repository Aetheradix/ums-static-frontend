import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { sendOtp } from '../api';
import { InputText } from 'primereact/inputtext';

interface EmailStepProps {
  onOtpSent: (email: string) => void;
}

export default function EmailStep({ onOtpSent }: EmailStepProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: apiError } = await sendOtp(email.trim());
      if (apiError) {
        setError('No approved application found for this email.');
        return;
      }
      onOtpSent(email.trim());
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-1 px-4">
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5">
            <i className="pi pi-lock text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admission Portal</h1>
          <p className="text-gray-500 mt-2 text-[15px]">
            Enter your registered email to receive a one-time password
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <span className="p-input-icon-left w-full block">
              <i className="pi pi-envelope text-gray-400" />
              <InputText
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                placeholder="Enter your registered email"
                className="w-full"
              />
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
              <i className="pi pi-exclamation-circle text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <Button
            label="Send OTP"
            onClick={handleSubmit}
            isLoading={loading}
            className="w-full justify-center !py-3"
            variant="primary"
            size="medium"
          />

          <p className="text-center text-xs text-gray-400">
            Only registered students with approved applications can access this
            portal.
          </p>
        </div>
      </div>
    </div>
  );
}
