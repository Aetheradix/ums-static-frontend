import { usePublicationTypeQuery } from 'features/master/other/publication-type/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectPublicationTypeProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectPublicationType<T extends FieldValues>({
  defaultOptionText,
  label = 'Publication Type',
  ...props
}: SelectPublicationTypeProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = usePublicationTypeQuery();

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
