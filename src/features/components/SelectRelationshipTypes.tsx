import { useRelationshipQuery } from 'features/master/other/relationship/queries';
import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';

interface SelectRelationshipProps<
  T extends FieldValues,
> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectRelationshipTypes<T extends FieldValues>({
  defaultOptionText,
  label = 'Relationship',
  ...props
}: SelectRelationshipProps<T> &
  Controls.InputBlockProps & {
    defaultOptionText?: string;
  }) {
  const { data, isLoading } = useRelationshipQuery();

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
