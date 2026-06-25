import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './FormPopup.css';

type FormPopupSize = 'default' | 'lg' | 'xl';

interface FormPopupProps {
  /** Whether the popup is visible */
  visible: boolean;

  /** Callback when the popup is closed */
  onHide: () => void;

  /** Title displayed in the popup header */
  title: string;

  /** Optional subtitle below the title */
  subtitle?: string;

  /** Content rendered inside the popup */
  children: React.ReactNode;

  /** Optional popup footer */
  footer?: React.ReactNode;

  /** Popup width variant */
  size?: FormPopupSize;

  /** Additional class for the popup panel */
  className?: string;

  /** Additional class for the popup body */
  bodyClassName?: string;
}

const SIZE_CLASSES: Record<FormPopupSize, string> = {
  default: '',
  lg: 'form-popup-lg',
  xl: 'form-popup-xl',
};

export default function FormPopup({
  visible,
  onHide,
  title,
  subtitle,
  children,
  footer,
  size = 'default',
  className = '',
  bodyClassName = '',
}: FormPopupProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onHide();
      }
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

  const panelClassName = [
    'form-popup-panel',
    SIZE_CLASSES[size],
    footer ? 'form-popup-with-footer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const popupBodyClassName = ['form-popup-body', bodyClassName]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <div className="form-popup-overlay" onClick={onHide} role="presentation">
      <div
        className={panelClassName}
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-popup-title"
        aria-describedby={subtitle ? 'form-popup-subtitle' : undefined}
      >
        <div className="form-popup-header">
          <div className="form-popup-header-left">
            <h2 className="form-popup-title" id="form-popup-title">
              {title}
            </h2>

            {subtitle && (
              <p className="form-popup-subtitle" id="form-popup-subtitle">
                {subtitle}
              </p>
            )}
          </div>

          <button
            className="form-popup-close"
            onClick={onHide}
            type="button"
            aria-label="Close popup"
          >
            <i className="pi pi-times" />
          </button>
        </div>

        <div className={popupBodyClassName}>{children}</div>

        {footer && <div className="form-popup-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
