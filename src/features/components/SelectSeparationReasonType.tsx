import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useSeparationReasonTypesQuery } from '../master/employee/settings/separation-reason-type/queries';

interface SelectSeparationReasonTypeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectSeparationReasonType<T extends FieldValues>({
  defaultOptionText,
  label = 'Separation Reason Type',
  ...props
}: SelectSeparationReasonTypeProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useSeparationReasonTypesQuery();
  const activeData = data.filter(item => item.isActive);

  return (
    <DropDownList
      data={activeData}
      loading={isLoading}
      textField="name"
      valueField="id"
      optionValue="id"
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
