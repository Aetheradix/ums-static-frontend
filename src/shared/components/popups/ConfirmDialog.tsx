import ReactModal from 'react-modal';
import { Button } from '../buttons';
import './ConfirmDialog.css';
import './Modal.css';

interface ConfirmDialogProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  visible,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <ReactModal
      isOpen={visible}
      onRequestClose={onHide}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      className="confirm-dialog-content"
      overlayClassName="confirm-dialog-overlay"
    >
      <div className="confirm-dialog-box">
        {/* Icon */}
        <div
          className={`confirm-dialog-icon-wrap confirm-dialog-icon--${variant}`}
        >
          <i
            className={`pi ${
              variant === 'danger'
                ? 'pi-trash'
                : variant === 'warning'
                  ? 'pi-exclamation-triangle'
                  : 'pi-info-circle'
            } confirm-dialog-icon`}
          />
        </div>

        {/* Title */}
        <h2 className="confirm-dialog-title">{title}</h2>

        {/* Message */}
        <p className="confirm-dialog-message">{message}</p>

        {/* Actions */}
        <div className="confirm-dialog-actions">
          <Button
            label={cancelLabel}
            variant="outlined"
            icon="times"
            onClick={onHide}
            disabled={isLoading}
          />
          <Button
            label={confirmLabel}
            variant={variant === 'danger' ? 'danger' : 'primary'}
            icon={variant === 'danger' ? 'trash' : 'check'}
            onClick={onConfirm}
            isLoading={isLoading}
          />
        </div>
      </div>
    </ReactModal>
  );
}
