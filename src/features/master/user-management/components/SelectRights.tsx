import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useRightsQuery } from '../role-permissions/queries';

export default function SelectRights<T extends FieldValues>({
  label = 'Access Right',
  disabled,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const { data, isLoading } = useRightsQuery();

  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField={'name'}
      optionValue={'value'}
      label={label}
      placeholder="Select Access Right"
      disabled={disabled}
      {...props}
    />
  );
}
