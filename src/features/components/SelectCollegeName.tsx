import { useCollegesByCollegeTypeQuery } from 'features/affiliation-management-system/college-registration/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectCollegeNameProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  collegeTypeId?: number;
  label?: string;
  disabled?: boolean;
}

export default function SelectCollegeName<T extends FieldValues>({
  collegeTypeId,
  defaultOptionText,
  label = 'College Name',
  ...props
}: SelectCollegeNameProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = useCollegesByCollegeTypeQuery(collegeTypeId);

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField="collegeName"
      valueField="registrationId"
      optionValue="registrationId"
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
