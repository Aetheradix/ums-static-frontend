import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'shared/components/buttons';
import './ConfirmDialog.css';

type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  /** Whether the dialog is visible */
  visible: boolean;

  /** Callback when the dialog is closed without confirming */
  onHide: () => void;

  /** Callback when the confirm button is clicked */
  onConfirm: () => void;

  /** Dialog title */
  title?: string;

  /** Body message */
  message?: string;

  /** Label for the confirm button */
  confirmLabel?: string;

  /** Label for the cancel button */
  cancelLabel?: string;

  /** Visual variant — affects icon and confirm button color */
  variant?: ConfirmDialogVariant;

  /** Shows a loading spinner on the confirm button */
  isLoading?: boolean;
}

const ICON_MAP: Record<ConfirmDialogVariant, string> = {
  danger: 'pi-trash',
  warning: 'pi-exclamation-triangle',
  info: 'pi-info-circle',
};

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
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onHide();
    },
    [onHide]
  );

  useEffect(() => {
    if (!visible) return;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [visible, handleKeyDown]);

  if (!visible) return null;

  return createPortal(
    <div className="confirm-modal-overlay" onClick={onHide} role="presentation">
      <div
        className="confirm-modal-panel"
        onClick={event => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
      >
        {/* Body */}
        <div className="confirm-modal-body">
          {/* Icon */}
          <div
            className={`confirm-modal-icon-wrap confirm-modal-icon-wrap--${variant}`}
          >
            <i className={`pi ${ICON_MAP[variant]} confirm-modal-icon`} />
          </div>

          {/* Title */}
          <h2 className="confirm-modal-title" id="confirm-modal-title">
            {title}
          </h2>

          {/* Message */}
          <p className="confirm-modal-message" id="confirm-modal-message">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="confirm-modal-footer">
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
    </div>,
    document.body
  );
}
