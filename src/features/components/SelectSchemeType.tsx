import { useSchemeTypesQuery } from 'features/master/schemes/scheme-type/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectSchemeTypeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectSchemeType<T extends FieldValues>({
  defaultOptionText,
  label = 'Scheme Type',
  ...props
}: SelectSchemeTypeProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useSchemeTypesQuery();
  const activeData =
    data?.filter(
      (item: Master.Scheme.SchemeTypeItem) => item.isActive === true
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
