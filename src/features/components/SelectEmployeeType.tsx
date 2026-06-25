import { useEmployeeTypeQuery } from 'features/master/other/employee-type/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
interface SelectEmployeeTypeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectEmployeeType<T extends FieldValues>({
  defaultOptionText,
  label = 'Employee Type',
  ...props
}: SelectEmployeeTypeProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useEmployeeTypeQuery();

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
