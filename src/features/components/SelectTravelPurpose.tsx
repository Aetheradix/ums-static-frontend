import { useTravelPurposesQuery } from 'features/master/employee/settings/travel-purpose/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectTravelPurposeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectTravelPurpose<T extends FieldValues>({
  defaultOptionText,
  label = 'Travel Purpose',
  ...props
}: SelectTravelPurposeProps<T> &
  Controls.InputBlockProps & {
    defaultOptionText?: string;
  }) {
  const { data, isLoading } = useTravelPurposesQuery();

  return (
    <DropDownList
      data={data}
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
