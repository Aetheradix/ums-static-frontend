import { Dialog } from 'primereact/dialog';
import { useCallback } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';

interface DraftSuccessDialogProps {
  visible: boolean;
  draftAppNumber: string;
  onClose: () => void;
}

export default function DraftSuccessDialog({
  visible,
  draftAppNumber,
  onClose,
}: DraftSuccessDialogProps) {
  const handleCopyDraftNumber = useCallback(async () => {
    if (!draftAppNumber) return;
    try {
      await navigator.clipboard.writeText(draftAppNumber);
      ToastService.success('Application number copied.');
    } catch {
      ToastService.error('Unable to copy application number.');
    }
  }, [draftAppNumber]);

  return (
    <Dialog
      visible={visible}
      className="draft-success-dialog"
      showHeader={false}
      onHide={onClose}
      footer={null}
    >
      <button type="button" className="draft-success-close" onClick={onClose}>
        <i className="pi pi-times" />
      </button>

      <div className="draft-success-content">
        <div className="draft-success-icon-wrap">
          <span className="draft-success-icon">
            <i className="pi pi-check" />
          </span>
        </div>

        <div className="draft-success-header">
          <h3>Application Saved as Draft</h3>
          <p>Your application has been saved successfully as a draft.</p>
        </div>

        <div className="draft-application-number-card">
          <span>Application Number</span>
          <strong>{draftAppNumber}</strong>
          <button
            type="button"
            className="draft-copy-button"
            onClick={handleCopyDraftNumber}
            title="Copy application number"
          >
            <i className="pi pi-copy" />
          </button>
        </div>

        <div className="draft-important-note">
          <span className="draft-note-icon">
            <i className="pi pi-info" />
          </span>
          <div>
            <strong>Important Note</strong>
            <p>
              To resume or edit this application later, you will need this
              Application Number along with the Affiliation Year. Please keep it
              secure.
            </p>
          </div>
        </div>

        <div className="draft-success-actions">
          <Button
            label="OK, Got it"
            icon="check"
            variant="primary"
            onClick={onClose}
          />
        </div>
      </div>
    </Dialog>
  );
}
