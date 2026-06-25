import React from 'react';
import './PreviewSummary.css';

interface PreviewSummaryItem {
  label: string;
  value?: React.ReactNode;
  icon?: string;
}

interface PreviewSummaryProps {
  items: PreviewSummaryItem[];
  className?: string;
}

export default function PreviewSummary({
  items,
  className = '',
}: PreviewSummaryProps) {
  return (
    <div className={`preview-summary ${className}`.trim()}>
      {items.map(item => (
        <div className="preview-summary-item" key={item.label}>
          {item.icon && (
            <span className="preview-summary-icon">
              <i className={`pi pi-${item.icon}`} />
            </span>
          )}

          <div className="preview-summary-content">
            <span className="preview-summary-label">{item.label}</span>
            <span className="preview-summary-value">
              {item.value !== undefined &&
              item.value !== null &&
              item.value !== ''
                ? item.value
                : 'N/A'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
