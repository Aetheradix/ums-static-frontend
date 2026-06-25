import React from 'react';
import './PreviewField.css';

interface PreviewFieldProps {
  label: string;
  value?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  breakWord?: boolean;
}

export default function PreviewField({
  label,
  value,
  className = '',
  fullWidth = false,
  breakWord = false,
}: PreviewFieldProps) {
  const fieldClassName = [
    'preview-field',
    fullWidth ? 'preview-field-full' : '',
    breakWord ? 'preview-field-break-word' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasValue = value !== undefined && value !== null && value !== '';

  return (
    <div className={fieldClassName}>
      <span className="preview-field-label">{label}</span>

      <span className="preview-field-value">{hasValue ? value : 'N/A'}</span>
    </div>
  );
}
