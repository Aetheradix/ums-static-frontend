import { useAppraisalApplicationForwardedToTypeQuery } from 'features/master/other/appraisal-application-forward-type/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
interface SelectAppraisalApplicationForwardedToTypeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectAppraisalApplicationForwardedToType<
  T extends FieldValues,
>({
  defaultOptionText,
  label = 'Appraisal Application Forwarded To Type',
  ...props
}: SelectAppraisalApplicationForwardedToTypeProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useAppraisalApplicationForwardedToTypeQuery();

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
