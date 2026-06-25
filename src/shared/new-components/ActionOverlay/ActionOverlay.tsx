import { OverlayPanel } from 'primereact/overlaypanel';
import React, { forwardRef } from 'react';
import './ActionOverlay.css';

interface ActionOverlayProps {
  children: React.ReactNode;
  className?: string;
  showCloseIcon?: boolean;
  dismissable?: boolean;
  closeOnEscape?: boolean;
  onHide?: () => void;
}

const ActionOverlay = forwardRef<OverlayPanel, ActionOverlayProps>(
  (
    {
      children,
      className = '',
      showCloseIcon = false,
      dismissable = true,
      closeOnEscape = true,
      onHide,
    },
    ref
  ) => {
    return (
      <OverlayPanel
        ref={ref}
        showCloseIcon={showCloseIcon}
        dismissable={dismissable}
        closeOnEscape={closeOnEscape}
        appendTo={document.body}
        onHide={onHide}
        className={`action-overlay-panel ${className}`.trim()}
      >
        {children}
      </OverlayPanel>
    );
  }
);

ActionOverlay.displayName = 'ActionOverlay';

export default ActionOverlay;
