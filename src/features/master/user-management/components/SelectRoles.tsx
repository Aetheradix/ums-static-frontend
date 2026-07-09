import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { ROLES } from '../static-data';

export default function SelectRoles<T extends FieldValues>({
  label = 'Role',
  disabled,
  ...props
}: Controls.FormProps<T> & {
  label?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <DropDownList
      data={ROLES}
      textField={'name'}
      optionValue={'name'}
      label={label}
      placeholder="Select Role"
      disabled={disabled}
      {...props}
    />
  );
}
