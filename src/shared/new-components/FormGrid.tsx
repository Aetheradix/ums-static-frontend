import React from 'react';
import './FormGrid.css';

interface FormGridProps {
  columns?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

const COLUMN_CLASSES: Record<number, string> = {
  1: 'form-grid-cols-1',
  2: 'form-grid-cols-2',
  3: 'form-grid-cols-3',
  4: 'form-grid-cols-4',
};

export default function FormGrid({
  columns = 2,
  children,
  className = '',
}: FormGridProps) {
  return (
    <div className={`form-grid ${COLUMN_CLASSES[columns]} ${className}`.trim()}>
      {children}
    </div>
  );
}
