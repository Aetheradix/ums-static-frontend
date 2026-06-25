import { useAccommodationTypesQuery } from 'features/master/other/accommodation-type/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectAccommodationTypeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectAccommodationType<T extends FieldValues>({
  defaultOptionText,
  label = 'Accommodation Type',
  ...props
}: SelectAccommodationTypeProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useAccommodationTypesQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField="text"
      valueField="text"
      optionValue="text"
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
