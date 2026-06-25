import { useEmploymentNaturesQuery } from 'features/master/employee/settings/nature-of-employment/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectNatureOfEmploymentProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectNatureOfEmployment<T extends FieldValues>({
  defaultOptionText,
  label = 'Nature of Employment',
  ...props
}: SelectNatureOfEmploymentProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useEmploymentNaturesQuery();

  const activeData =
    data?.filter(
      (item: Master.Employee.EmploymentNatureItem) => item.isActive === true
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
