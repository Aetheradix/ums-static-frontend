import { useSemesterQuery } from 'features/master/other/semester/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectSemesterProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
  data?: any[];
  loading?: boolean;
  value?: string | number | null;
  onChange?: (value: string | number | null) => void;
}

export default function SelectSemester<T extends FieldValues>({
  defaultOptionText,
  label = 'Semester',
  data: customData,
  loading: customLoading,
  ...props
}: SelectSemesterProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data: queryData, isLoading: queryLoading } = useSemesterQuery({
    enabled: customData === undefined,
  });

  const data = customData !== undefined ? customData : queryData;
  const isLoading = customLoading !== undefined ? customLoading : queryLoading;

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField="text"
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
