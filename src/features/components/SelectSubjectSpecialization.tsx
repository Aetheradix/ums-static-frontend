import { useSubjectSpecializationsQuery } from 'features/master/employee/settings/subject-specialization/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectSubjectSpecializationProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;

  disabled?: boolean;
}

export default function SelectSubjectSpecialization<T extends FieldValues>({
  defaultOptionText,
  label = 'Subject Specialization',
  ...props
}: SelectSubjectSpecializationProps<T> &
  Controls.InputBlockProps & {
    defaultOptionText?: string;
  }) {
  const { data, isLoading } = useSubjectSpecializationsQuery();

  return (
    <DropDownList
      data={data}
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
