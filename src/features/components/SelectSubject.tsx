import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useSubjectsQuery } from '../master/subject/subjects/queries';

interface SelectSubjectProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectSubject<T extends FieldValues>({
  label = 'Subject',
  ...props
}: SelectSubjectProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useSubjectsQuery();
  const activeData = data.filter(item => item.isActive);

  return (
    <DropDownList
      data={activeData}
      loading={isLoading}
      textField="subjectName"
      valueField="id"
      optionValue="id"
      label={label}
      required={true}
      placeholder={`Select ${label}`}
      {...props}
    />
  );
}
