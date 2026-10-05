import { useEffect, useState } from 'react';
import { FormPopup } from 'shared/new-components';
import { Button } from 'shared/components/buttons';

interface SectionRejectModalProps {
  visible: boolean;
  onClose: () => void;
  stepNumber: number | null;
  stepTitle: string;
  initialReason?: string;
  collegeName?: string;
  onSave: (stepNumber: number, reason: string) => void;
}

export default function SectionRejectModal({
  visible,
  onClose,
  stepNumber,
  stepTitle,
  initialReason = '',
  collegeName = 'the institution',
  onSave,
}: SectionRejectModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setReason(initialReason);
      setError(null);
    }
  }, [visible, initialReason]);

  if (!visible || stepNumber === null) return null;

  const handleSave = () => {
    if (!reason.trim()) {
      setError('Please enter rejection remark.');
      return;
    }
    onSave(stepNumber, reason.trim());
    onClose();
  };

  const cleanTitle = stepTitle.replace(/^Step\s*\d+:\s*/i, '');

  return (
    <FormPopup
      visible={visible}
      onHide={onClose}
      title={`Reject Section - Step ${stepNumber}: ${cleanTitle}`}
      subtitle={`Enter rejection remark for ${collegeName}`}
      size="default"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="outlined" label="Cancel" onClick={onClose} />
          <Button
            variant="danger"
            label="Save Section Rejection"
            icon="pi pi-times-circle"
            onClick={handleSave}
          />
        </div>
      }
    >
      <div className="p-4 flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">
          Reject Remark <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={5}
          className={`w-full text-sm rounded-xl border p-3 focus:outline-none transition-all ${
            error
              ? 'border-rose-500 ring-2 ring-rose-100'
              : 'border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
          }`}
          placeholder="Enter reason / remark for rejecting this section..."
          value={reason}
          onChange={e => {
            setReason(e.target.value);
            if (error) setError(null);
          }}
          autoFocus
        />
        {error && (
          <span className="text-xs text-rose-600 font-medium">{error}</span>
        )}
      </div>
    </FormPopup>
  );
}
