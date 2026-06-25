import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useDesignationTypesQuery } from '../master/hr/designation-type/queries';

interface SelectDesignationTypeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectDesignationType<T extends FieldValues>({
  defaultOptionText,
  label = 'Designation Type',
  ...props
}: SelectDesignationTypeProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useDesignationTypesQuery();
  const activeData = data.filter(item => item.isActive);

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
