import React from 'react';
import './InlineCreatePanel.css';

interface InlineCreatePanelProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  closeIcon?: string;
}

export default function InlineCreatePanel({
  visible,
  title,
  subtitle,
  children,
  onClose,
  className = '',
  closeIcon = 'pi pi-angle-up',
}: InlineCreatePanelProps) {
  if (!visible) return null;

  return (
    <div className={`inline-create-panel ${className}`.trim()}>
      <div className="inline-create-panel-header">
        <div>
          <h3 className="inline-create-panel-title">{title}</h3>

          {subtitle && (
            <p className="inline-create-panel-subtitle">{subtitle}</p>
          )}
        </div>

        <button
          type="button"
          className="inline-create-panel-close"
          onClick={onClose}
          aria-label="Collapse create panel"
          title="Collapse"
        >
          <i className={closeIcon} />
        </button>
      </div>

      <div className="inline-create-panel-body">{children}</div>
    </div>
  );
}
