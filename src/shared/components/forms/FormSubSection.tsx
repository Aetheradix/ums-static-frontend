import React from 'react';
import './FormSubSection.css';

interface Props {
  title: string;
  icon?: string;
  className?: string;
}

export default function FormSubSection({
  title,
  icon,
  className = '',
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <div className={`form-subsection ${className}`}>
      <div className="form-subsection-header">
        {icon && <i className={`pi pi-${icon} form-subsection-icon`} />}
        <span className="form-subsection-title">{title}</span>
      </div>
      <div className="form-subsection-content">{children}</div>
    </div>
  );
}
