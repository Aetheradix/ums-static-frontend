import { usePerformanceRatingQuery } from 'features/master/other/performance-rating/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
interface SelectPerformanceRatingProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectPerformanceRating<T extends FieldValues>({
  defaultOptionText,
  label = 'Performance Rating',
  ...props
}: SelectPerformanceRatingProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = usePerformanceRatingQuery();

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
