import { useState, useRef } from 'react';
import { Button } from 'shared/components/buttons';
import { sendOtp, verifyOtp } from '../api';
import { InputText } from 'primereact/inputtext';

interface OtpStepProps {
  email: string;
  onVerified: (token: string) => void;
}

export default function OtpStep({ email, onVerified }: OtpStepProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') handleVerify();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < paste.length; i++) {
      newOtp[i] = paste[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(paste.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const token = await verifyOtp(email, code);
      if (token) {
        onVerified(token);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { error: apiError } = await sendOtp(email);
      if (apiError) {
        setError('Failed to resend OTP.');
        return;
      }
      setError('');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-1 px-4">
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5">
            <i className="pi pi-shield text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
          <p className="text-gray-500 mt-1 text-[15px]">
            Enter the 6-digit code sent to{' '}
            <span className="font-semibold text-gray-700">{email}</span>
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              One-Time Password
            </label>
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <InputText
                  key={i}
                  ref={el => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  maxLength={1}
                  className="!w-12 !h-14 text-center text-xl font-bold !px-0"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
              <i className="pi pi-exclamation-circle text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <Button
            label="Verify OTP"
            onClick={handleVerify}
            isLoading={loading}
            className="w-full justify-center !py-3"
            variant="primary"
            size="medium"
          />

          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors disabled:text-gray-300 cursor-pointer"
            >
              {resending
                ? 'Resending...'
                : "Didn't receive the code? Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
