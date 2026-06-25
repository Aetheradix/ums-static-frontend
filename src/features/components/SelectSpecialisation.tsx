import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useSpecialisationsQuery } from '../master/other/specialisation/queries';

interface SelectSpecialisationProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectSpecialisation<T extends FieldValues>({
  defaultOptionText,
  label = 'Specialization',
  ...props
}: SelectSpecialisationProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useSpecialisationsQuery();
  const activeData = (data as Master.Other.SpecialisationItem[]).filter(
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
