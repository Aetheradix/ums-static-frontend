import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useProgrammesQuery } from '../master/other/programme/queries';

interface SelectProgrammeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectProgramme<T extends FieldValues>({
  defaultOptionText,
  label = 'Programme',
  ...props
}: SelectProgrammeProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useProgrammesQuery();
  const activeData = (data as Master.Other.ProgrammeItem[]).filter(
    item => item.isActive
  );

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
