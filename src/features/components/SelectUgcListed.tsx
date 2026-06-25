import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { getUgcListedQuery } from '../master/other/ugc-listed/queries';

interface SelectUgcListedProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectUgcListed<T extends FieldValues>({
  defaultOptionText,
  label = 'UGC Listed',
  ...props
}: SelectUgcListedProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = getUgcListedQuery();

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
