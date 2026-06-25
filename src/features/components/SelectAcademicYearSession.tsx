import { useAcademicYearsQuery } from 'features/master/other/academic-year/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectAcademicYearSessionProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectAcademicYearSession<T extends FieldValues>({
  defaultOptionText,
  label = 'Session',
  ...props
}: SelectAcademicYearSessionProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useAcademicYearsQuery();

  const activeData =
    data?.filter(
      (item: Master.Other.AcademicYearItem) => item.isActive === true
    ) || [];

  return (
    <DropDownList
      data={activeData}
      loading={isLoading}
      textField="session"
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
