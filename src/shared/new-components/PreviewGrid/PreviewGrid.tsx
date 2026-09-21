import React from 'react';
import FormGrid from '../FormGrid';
import PreviewField from '../PreviewField/PreviewField';

export interface PreviewGridField {
  label: string;
  value?: React.ReactNode;
  /** Renders a control in this cell instead of a read-only value — dropdowns, inputs, badges. */
  control?: React.ReactNode;
  fullWidth?: boolean;
  breakWord?: boolean;
  hidden?: boolean;
}

interface PreviewGridProps {
  fields: PreviewGridField[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function PreviewGrid({
  fields,
  columns = 4,
  className = '',
}: PreviewGridProps) {
  const visible = fields.filter(field => !field.hidden);

  return (
    <FormGrid columns={columns} className={className}>
      {visible.map(field =>
        field.control !== undefined ? (
          <div
            key={field.label}
            className={field.fullWidth ? 'md:col-span-2 lg:col-span-3' : ''}
          >
            {field.control}
          </div>
        ) : (
          <PreviewField
            key={field.label}
            label={field.label}
            value={field.value}
            fullWidth={field.fullWidth}
            breakWord={field.breakWord}
          />
        )
      )}
    </FormGrid>
  );
}
