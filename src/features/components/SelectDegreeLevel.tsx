import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useDegreeLevelsQuery } from '../master/other/degree-level/queries';

interface SelectDegreeLevelProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectDegreeLevel<T extends FieldValues>({
  defaultOptionText,
  label = 'Degree Level',
  ...props
}: SelectDegreeLevelProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useDegreeLevelsQuery();
  const activeData = (data as Master.Other.DegreeLevelItem[]).filter(
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
