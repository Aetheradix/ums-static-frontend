import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { useUserRolesQuery } from '../role/queries';

export default function SelectRoles<T extends FieldValues>({
  label = 'Role',
  disabled,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const { data, isLoading } = useUserRolesQuery();
  return (
    <DropDownList
      data={data}
      loading={isLoading}
      textField={'name'}
      optionValue={'name'}
      label={label}
      placeholder="Select Role"
      disabled={disabled}
      {...props}
    />
  );
}
