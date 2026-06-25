import React from 'react';
import './PreviewSection.css';

interface PreviewSectionProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  step?: number;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function PreviewSection({
  title,
  subtitle,
  step,
  children,
  className = '',
  headerAction,
}: PreviewSectionProps) {
  return (
    <section className={`preview-section ${className}`.trim()}>
      <div className="preview-section-header">
        <div className="preview-section-header-left">
          {step !== undefined && (
            <span className="preview-section-step">{step}</span>
          )}

          <div className="preview-section-heading">
            <h3 className="preview-section-title">{title}</h3>

            {subtitle && <p className="preview-section-subtitle">{subtitle}</p>}
          </div>
        </div>

        {headerAction && (
          <div className="preview-section-header-action">{headerAction}</div>
        )}
      </div>

      <div className="preview-section-body">{children}</div>
    </section>
  );
}
