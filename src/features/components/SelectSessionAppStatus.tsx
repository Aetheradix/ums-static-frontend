import { useAppraisalApplicationStatusQuery } from 'features/master/other/appraisal-application-status/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectSessionAppStatusProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
  value?: string | number | null;
  onChange?: (value: unknown) => void;
}

export default function SelectSessionAppStatus<T extends FieldValues>({
  defaultOptionText,
  label = 'Application Status',
  ...props
}: SelectSessionAppStatusProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useAppraisalApplicationStatusQuery();

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
