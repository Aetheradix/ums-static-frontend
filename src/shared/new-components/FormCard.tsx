import React from 'react';
import './FormCard.css';

interface FormCardProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function FormCard({
  title,
  subtitle,
  icon,
  children,
  className = '',
  headerAction,
}: FormCardProps) {
  return (
    <div className={`form-card ${className}`.trim()}>
      {/* Card Header */}
      {(title || headerAction) && (
        <div className="form-card-header">
          {/* LEFT SIDE */}
          <div className="form-card-header-left">
            {/* ICON */}
            {icon && (
              <div className="form-card-icon">
                <i className={`pi pi-${icon}`} />
              </div>
            )}

            {/* TITLE + SUBTITLE */}
            <div>
              {title && <h2 className="form-card-title">{title}</h2>}
              {subtitle && <p className="form-card-subtitle">{subtitle}</p>}
            </div>
          </div>

          {/* RIGHT SIDE */}
          {headerAction && (
            <div className="form-card-header-action">{headerAction}</div>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="form-card-body">{children}</div>
    </div>
  );
}
