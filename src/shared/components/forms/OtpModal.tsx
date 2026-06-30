import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPopup } from 'shared/new-components';

interface OtpModalProps {
  visible: boolean;
  onHide: () => void;
  onVerify: (otp: string) => void;
  length?: number;
  subtitle?: string;
  verifyLabel?: string;
  resendLabel?: string;
  onResend?: () => void;
}

export default function OtpModal({
  visible,
  onHide,
  onVerify,
  length = 6,
  subtitle = 'Please enter the OTP sent to your registered email/mobile',
  verifyLabel = 'Verify & Submit',
  resendLabel = 'Resend OTP',
  onResend,
}: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!visible) {
      setOtp(Array(length).fill(''));
    }
  }, [visible, length]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const digit = value.slice(-1);
      const next = [...otp];
      next[index] = digit;
      setOtp(next);

      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp, length]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const data = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, length);
      const next = Array(length).fill('');
      for (let i = 0; i < data.length; i++) {
        next[i] = data[i];
      }
      setOtp(next);
      const focusIndex = Math.min(data.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    },
    [length]
  );

  const handleResend = useCallback(() => {
    setResendTimer(60);
    onResend?.();
  }, [onResend]);

  const otpString = otp.join('');

  return (
    <FormPopup
      visible={visible}
      onHide={onHide}
      title="Verify OTP"
      subtitle={subtitle}
      size="default"
      footer={
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1">
            <Button
              label="Cancel"
              icon="close"
              type="button"
              variant="outlined"
              onClick={onHide}
            />
          </div>
          <div className="flex-1">
            <Button
              label={verifyLabel}
              icon="lock"
              type="button"
              variant="primary"
              onClick={() => onVerify(otpString)}
              disabled={otpString.length !== length}
            />
          </div>
        </div>
      }
    >
      <div
        className="flex flex-col items-center gap-6 py-4"
        onPaste={handlePaste}
      >
        <div className="flex items-center gap-3">
          {Array.from({ length }).map((_, i) => (
            <input
              key={i}
              ref={el => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[i]}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-14 h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl font-bold text-slate-800 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 focus:bg-white shadow-sm"
            />
          ))}
        </div>

        <button
          type="button"
          disabled={resendTimer > 0}
          className="flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 bg-transparent border-none cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400 transition-colors mt-2"
          onClick={handleResend}
        >
          <span className="material-symbols-rounded text-[14px]">refresh</span>
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : resendLabel}
        </button>
      </div>
    </FormPopup>
  );
}
