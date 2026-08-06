import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectAffiliationTypeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
  appendTo?: 'self' | HTMLElement | (() => HTMLElement) | undefined | null;
}

export default function SelectAffiliationType<T extends FieldValues>({
  defaultOptionText,
  label = 'Affiliation Type',
  ...props
}: SelectAffiliationTypeProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const activeData = [
    { affiliationTypeId: 1, name: 'Permanent' },
    { affiliationTypeId: 2, name: 'Temporary' },
  ];

  return (
    <DropDownList
      data={activeData}
      loading={false}
      textField="name"
      valueField="affiliationTypeId"
      optionValue="affiliationTypeId"
      label={label}
      required={true}
      defaultOptionText={defaultOptionText}
      placeholder={
        defaultOptionText === null || defaultOptionText === undefined
          ? `Select ${label}`
          : defaultOptionText
      }
      {...props}
    />
  );
}
