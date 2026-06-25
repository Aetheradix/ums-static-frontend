import { useOrganizationUnitsQuery } from 'features/master/employee/settings/organization-unit/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectOrganizationUnitProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectOrganizationUnit<T extends FieldValues>({
  defaultOptionText,
  label = 'Organization Unit',
  ...props
}: SelectOrganizationUnitProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useOrganizationUnitsQuery();

  const activeData =
    data?.filter(
      (item: Master.Employee.OrganizationUnitItem) => item.isActive === true
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
