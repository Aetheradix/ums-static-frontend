import { useTravelReasonQuery } from 'features/master/other/travel-reason/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectTravelReasonProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectTravelReason<T extends FieldValues>({
  defaultOptionText,
  label = 'Travel Reason',
  ...props
}: SelectTravelReasonProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useTravelReasonQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField="text"
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
