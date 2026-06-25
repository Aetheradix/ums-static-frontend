import { usePatentStatusQuery } from 'features/master/other/patent-status/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectPatentStatusProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectPatentStatus<T extends FieldValues>({
  defaultOptionText,
  label = 'Patent Status',
  ...props
}: SelectPatentStatusProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = usePatentStatusQuery();

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
