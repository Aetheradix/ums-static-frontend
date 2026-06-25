import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useFacultiesQuery } from '../master/faculty/faculty/queries';

interface SelectFacultyProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectFaculty<T extends FieldValues>({
  defaultOptionText,
  label = 'Reporting Officer',
  ...props
}: SelectFacultyProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useFacultiesQuery();
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
