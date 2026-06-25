import { TextBox } from 'shared/components/forms';
import { FormActions, FormPopup } from 'shared/new-components';

interface RegistrationApprovalFormProps {
  visible: boolean;
  isPending: boolean;
  rejectionReason: string;
  onReasonChange: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function RegistrationApprovalForm({
  visible,
  isPending,
  rejectionReason,
  onReasonChange,
  onClose,
  onSubmit,
}: RegistrationApprovalFormProps) {
  return (
    <FormPopup
      visible={visible}
      onHide={onClose}
      title="Reject Registration"
      subtitle="Specify the reason for rejecting this college registration."
    >
      <TextBox
        label="Rejection Reason"
        placeholder="Type reason here..."
        value={rejectionReason}
        onChange={onReasonChange}
        required
        maxLength={200}
      />
      <FormActions
        saveLabel="Submit Rejection"
        isLoading={isPending}
        onSave={onSubmit}
        onReset={onClose}
      />
    </FormPopup>
  );
}
