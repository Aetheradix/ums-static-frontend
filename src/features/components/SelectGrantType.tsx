import { useGrantTypesQuery } from 'features/master/grant/grant-type/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectGrantTypeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectGrantType<T extends FieldValues>({
  defaultOptionText,
  label = 'Grant Type',
  ...props
}: SelectGrantTypeProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useGrantTypesQuery();
  const activeData =
    data?.filter(
      (item: Master.Grant.GrantTypeItem) => item.isActive === true
    ) || [];

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
